"use server";

import { PrismaClient } from "./generated/prisma/client";
import type {
    AppointmentUpdateInput,
    AppointmentWhereInput,
} from "./generated/prisma/models/Appointment";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getAppointments(
    startDate?: Date | string,
    endDate?: Date | string,
    patientName?: string,
    status?: string
) {
    let where: AppointmentWhereInput = {};

    const conditions: AppointmentWhereInput[] = [];

    if (startDate && endDate) {
        conditions.push({
            appointment_date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        });
    }

    if (status && status !== 'All') {
        conditions.push({
            appointment_status: {
                equals: status,
            }
        })
    }

    if (patientName) {
        conditions.push({
            OR: [
                { first_name: { contains: patientName } },
                { last_name: { contains: patientName } }
            ]
        })
    }

    if (conditions.length > 0) {
        where = { AND: conditions }
    }

    const appointments = await prisma.appointment.findMany({
        where,
        orderBy: {
            appointment_date: "desc",
        },
    });
    return appointments;
}

export async function getAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({
        where: { id },
    });
    return appointment;
}

export async function updateAppointment(
    id: string,
    data: AppointmentUpdateInput,
) {
    await prisma.appointment.update({
        where: { id },
        data,
    });
    revalidatePath("/");
    revalidatePath(`/appointments/${id}`);
    revalidatePath(`/patients/appointment/${id}`);
}

export async function findAppointmentByPatient(
    firstName: string,
    lastName: string,
    appointmentDate: string
): Promise<{ id: string } | null> {
    // Use UTC boundaries to avoid local-timezone shifts
    const [year, month, day] = appointmentDate.split("-").map(Number);
    const dayStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const appointments = await prisma.appointment.findMany({
        where: {
            appointment_date: { gte: dayStart, lte: dayEnd },
        },
        select: { id: true, first_name: true, last_name: true },
    });

    // Case-insensitive name match (SQLite doesn't support mode: "insensitive")
    const match = appointments.find(
        (a) =>
            a.first_name?.toLowerCase() === firstName.trim().toLowerCase() &&
            a.last_name?.toLowerCase() === lastName.trim().toLowerCase()
    );

    return match ? { id: match.id } : null;
}

export async function submitIntakeAnswers(
    id: string,
    answers: Record<string, string | number | boolean | null>
) {
    const { intakeAnswersSchema } = await import("@/lib/validation");
    intakeAnswersSchema.parse(answers);
    await prisma.appointment.update({
        where: { id },
        data: { intake_answers: JSON.parse(JSON.stringify(answers)) },
    });
    revalidatePath("/");
    revalidatePath(`/appointments/${id}`);
    revalidatePath(`/patients/appointment/${id}`);
}
