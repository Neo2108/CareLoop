"use client";

import { useState } from "react";
import { PhoneArrowUpRightIcon } from "@heroicons/react/24/outline";

export default function TriggerCallsButton() {
  const [triggered, setTriggered] = useState(false);

  const handleClick = () => {
    setTriggered(true);
    setTimeout(() => setTriggered(false), 4000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={triggered}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <PhoneArrowUpRightIcon className="w-5 h-5 flex-shrink-0" />
        <span className="hidden sm:inline">
          {triggered ? "Calls Triggered!" : "Trigger Reminder Calls"}
        </span>
        <span className="sm:hidden">{triggered ? "✓" : "Remind"}</span>
      </button>

      {triggered && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg whitespace-nowrap z-10 text-sm font-medium">
          Reminder calls triggered
        </div>
      )}
    </div>
  );
}
