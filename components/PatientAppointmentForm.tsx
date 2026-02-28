"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitIntakeAnswers, updateAppointment } from "@/app/actions";

interface PatientAppointmentFormProps {
  appointment: {
    id: string;
    appointment_date: Date | null;
    appointment_reason: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function PatientAppointmentForm({
  appointment,
}: PatientAppointmentFormProps) {
  const router = useRouter();
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const appointmentDate = appointment.appointment_date
    ? new Date(appointment.appointment_date).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "TBD";

  const handleAction = async (
    action: "confirm" | "cancel" | "reschedule"
  ) => {
    try {
      const statusMap = {
        confirm: "confirmed",
        cancel: "cancelled",
        reschedule: "unconfirmed",
      };
      await updateAppointment(appointment.id, {
        appointment_status: statusMap[action],
      });
      setMessage(`Appointment ${action}ed successfully!`);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage(`Failed to ${action} appointment.`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitIntakeAnswers(appointment.id, {
        anxiety_frequency: question1,
        worry_control: question2,
      });
      router.push("/patients/appointment/success");
    } catch {
      setMessage("Failed to submit intake. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Appointment Details
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{appointmentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Reason:</span>
            <span>{appointment.appointment_reason || "—"}</span>
          </div>
          {appointment.first_name && (
            <div className="flex justify-between">
              <span className="font-medium">Patient:</span>
              <span>
                {appointment.first_name} {appointment.last_name}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleAction("confirm")}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Confirm
          </button>
          <button
            onClick={() => handleAction("reschedule")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Reschedule
          </button>
          <button
            onClick={() => handleAction("cancel")}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Intake Questions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please answer the following questions to help us prepare for your
          appointment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-base font-medium text-gray-900 dark:text-white mb-3">
              1. Over the past two weeks, how often have you been feeling
              nervous, anxious, or on edge?
            </label>
            <div className="space-y-2">
              {[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center p-3 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="question1"
                    value={option}
                    checked={question1 === option}
                    onChange={(e) => setQuestion1(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                    required
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 dark:text-white mb-3">
              2. Over the past two weeks, how often have you not been able to
              stop or control worrying?
            </label>
            <div className="space-y-2">
              {[
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center p-3 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="question2"
                    value={option}
                    checked={question2 === option}
                    onChange={(e) => setQuestion2(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                    required
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Intake Questions"}
          </button>
        </form>
      </div>
    </div>
  );
}
