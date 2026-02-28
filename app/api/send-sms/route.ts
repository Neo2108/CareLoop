import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { z } from "zod";
import { PrismaClient } from "@/app/generated/prisma/client";
import { sendSmsSchema } from "@/lib/validation";
import { toApiError, NotFoundError, ValidationError } from "@/lib/errors";
import { checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const limitResult = await checkRateLimit(`sms:${getClientIdentifier(request)}`);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }
  try {
    const body = await request.json();
    const { appointmentId } = sendSmsSchema.parse(body);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (!appointment.phone_number) {
      throw new ValidationError("Appointment has no phone number");
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 500 },
      );
    }

    const client = twilio(accountSid, authToken);

    const appointmentLink = `${appUrl}/patients/appointment/${appointmentId}`;
    const appointmentDateTime = appointment.appointment_date
      ? new Date(appointment.appointment_date).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : "TBD";

    const message = await client.messages.create({
      body: `Reminder for your appointment at Clearwater Ridge: ${appointmentDateTime}\n\nPlease click here to complete your intake questionnaire or to confirm or cancel/reschedule: ${appointmentLink}`,
      from: twilioPhoneNumber,
      to: appointment.phone_number,
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { sms_reminder_sent_at: new Date() },
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      link: appointmentLink,
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return NextResponse.json(toApiError(error), { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        toApiError(new ValidationError("Invalid request", error)),
        { status: 400 }
      );
    }
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      toApiError(error),
      { status: 500 }
    );
  }
}
