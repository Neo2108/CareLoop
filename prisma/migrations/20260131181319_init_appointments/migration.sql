-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone_number" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "appointment_reason" TEXT,
    "appointment_status" TEXT,
    "requires_post_appointment_followup" BOOLEAN,
    "appointment_date" DATETIME,
    "default_outbound_language" TEXT,
    "scheduled_outbound_intake_call" DATETIME,
    "reminder_called_at" DATETIME,
    "sms_reminder_sent_at" DATETIME,
    "intake_answers" JSONB
);
