import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function main() {
  const appointments: any[] = [
    {
      phone_number: "+12223334444",
      first_name: "John",
      last_name: "Doe",
      appointment_reason: "Annual Checkup",
      appointment_status: "booked",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-02-15T10:00:00"),
      default_outbound_language: "English",
      scheduled_outbound_intake_call: new Date("2026-02-10T14:00:00"),
      reminder_called_at: null,
      sms_reminder_sent_at: null,
      intake_answers: { allergies: "none", current_medication: "none" },
    },
    {
      phone_number: "+12223334444",
      first_name: "Jane",
      last_name: "Smith",
      appointment_reason: "Flu Symptoms",
      appointment_status: "confirmed",
      requires_post_appointment_followup: true,
      appointment_date: new Date("2026-02-01T09:30:00"),
      default_outbound_language: "French",
      scheduled_outbound_intake_call: new Date("2026-01-30T10:00:00"),
      reminder_called_at: new Date("2026-01-31T09:00:00"),
      sms_reminder_sent_at: new Date("2026-01-31T09:05:00"),
      intake_answers: { symptoms: ["fever", "cough"] },
    },
    {
      phone_number: "+12223334444",
      first_name: "Alice",
      last_name: "Johnson",
      appointment_reason: "Dental Cleaning",
      appointment_status: "unconfirmed",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-03-05T11:00:00"),
      default_outbound_language: "English",
      scheduled_outbound_intake_call: null,
      reminder_called_at: null,
      sms_reminder_sent_at: null,
      intake_answers: {},
    },
    {
      phone_number: "+12223334444",
      first_name: "Bob",
      last_name: "Brown",
      appointment_reason: "Back Pain",
      appointment_status: "cancelled",
      requires_post_appointment_followup: true,
      appointment_date: new Date("2026-01-20T15:00:00"),
      default_outbound_language: "English",
      scheduled_outbound_intake_call: new Date("2026-01-18T10:00:00"),
      reminder_called_at: new Date("2026-01-19T10:00:00"),
      sms_reminder_sent_at: new Date("2026-01-19T10:00:00"),
      intake_answers: { pain_level: 7, duration: "2 weeks" },
    },
    {
      phone_number: "+12223334444",
      first_name: "Charlie",
      last_name: "Davis",
      appointment_reason: "Follow-up",
      appointment_status: "unreachable",
      requires_post_appointment_followup: true,
      appointment_date: new Date("2026-02-10T13:00:00"),
      default_outbound_language: "Ojibwe",
      scheduled_outbound_intake_call: new Date("2026-02-08T11:00:00"),
      reminder_called_at: new Date("2026-02-09T11:00:00"),
      sms_reminder_sent_at: null,
      intake_answers: null,
    },
    {
      phone_number: "+12223334444",
      first_name: "Eve",
      last_name: "Wilson",
      appointment_reason: "Consultation",
      appointment_status: "booked",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-04-12T10:00:00"),
      default_outbound_language: "Cree",
      scheduled_outbound_intake_call: null,
      reminder_called_at: null,
      sms_reminder_sent_at: null,
      intake_answers: { question_1: "answer_1" },
    },
    {
      phone_number: "+12223334444",
      first_name: "Frank",
      last_name: "Miller",
      appointment_reason: "Routine Lab Work",
      appointment_status: "confirmed",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-02-28T08:00:00"),
      default_outbound_language: "English",
      scheduled_outbound_intake_call: new Date("2026-02-25T09:00:00"),
      reminder_called_at: new Date("2026-02-27T08:00:00"),
      sms_reminder_sent_at: new Date("2026-02-27T08:00:00"),
      intake_answers: { fasting: true },
    },
    {
      phone_number: "+12223334444",
      first_name: "Grace",
      last_name: "Lee",
      appointment_reason: "Skin Rash",
      appointment_status: "booked",
      requires_post_appointment_followup: true,
      appointment_date: new Date("2026-02-05T16:00:00"),
      default_outbound_language: "Inuktitut",
      scheduled_outbound_intake_call: null,
      reminder_called_at: null,
      sms_reminder_sent_at: null,
      intake_answers: { duration: "3 days", itchy: true },
    },
    {
      phone_number: "+12223334444",
      first_name: "Henry",
      last_name: "Clark",
      appointment_reason: "Eye Exam",
      appointment_status: "cancelled",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-01-25T14:30:00"),
      default_outbound_language: "English",
      scheduled_outbound_intake_call: new Date("2026-01-20T10:00:00"),
      reminder_called_at: new Date("2026-01-24T10:00:00"),
      sms_reminder_sent_at: null,
      intake_answers: { glasses: true },
    },
    {
      phone_number: "+12223334444",
      first_name: "Ivy",
      last_name: "Taylor",
      appointment_reason: "Vaccination",
      appointment_status: "confirmed",
      requires_post_appointment_followup: false,
      appointment_date: new Date("2026-03-10T11:30:00"),
      default_outbound_language: "Mi'kmaq",
      scheduled_outbound_intake_call: null,
      reminder_called_at: null,
      sms_reminder_sent_at: new Date("2026-03-09T09:00:00"),
      intake_answers: { vaccine_type: "flu" },
    },
  ];

  for (const apt of appointments) {
    await prisma.appointment.create({
      data: apt,
    });
  }

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
