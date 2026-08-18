import { useState, useEffect } from 'react';
import { GuestProfile } from '@/types/guest.types';
import { UserAssessmentPayload } from '@/types/tea.types';
import { Logger } from '@/utils/logger';

const STORAGE_KEY = 'lanna_guest_profile';

export function useGuestProfile() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedProfile = JSON.parse(storedData) as GuestProfile;
        setProfile(parsedProfile);
        
        // แก้ไข Error: ห่อรวม Message และ Data ไว้ใน Object เดียวกัน
        Logger.info('useGuestProfile', { 
          message: 'Loaded existing guest profile', 
          data: parsedProfile 
        });
      }
    } catch (error) {
      // แก้ไข Error: แปลง unknown error ให้เป็น Object ที่อ่านค่าได้
      Logger.error('useGuestProfile', { 
        message: 'Failed to load profile from localStorage', 
        details: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProfile = (assessment: UserAssessmentPayload, recommendedTeaId: string) => {
    try {
      const newProfile: GuestProfile = {
        lastAssessment: assessment,
        preferredTeaId: recommendedTeaId,
        lastVisit: new Date().toISOString(),
      };
      
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      
      // แก้ไข Error: ห่อรวมเป็น Object ก่อนส่งเข้า Logger
      Logger.info('useGuestProfile', { 
        message: 'Profile saved successfully', 
        data: newProfile 
      });
    } catch (error) {
      Logger.error('useGuestProfile', { 
        message: 'Failed to save profile to localStorage', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  return { profile, isLoaded, saveProfile };
}