'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Logger } from '@/utils/logger';

const guestProfileSchema = z.object({
  sessionId: z.string().optional(),
  preferredMood: z.union([z.string(), z.number()]).optional(),
  preferredTaste: z.union([z.string(), z.number()]).optional(),
  preferredPurpose: z.union([z.string(), z.number()]).optional(),
  history: z.array(z.string()).default([]),
  lastVisited: z.string().optional(),
}).passthrough();

export type GuestProfile = z.infer<typeof guestProfileSchema>;

const STORAGE_KEY = 'lanna_tea_guest_profile';

export function useGuestProfile() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const validated = guestProfileSchema.safeParse(parsed);

        if (validated.success) {
          setProfile(validated.data);
        } else {
          Logger.error('Corrupted guest profile in localStorage, clearing...', validated.error, undefined, 'Hook/useGuestProfile');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      Logger.error('Failed to read guest profile', error, undefined, 'Hook/useGuestProfile');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // รองรับทั้งแบบส่ง Object เดียว saveProfile(newProfile) และแบบ 2 arguments saveProfile(data, payload)
  const saveProfile = useCallback((data: Partial<GuestProfile> | string, extra?: any) => {
    try {
      let mergedData: GuestProfile;

      if (typeof data === 'string' && extra) {
        // กรณีเรียกแบบ saveProfile('sessionId', payload) หรือ saveProfile(key, value)
        mergedData = {
          ...(profile || {}),
          [data]: extra,
          sessionId: profile?.sessionId || (data === 'sessionId' ? String(extra) : `guest_${Date.now()}`),
          lastVisited: new Date().toISOString(),
          history: profile?.history || [],
        };
      } else {
        // กรณีเรียกแบบ saveProfile(payloadObject)
        const base = typeof data === 'object' ? data : {};
        const additional = typeof extra === 'object' ? extra : {};
        mergedData = {
          ...(profile || {}),
          ...base,
          ...additional,
          sessionId: (base as any)?.sessionId || profile?.sessionId || `guest_${Date.now()}`,
          lastVisited: new Date().toISOString(),
          history: (base as any)?.history || profile?.history || [],
        };
      }

      const validated = guestProfileSchema.parse(mergedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      setProfile(validated);
      Logger.info('Guest profile saved', { sessionId: validated.sessionId }, 'Hook/useGuestProfile');
    } catch (error) {
      Logger.error('Failed to save guest profile', error, undefined, 'Hook/useGuestProfile');
    }
  }, [profile]);

  return { profile, isLoaded, saveProfile };
}