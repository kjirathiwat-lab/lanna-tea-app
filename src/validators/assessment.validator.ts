import { z } from 'zod';

// บังคับให้ Zod ตรวจสอบแค่ 3 ค่าที่เราส่งไป
export const assessmentSchema = z.object({
  mood: z.number(),
  taste: z.number(),
  purpose: z.number()
});

export function parseUserAssessmentPayload(data: unknown) {
  return assessmentSchema.parse(data);
}

export function formatAssessmentValidationError(error: any) {
  return { success: false, error: "Validation Failed", details: error };
}