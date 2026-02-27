"use client";

import { useState } from "react";
import { PhoneArrowUpRightIcon } from "@heroicons/react/24/outline";

export default function TriggerCallsButton() {
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleTriggerCalls = async () => {
    setTriggering(true);
    setMessage(null);

    try {
      const response = await fetch("/api/initiate-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: "demo-batch-call" }),
      });

      if (!response.ok) {
        throw new Error("Failed to trigger calls");
      }

      setMessage({
        type: "success",
        text: "Outbound reminder calls triggered successfully! (Demo call initiated to your phone)",
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to trigger calls. Please try again.",
      });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleTriggerCalls}
        disabled={triggering}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <PhoneArrowUpRightIcon className="w-5 h-5" />
        {triggering
          ? "Triggering..."
          : "Trigger All Outbound Reminder Calls for Today"}
      </button>

      {message && (
        <div
          className={`absolute top-full right-0 mt-2 p-3 rounded-lg shadow-lg whitespace-nowrap z-10 ${
            message.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
