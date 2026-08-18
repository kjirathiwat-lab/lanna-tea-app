import { describe, expect, it } from "vitest";
import {
  formatAssessmentValidationError,
  parseUserAssessmentPayload,
} from "@/validators/assessment.validator";

const validPayload = {
  preferences: {
    floral: 0.8,
    fruity: 0.2,
    earthy: 0.5,
    sweet: 0.6,
    bitter: 0.3,
    warming: 0.4,
    caffeine: 0.5,
  },
  sessionId: "guest-123",
  constraints: {
    inStockOnly: true,
    maxPriceCents: 1500,
  },
};

describe("parseUserAssessmentPayload", () => {
  it("accepts a valid payload", () => {
    expect(parseUserAssessmentPayload(validPayload)).toEqual(validPayload);
  });

  it("rejects missing preferences", () => {
    expect(parseUserAssessmentPayload({})).toBeNull();
  });

  it("rejects out-of-range matrix values", () => {
    expect(
      parseUserAssessmentPayload({
        preferences: { ...validPayload.preferences, floral: 1.5 },
      }),
    ).toBeNull();
  });

  it("rejects unknown fields (strict mode)", () => {
    expect(
      parseUserAssessmentPayload({
        ...validPayload,
        extraField: true,
      }),
    ).toBeNull();
  });

  it("rejects negative maxPriceCents", () => {
    expect(
      parseUserAssessmentPayload({
        preferences: validPayload.preferences,
        constraints: { maxPriceCents: -100 },
      }),
    ).toBeNull();
  });
});

describe("formatAssessmentValidationError", () => {
  it("returns empty string for valid payload", () => {
    expect(formatAssessmentValidationError(validPayload)).toBe("");
  });

  it("returns human-readable issue paths for invalid payload", () => {
    const message = formatAssessmentValidationError({});
    expect(message).toContain("preferences");
  });
});
