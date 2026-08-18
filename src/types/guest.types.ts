import { UserAssessmentPayload } from './tea.types';

// บังคับโครงสร้างข้อมูล Profile ของผู้ใช้ทั่วไป (Guest)
export interface GuestProfile {
  lastAssessment: UserAssessmentPayload; // จำคำตอบล่าสุดที่เคยประเมิน
  preferredTeaId: string;                // จำ ID ของชาที่ระบบแนะนำไปล่าสุด
  lastVisit: string;                     // จำเวลาที่เข้ามาประเมินล่าสุด (ISO String)
}