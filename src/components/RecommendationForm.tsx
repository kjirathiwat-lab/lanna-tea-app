'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Logger } from '@/utils/logger';
import { UserAssessmentPayload } from '@/types/tea.types';

// 1. กำหนด Schema ที่เคร่งครัด ชัดเจนทุกฟิลด์
export const guestProfileSchema = z.object({
  sessionId: z.string(),
  preferredMood: z.union([z.string(), z.number()]).optional(),
  preferredTaste: z.union([z.string(), z.number()]).optional(),
  preferredPurpose: z.union([z.string(), z.number()]).optional(),
  history: z.array(z.string()).default([]),
  lastVisited: z.string().default(() => new Date().toISOString()),
});

export type GuestProfile = z.infer<typeof guestProfileSchema>;

const STORAGE_KEY = 'lanna_tea_guest_profile';

export function useGuestProfile() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // ขาอ่าน (Read): ดึงจาก localStorage พร้อม Validate Shape
  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const validated = guestProfileSchema.safeParse(parsed);

        if (validated.success) {
          setProfile(validated.data);
        } else {
          Logger.error('Corrupted guest profile detected in storage, resetting...', validated.error, undefined, 'Hook/useGuestProfile');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      Logger.error('Failed to parse guest profile from localStorage', error, undefined, 'Hook/useGuestProfile');
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ขาเขียน (Write): ใช้ Function Overload ให้ Type แม่นยำ 100%
  function saveProfile(profileData: Partial<GuestProfile>): void;
  function saveProfile(sessionId: string, assessment: UserAssessmentPayload): void;
  function saveProfile(arg1: string | Partial<GuestProfile>, arg2?: UserAssessmentPayload): void {
    try {
      let rawMerged: Record<string, unknown>;

      if (typeof arg1 === 'string') {
        // กรณีเรียกแบบ saveProfile(sessionId, assessmentPayload)
        rawMerged = {
          ...(profile || {}),
          sessionId: arg1,
          preferredMood: arg2?.mood,
          preferredTaste: arg2?.taste,
          preferredPurpose: arg2?.purpose,
          history: profile?.history || [],
          lastVisited: new Date().toISOString(),
        };
      } else {
        // กรณีเรียกแบบ saveProfile({ ...profileData })
        rawMerged = {
          sessionId: profile?.sessionId || `guest_${Date.now()}`,
          history: profile?.history || [],
          ...(profile || {}),
          ...arg1,
          lastVisited: new Date().toISOString(),
        };
      }

      // ตรวจสอบความถูกต้องด้วย Zod ก่อนบันทึกลง Hard Disk เสมอ
      const validated = guestProfileSchema.parse(rawMerged);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      setProfile(validated);
      Logger.info('Guest profile saved securely', { sessionId: validated.sessionId }, 'Hook/useGuestProfile');
    } catch (error) {
      Logger.error('Failed to validate and save guest profile', error, undefined, 'Hook/useGuestProfile');
    }
  }

  return { profile, isLoaded, saveProfile: useCallback(saveProfile, [profile]) };
}