"use client";

import { AppointmentModel as Appointment } from "@/app/generated/prisma/models/Appointment";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAppointments } from "@/app/actions";

interface AppointmentTableProps {
  initialAppointments: Appointment[];
}

export default function AppointmentTable({
  initialAppointments,
}: AppointmentTableProps) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(
    new Set(),
  );
  const [showModal, setShowModal] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "sms" | "email" | "both"
  >("both");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchFiltered() {
      // If all filters are empty, we might want default behavior, but here we just pass them all
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      const data = await getAppointments(
        start,
        end,
        patientName,
        status === "All" ? undefined : status,
      );
      setAppointments(data);
    }
    // Debounce patient name search slightly to avoid too many requests?
    // For now, let's just run it. The user didn't ask for debounce but "re-query".
    const timeoutId = setTimeout(() => {
      fetchFiltered();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, patientName, status]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const getRowClass = (status: string | null) => {
    const s = status?.toLowerCase();
    if (s === "cancelled" || s === "unreachable") {
      return "bg-red-100 dark:bg-red-900/30";
    }
    return "hover:bg-gray-50 dark:hover:bg-gray-800/50";
  };

  const statusStyles: Record<
    string,
    { backgroundColor: string; color: string }
  > = {
    booked: { backgroundColor: "#DBEAFE", color: "#1E40AF" }, // Blue
    unconfirmed: { backgroundColor: "#f8f6e3ff", color: "#854D0E" }, // Yellow
    confirmed: { backgroundColor: "#DCFCE7", color: "#166534" }, // Green
    cancelled: { backgroundColor: "#fac7c7ff", color: "#991B1B" }, // Red
    unreachable: { backgroundColor: "#F4F4F5", color: "#27272A" }, // Zinc
  };

  const prefillOptions = [
    {
      label: "Virtual visit due to weather",
      text: "Your appointment has been changed to a virtual visit via Zoom due to inclement weather. Please join your appointment via the link that will be sent to you separately.",
    },
    {
      label: "Appointment rescheduled",
      text: "Your appointment has been rescheduled. Please check your updated appointment details and contact us if you have any questions.",
    },
    {
      label: "Office closure notice",
      text: "Our office will be closed today due to unforeseen circumstances. Your appointment has been rescheduled. We apologize for any inconvenience and will contact you shortly with a new appointment time.",
    },
  ];

  const toggleAppointmentSelection = (id: string) => {
    const newSelection = new Set(selectedAppointments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAppointments(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedAppointments.size === appointments.length) {
      setSelectedAppointments(new Set());
    } else {
      setSelectedAppointments(new Set(appointments.map((apt) => apt.id)));
    }
  };

  const handleSendNotification = () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowModal(false);
      setMessage("");
      setSelectedAppointments(new Set());
    }, 2000);
  };

  const handlePrefillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const option = prefillOptions[parseInt(value)];
      if (option) {
        setMessage(option.text);
      }
    }
  };

  return (
    <div className="space-y-4">
      {selectedAppointments.size > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            Send Mass Notification ({selectedAppointments.size} selected)
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search name..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <select
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="booked">Booked</option>
              <option value="unconfirmed">Unconfirmed</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="unreachable">Unreachable</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Date From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Date To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase font-medium">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedAppointments.size === appointments.length &&
                    appointments.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3">Patient Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Appointment Reason</th>
              <th className="px-6 py-3">Appointment Date</th>
              <th className="px-6 py-3">Reminder Called At</th>
              <th className="px-6 py-3 text-right sticky right-0 bg-gray-100 dark:bg-gray-800">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className={`transition-colors ${getRowClass(apt.appointment_status)}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAppointments.has(apt.id)}
                      onChange={() => toggleAppointmentSelection(apt.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {apt.first_name} {apt.last_name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-semibold"
                      style={
                        statusStyles[
                          apt.appointment_status?.toLowerCase() || ""
                        ] || { backgroundColor: "#E5E7EB", color: "#1F2937" }
                      }
                    >
                      {apt.appointment_status
                        ? apt.appointment_status.charAt(0).toUpperCase() +
                          apt.appointment_status.slice(1)
                        : "Unknown"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4"
                    title={apt.appointment_reason || ""}
                  >
                    {apt.appointment_reason &&
                    apt.appointment_reason.length > 40
                      ? `${apt.appointment_reason.substring(0, 40)}...`
                      : apt.appointment_reason || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(apt.appointment_date)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(apt.reminder_called_at)}
                  </td>
                  <td className="px-6 py-4 text-right sticky right-0 bg-white dark:bg-zinc-900">
                    <Link
                      href={`/appointments/${apt.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mass Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Send Mass Notification
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter a message to be sent to {selectedAppointments.size} selected
              patient{selectedAppointments.size > 1 ? "s" : ""}
            </p>

            {/* Radio Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Notification Method
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="sms"
                    checked={notificationType === "sms"}
                    onChange={(e) =>
                      setNotificationType(e.target.value as "sms")
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">SMS</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="email"
                    checked={notificationType === "email"}
                    onChange={(e) =>
                      setNotificationType(e.target.value as "email")
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Email
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    checked={notificationType === "both"}
                    onChange={(e) =>
                      setNotificationType(e.target.value as "both")
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Both</span>
                </label>
              </div>
            </div>

            {/* Prefill Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Prefill Reason
              </label>
              <select
                onChange={handlePrefillSelect}
                className="border rounded p-2 text-black w-full"
                defaultValue=""
              >
                <option value="">-- Select a template --</option>
                {prefillOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Textarea */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="border rounded p-2 text-black w-full resize-none"
                placeholder="Enter your message here..."
              />
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Mass notification sent successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
