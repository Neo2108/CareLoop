import AppointmentTable from "@/components/AppointmentTable";
import { getAppointments } from "./actions";
import TriggerCallsButton from "@/components/TriggerCallsButton";
import SignOutButton from "@/components/SignOutButton";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const appointments = await getAppointments();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Image
            src="/careloop_logo.png"
            width={40}
            height={40}
            className="h-10 w-auto flex-shrink-0"
            alt="Careloop Logo"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
            Appointments Dashboard
          </h1>
          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            <TriggerCallsButton />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <AppointmentTable initialAppointments={appointments} />
      </main>
    </div>
  );
}
