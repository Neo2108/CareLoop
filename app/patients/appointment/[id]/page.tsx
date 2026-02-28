import { getAppointment } from "@/app/actions";
import PatientAppointmentForm from "@/components/PatientAppointmentForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientAppointmentPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Appointment
        </h1>
      </div>
      <PatientAppointmentForm appointment={appointment} />
    </div>
  );
}
