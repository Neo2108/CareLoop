"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findAppointmentByPatient } from "@/app/actions";

export default function PatientLoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const appointment = await findAppointmentByPatient(
        firstName,
        lastName,
        appointmentDate
      );

      if (!appointment) {
        setError(
          "No appointment found. Please check your name and appointment date."
        );
        setLoading(false);
        return;
      }

      router.push(`/patients/appointment/${appointment.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Your Appointment
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Enter your name and appointment date to view your intake form.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Jane"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Appointment Date
            </label>
            <input
              id="appointmentDate"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Looking up appointment..." : "View My Appointment"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-zinc-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Are you a staff member?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Staff login →
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
            Demo patients:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
            <li>John Doe — 2/15/2026</li>
            <li>Frank Miller — 2/28/2026</li>
            <li>Alice Johnson — 3/5/2026</li>
            <li>Ivy Taylor — 3/10/2026</li>
            <li>Eve Wilson — 4/12/2026</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
