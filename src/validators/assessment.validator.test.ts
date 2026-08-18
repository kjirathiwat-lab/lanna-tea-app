import { describe, it, expect } from 'vitest';
import { assessmentSchema } from './assessment.validator';

describe('Assessment Validator (Contract Test)', () => {
  it('should validate valid user payload correctly', () => {
    const validPayload = { mood: 4, taste: 5, purpose: 3, maxCaffeine: false };
    const result = assessmentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should accept string representations for compatibility', () => {
    const validPayload = { mood: 'calm', taste: 'sweet', preferredCategories: ['Oolong'] };
    const result = assessmentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });
});