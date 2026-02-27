"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientAppointmentPage({ params }: PageProps) {
  const router = useRouter();
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleAction = async (action: "confirm" | "cancel" | "reschedule") => {
    setMessage(`Appointment ${action}ed successfully!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to success page
    router.push("/patients/appointment/success");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Appointment
          </h1>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Appointment Details Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Appointment Details
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>February 5, 2026 at 10:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Provider:</span>
              <span>Dr. Smith</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Reason:</span>
              <span>Annual Checkup</span>
            </div>
          </div>

          {/* Action Buttons */}
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

        {/* Intake Questions Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Intake Questions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Please answer the following questions to help us prepare for your
            appointment.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question 1 */}
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

            {/* Question 2 */}
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

            {/* Submit Button */}
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
    </div>
  );
}
