import { getAppointment } from "@/app/actions";
import AppointmentEditor from "@/components/AppointmentEditor";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 font-sans">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Appointment Details
          </h1>
        </div>

        <AppointmentEditor appointment={appointment} />
      </main>
    </div>
  );
}
