import { z } from 'zod';

export const assessmentSchema = z.object({
  mood: z.union([z.string(), z.number()]).optional(),
  taste: z.union([z.string(), z.number()]).optional(),
  purpose: z.union([z.string(), z.number()]).optional(),
  preferredCategories: z.array(z.string()).optional(),
  maxCaffeine: z.boolean().optional(),
});

export type ValidatedAssessment = z.infer<typeof assessmentSchema>;