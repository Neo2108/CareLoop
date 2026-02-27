import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { appointmentId } = await request.json();

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

    // Generate short ID (first 8 chars)
    const shortId = appointmentId.substring(0, 8);
    const appointmentLink = `${appUrl}/patients/appointment/${shortId}`;

    // TODO: Replace with actual appointment date/time from database
    const appointmentDateTime = "February 5, 2026 at 10:00 AM";

    const message = await client.messages.create({
      body: `Reminder for your appointment at Clearwater Ridge: ${appointmentDateTime}\n\nPlease click here to complete your intake questionnaire or to confirm or cancel/reschedule: ${appointmentLink}`,
      from: twilioPhoneNumber,
      to: "+16476096327",
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      link: appointmentLink,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
