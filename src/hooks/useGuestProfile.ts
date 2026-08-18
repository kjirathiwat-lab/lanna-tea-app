'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Logger } from '@/utils/logger';
import { UserAssessmentPayload, TeaProduct } from '@/types/tea.types';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const guestProfileSchema = z.object({
  sessionId: z.string(),
  visitCount: z.number().default(1),
  preferredMood: z.union([z.string(), z.number()]).optional(),
  preferredTaste: z.union([z.string(), z.number()]).optional(),
  preferredPurpose: z.union([z.string(), z.number()]).optional(),
  lastOrderedTea: z.object({
    id: z.string(),
    name: z.string(),
    thaiName: z.string(),
  }).optional(),
  history: z.array(z.string()).default([]),
  lastVisited: z.string(),
});

export type GuestProfile = z.infer<typeof guestProfileSchema>;

const STORAGE_KEY = 'lanna_tea_guest_profile';

export function useGuestProfile() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isReturningGuest, setIsReturningGuest] = useState<boolean>(false);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const validated = guestProfileSchema.safeParse(parsed);

        if (validated.success) {
          const lastVisitTime = new Date(validated.data.lastVisited).getTime();
          const isExpired = Date.now() - lastVisitTime > THIRTY_DAYS_MS;

          if (isExpired) {
            Logger.info('Guest cache expired (> 30 days), clearing storage', undefined, 'Hook/useGuestProfile');
            localStorage.removeItem(STORAGE_KEY);
          } else {
            setProfile(validated.data);
            setIsReturningGuest(true);
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      Logger.error('Failed to read guest profile', error, undefined, 'Hook/useGuestProfile');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const recordVisitAndOrder = useCallback((assessment: UserAssessmentPayload, orderedTea?: TeaProduct) => {
    try {
      const currentCount = profile?.visitCount || 0;
      const mergedData: GuestProfile = {
        sessionId: profile?.sessionId || `guest_${Date.now()}`,
        visitCount: currentCount + 1,
        preferredMood: assessment.mood,
        preferredTaste: assessment.taste,
        preferredPurpose: assessment.purpose,
        lastOrderedTea: orderedTea ? {
          id: orderedTea.id,
          name: orderedTea.name,
          thaiName: orderedTea.thaiName,
        } : profile?.lastOrderedTea,
        history: orderedTea ? [...(profile?.history || []), orderedTea.name] : (profile?.history || []),
        lastVisited: new Date().toISOString(),
      };

      const validated = guestProfileSchema.parse(mergedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      setProfile(validated);
      setIsReturningGuest(true);
      Logger.info('Guest order and visit profile recorded', { sessionId: validated.sessionId, visitCount: validated.visitCount }, 'Hook/useGuestProfile');
    } catch (error) {
      Logger.error('Failed to record guest profile', error, undefined, 'Hook/useGuestProfile');
    }
  }, [profile]);

  return { profile, isLoaded, isReturningGuest, recordVisitAndOrder };
}