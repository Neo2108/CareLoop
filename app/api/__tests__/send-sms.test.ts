import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("twilio", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({ sid: "SM123" }),
    },
  })),
}));

vi.mock("@/app/generated/prisma/client", () => ({
  PrismaClient: class MockPrismaClient {
    appointment = {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    };
  },
}));

describe("POST /api/send-sms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TWILIO_ACCOUNT_SID = "test";
    process.env.TWILIO_AUTH_TOKEN = "test";
    process.env.TWILIO_PHONE_NUMBER = "+15551234567";
  });

  it("returns 400 for invalid appointmentId", async () => {
    const { POST } = await import("../send-sms/route");
    const request = new Request("http://localhost/api/send-sms", {
      method: "POST",
      body: JSON.stringify({ appointmentId: "not-a-uuid" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing appointmentId", async () => {
    const { POST } = await import("../send-sms/route");
    const request = new Request("http://localhost/api/send-sms", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
