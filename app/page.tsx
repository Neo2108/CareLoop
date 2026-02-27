import AppointmentTable from "@/components/AppointmentTable";
import { getAppointments } from "./actions";
import TriggerCallsButton from "@/components/TriggerCallsButton";

export default async function Home() {
  const appointments = await getAppointments();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="flex justify-left gap-10 items-center mb-8">
          <img src="./careloop_logo.png" className="h-12" alt="Careloop Logo" />
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Appointments Dashboard
          </h1>
          <div className="ml-auto">
            <TriggerCallsButton />
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <AppointmentTable initialAppointments={appointments} />
        </div>
      </main>
    </div>
  );
}
