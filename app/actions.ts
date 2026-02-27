"use server";

import { PrismaClient } from "./generated/prisma/client";
import type {
    AppointmentModel,
    AppointmentUpdateInput,
} from "./generated/prisma/models/Appointment";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getAppointments(
    startDate?: Date | string,
    endDate?: Date | string,
    patientName?: string,
    status?: string
) {
    let where: any = {};

    const conditions: any[] = [];

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
}
