import { z } from "zod";
import { TEA_MATRIX_KEYS } from "@/types/tea.types";
import type { UserAssessmentPayload } from "@/types/tea.types";

const teaMatrixShape = Object.fromEntries(
  TEA_MATRIX_KEYS.map((key) => [key, z.number().finite().min(0).max(1)]),
) as Record<(typeof TEA_MATRIX_KEYS)[number], z.ZodNumber>;

const teaMatrixSchema = z.object(teaMatrixShape).strict();

const constraintsSchema = z
  .object({
    maxPriceCents: z.number().finite().nonnegative().optional(),
    inStockOnly: z.boolean().optional(),
  })
  .strict();

export const userAssessmentPayloadSchema = z
  .object({
    preferences: teaMatrixSchema,
    sessionId: z.string().min(1).optional(),
    constraints: constraintsSchema.optional(),
  })
  .strict();

export type ParsedUserAssessmentPayload = z.infer<
  typeof userAssessmentPayloadSchema
>;

export function parseUserAssessmentPayload(
  body: unknown,
): UserAssessmentPayload | null {
  const result = userAssessmentPayloadSchema.safeParse(body);
  return result.success ? result.data : null;
}

export function formatAssessmentValidationError(body: unknown): string {
  const result = userAssessmentPayloadSchema.safeParse(body);
  if (result.success) return "";

  return result.error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");
}
