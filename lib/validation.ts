import { z } from "zod";

/** Schema for appointment ID (UUID) */
export const appointmentIdSchema = z.string().uuid("Invalid appointment ID");

/** Schema for send-sms API request body */
export const sendSmsSchema = z.object({
  appointmentId: appointmentIdSchema,
});

/** Schema for intake answers (patient questionnaire) - allows JSON-serializable values */
export const intakeAnswersSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(z.string()),
  ])
);

/** Schema for getAppointments filter params */
export const getAppointmentsSchema = z.object({
  startDate: z.union([z.coerce.date(), z.string()]).optional(),
  endDate: z.union([z.coerce.date(), z.string()]).optional(),
  patientName: z.string().optional(),
  status: z.string().optional(),
});
