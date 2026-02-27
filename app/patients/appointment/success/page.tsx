import Link from "next/link";

export default function IntakeSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your intake questionnaire has been submitted successfully. We look
          forward to seeing you at your appointment.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          You can now close this window.
        </p>
      </div>
    </div>
  );
}
