import { describe, it, expect } from "vitest";
import {
  appointmentIdSchema,
  sendSmsSchema,
  initiateCallSchema,
  intakeAnswersSchema,
} from "./validation";

describe("appointmentIdSchema", () => {
  it("accepts valid UUID", () => {
    const valid = "550e8400-e29b-41d4-a716-446655440000";
    expect(appointmentIdSchema.parse(valid)).toBe(valid);
  });

  it("rejects invalid UUID", () => {
    expect(() => appointmentIdSchema.parse("not-a-uuid")).toThrow();
    expect(() => appointmentIdSchema.parse("")).toThrow();
  });
});

describe("sendSmsSchema", () => {
  it("accepts valid appointmentId", () => {
    const body = { appointmentId: "550e8400-e29b-41d4-a716-446655440000" };
    expect(sendSmsSchema.parse(body)).toEqual(body);
  });

  it("rejects missing appointmentId", () => {
    expect(() => sendSmsSchema.parse({})).toThrow();
  });
});

describe("initiateCallSchema", () => {
  it("accepts valid to_number", () => {
    const body = { to_number: "+15551234567" };
    expect(initiateCallSchema.parse(body)).toEqual(body);
  });

  it("rejects empty to_number", () => {
    expect(() => initiateCallSchema.parse({ to_number: "" })).toThrow();
  });

  it("rejects missing to_number", () => {
    expect(() => initiateCallSchema.parse({})).toThrow();
  });
});

describe("intakeAnswersSchema", () => {
  it("accepts valid intake answers", () => {
    const answers = { anxiety_frequency: "Several days", worry_control: "Not at all" };
    expect(intakeAnswersSchema.parse(answers)).toEqual(answers);
  });

  it("accepts mixed types", () => {
    const answers = { key1: "a", key2: 1, key3: true, key4: null };
    expect(intakeAnswersSchema.parse(answers)).toEqual(answers);
  });

  it("accepts array of strings", () => {
    const answers = { symptoms: ["fever", "cough"] };
    expect(intakeAnswersSchema.parse(answers)).toEqual(answers);
  });
});
