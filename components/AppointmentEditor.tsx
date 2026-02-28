"use client";

import type {
    AppointmentModel,
    AppointmentUpdateInput,
} from "@/app/generated/prisma/models/Appointment";
import { useState } from "react";
import { updateAppointment } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
    PhoneIcon,
    ClipboardDocumentListIcon,
    DocumentCheckIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface AppointmentEditorProps {
    appointment: AppointmentModel;
}

export default function AppointmentEditor({
    appointment,
}: AppointmentEditorProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<AppointmentModel>(appointment);
    const [questionnaire, setQuestionnaire] = useState<string>("GAD-7");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fetchingIntake, setFetchingIntake] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);
    const [preferredCallTime, setPreferredCallTime] =
        useState<string>("1_day_10am");

    const handleChange = (
        field: keyof AppointmentModel,
        value: string | boolean | Date | null | object,
    ) => {
        setFormData((prev: AppointmentModel) => ({ ...prev, [field]: value }));
    };

    const validatePhone = (phone: string | null) => {
        if (!phone || phone.trim() === "") return true;
        // E.164 regex
        return /^\+[1-9]\d{1,14}$/.test(phone.trim());
    };

    const parseIntakeAnswers = () => {
        if (!formData.intake_answers) return null;
        try {
            const parsed = formData.intake_answers;
            if (Array.isArray(parsed)) {
                return parsed;
            }
            if (typeof parsed === "object") {
                return Object.entries(parsed).map(([key, value]) => ({
                    [key]: value,
                }));
            }
            return null;
        } catch {
            return null;
        }
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        // Validate required fields
        if (!formData.first_name || formData.first_name.trim() === "") {
            setError("First name is required");
            return;
        }
        if (!formData.last_name || formData.last_name.trim() === "") {
            setError("Last name is required");
            return;
        }
        if (
            !formData.appointment_reason ||
            formData.appointment_reason.trim() === ""
        ) {
            setError("Appointment reason is required");
            return;
        }
        if (
            !formData.appointment_status ||
            formData.appointment_status.trim() === ""
        ) {
            setError("Status is required");
            return;
        }
        if (!formData.appointment_date) {
            setError("Appointment date is required");
            return;
        }
        if (
            !formData.default_outbound_language ||
            formData.default_outbound_language.trim() === ""
        ) {
            setError("Language is required");
            return;
        }

        if (!validatePhone(formData.phone_number)) {
            setError("Phone number must be in E.164 format (e.g., +1234567890)");
            return;
        }

        setSaving(true);
        try {
            await updateAppointment(appointment.id, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                appointment_reason: formData.appointment_reason,
                appointment_status: formData.appointment_status,
                appointment_date: formData.appointment_date,
                default_outbound_language: formData.default_outbound_language,
                requires_post_appointment_followup:
                    formData.requires_post_appointment_followup,
                reminder_called_at: formData.reminder_called_at,
                sms_reminder_sent_at: formData.sms_reminder_sent_at,
            });
            setSuccess("Appointment updated successfully!");
            router.refresh();
        } catch (e) {
            setError("Failed to save changes");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleFetchIntakeResponses = async () => {
        setFetchingIntake(true);

        try {
            const intakeData = [
                {
                    "Over the past two weeks, how often have you been feeling nervous, anxious, or on edge?":
                        "Daily",
                },
                {
                    "Over the past two weeks, how often have you not been able to stop or control worrying?":
                        "Sometimes I'm unable to stop worrying a few times a week",
                },
            ];

            const parsedAnswers = JSON.parse(
                JSON.stringify(intakeData)
            ) as AppointmentModel["intake_answers"];
            await updateAppointment(appointment.id, {
                intake_answers: parsedAnswers as AppointmentUpdateInput["intake_answers"],
            });

            // Update local state immediately
            setFormData((prev: AppointmentModel) => ({
                ...prev,
                intake_answers: parsedAnswers,
            }));
        } catch (e) {
            setError("Failed to fetch intake responses");
            console.error(e);
        } finally {
            setFetchingIntake(false);
        }
    };

    const handleSendSMS = async () => {
        setError(null);
        setSuccess(null);
        setSendingSMS(true);

        try {
            const response = await fetch("/api/send-sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    appointmentId: appointment.id,
                }),
            });

            if (response.ok) {
                const currentTimestamp = new Date();

                // Update appointment with SMS sent timestamp
                await updateAppointment(appointment.id, {
                    sms_reminder_sent_at: currentTimestamp,
                });

                // Update local state immediately
                setFormData((prev: AppointmentModel) => ({
                    ...prev,
                    sms_reminder_sent_at: currentTimestamp,
                }));

                setSuccess("SMS reminder sent successfully!");
            } else {
                setError("Failed to send SMS reminder");
            }
        } catch (e) {
            setError("Failed to send SMS reminder");
            console.error(e);
        } finally {
            setSendingSMS(false);
        }
    };

    const intakeAnswers = parseIntakeAnswers();

    return (
        <div className="flex gap-6">
            <div className="flex-1 space-y-6 max-w-3xl bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        {success}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Row 1: First Name, Last Name, Appointment Date */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.first_name || ""}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.last_name || ""}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Appointment Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={
                                    formData.appointment_date
                                        ? new Date(formData.appointment_date)
                                            .toISOString()
                                            .slice(0, 16)
                                        : ""
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "appointment_date",
                                        e.target.value ? new Date(e.target.value) : null,
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Phone Number (1/3), Appointment Reason (2/3) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.phone_number || ""}
                                onChange={(e) => handleChange("phone_number", e.target.value)}
                                placeholder="+1234567890"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Appointment Reason <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.appointment_reason || ""}
                                onChange={(e) =>
                                    handleChange("appointment_reason", e.target.value)
                                }
                                placeholder="e.g., Annual checkup, Follow-up visit"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Status, Language, Questionnaire */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.appointment_status || ""}
                                onChange={(e) =>
                                    handleChange("appointment_status", e.target.value)
                                }
                                required
                            >
                                <option value="booked">Booked</option>
                                <option value="unconfirmed">Unconfirmed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="unreachable">Unreachable</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Language <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={formData.default_outbound_language || "English"}
                                onChange={(e) =>
                                    handleChange("default_outbound_language", e.target.value)
                                }
                                required
                            >
                                <option value="English">English</option>
                                <option value="French">French</option>
                                <option value="Ojibwe">Ojibwe</option>
                                <option value="Cree">Cree</option>
                                <option value="Inuktitut">Inuktitut</option>
                                <option value="Mi'kmaq">Mi&apos;kmaq</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Questionnaire
                            </label>
                            <select
                                className="w-full border rounded p-2 dark:bg-zinc-800"
                                value={questionnaire}
                                onChange={(e) => setQuestionnaire(e.target.value)}
                            >
                                <option value="">None</option>
                                <option value="GAD-7">Anxiety GAD-7</option>
                                <option value="PHQ-9">Depression PHQ-9</option>
                                <option value="PCL-5">PTSD PCL-5</option>
                                <option value="AUDIT-C">Alcohol Use AUDIT-C</option>
                                <option value="PSS-10">Stress PSS-10</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 4: Requires Follow-up */}
                    <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.requires_post_appointment_followup || false}
                                onChange={(e) =>
                                    handleChange(
                                        "requires_post_appointment_followup",
                                        e.target.checked,
                                    )
                                }
                                className="w-5 h-5 rounded dark:bg-zinc-800"
                            />
                            <span className="text-base font-medium">
                                Requires Post-Appointment Follow-up
                            </span>
                        </label>
                    </div>

                    {/* Row 5: Reminder Called At, SMS Reminder Sent At */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Reminder Called At
                            </label>
                            <p className="text-sm p-2 bg-gray-50 dark:bg-zinc-800 rounded border dark:border-zinc-700">
                                {formData.reminder_called_at
                                    ? new Date(formData.reminder_called_at).toLocaleString()
                                    : "Not called yet"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                <a
                                    href={`/patients/appointment/${appointment.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    SMS Reminder
                                </a>{" "}
                                Sent At
                            </label>
                            <p className="text-sm p-2 bg-gray-50 dark:bg-zinc-800 rounded border dark:border-zinc-700">
                                {formData.sms_reminder_sent_at
                                    ? new Date(formData.sms_reminder_sent_at).toLocaleString()
                                    : "Not sent yet"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={handleSendSMS}
                        disabled={sendingSMS}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        {sendingSMS ? "Sending..." : "Send SMS Reminder"}
                    </button>
                    <button
                        onClick={handleFetchIntakeResponses}
                        disabled={fetchingIntake}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DocumentCheckIcon className="w-5 h-5" />
                        {fetchingIntake ? "Fetching..." : "Fetch Intake Responses"}
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Intake Answers
                    </label>
                    {intakeAnswers && intakeAnswers.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 p-4 border rounded dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
                            {intakeAnswers.map((item, index) => {
                                if (!item || typeof item !== "object") return null;
                                const entries = Object.entries(item);
                                return entries.map(([question, answer], i) => (
                                    <li key={`${index}-${i}`} className="text-sm">
                                        <strong>{question}:</strong> {String(answer)}
                                    </li>
                                ));
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm p-4 border rounded dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
                            None
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="w-80 space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                        <ClipboardDocumentListIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                            Questionnaire System
                        </h3>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                        The questionnaire selection determines which intake questions are
                        asked during the initial contact with the patient. If no
                        questionnaire is selected, no intake questions will be asked. The
                        answers provided are stored and displayed in the &quot;Intake
                        Answers&quot; section.
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                        <PhoneIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            Follow-up System
                        </h3>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        When &quot;Requires Post-Appointment Follow-up&quot; is checked, the
                        system will automatically call the patient at the selected preferred time
                        to complete a follow-up questionnaire based on their appointment
                        reason.
                    </p>
                    <div>
                        <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Preferred Call Time
                        </label>
                        <select
                            className="w-full border rounded p-2 text-sm bg-white dark:bg-zinc-800 dark:border-blue-700"
                            value={preferredCallTime}
                            onChange={(e) => setPreferredCallTime(e.target.value)}
                        >
                            <option value="1_hour">1 hour after appointment</option>
                            <option value="1_day_8am">1 day after at 8:00 AM</option>
                            <option value="1_day_10am">1 day after at 10:00 AM</option>
                            <option value="1_day_12pm">1 day after at 12:00 PM</option>
                            <option value="1_day_2pm">1 day after at 2:00 PM</option>
                            <option value="1_day_4pm">1 day after at 4:00 PM</option>
                            <option value="2_days_10am">2 days after at 10:00 AM</option>
                            <option value="2_days_2pm">2 days after at 2:00 PM</option>
                            <option value="3_days_10am">3 days after at 10:00 AM</option>
                            <option value="3_days_2pm">3 days after at 2:00 PM</option>
                            <option value="7_days_10am">7 days after at 10:00 AM</option>
                            <option value="7_days_2pm">7 days after at 2:00 PM</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
