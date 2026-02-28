import { describe, it, expect } from "vitest";
import {
  AppError,
  ValidationError,
  NotFoundError,
  toApiError,
} from "./errors";

describe("AppError", () => {
  it("creates error with message and code", () => {
    const err = new AppError("test", "TEST_CODE", 400);
    expect(err.message).toBe("test");
    expect(err.code).toBe("TEST_CODE");
    expect(err.statusCode).toBe(400);
  });
});

describe("ValidationError", () => {
  it("has status 400", () => {
    const err = new ValidationError("invalid");
    expect(err.statusCode).toBe(400);
  });
});

describe("NotFoundError", () => {
  it("has status 404", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
  });
});

describe("toApiError", () => {
  it("converts AppError to API response", () => {
    const err = new ValidationError("invalid input");
    expect(toApiError(err)).toEqual({ error: "invalid input", code: "VALIDATION_ERROR" });
  });

  it("includes details for ValidationError", () => {
    const err = new ValidationError("invalid", { field: "email" });
    expect(toApiError(err)).toEqual({
      error: "invalid",
      code: "VALIDATION_ERROR",
      details: { field: "email" },
    });
  });

  it("converts generic Error", () => {
    const err = new Error("something broke");
    expect(toApiError(err)).toMatchObject({ error: "something broke" });
  });
});
