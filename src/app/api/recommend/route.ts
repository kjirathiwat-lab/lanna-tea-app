import { NextResponse } from 'next/server';
import { RecommendationService } from '@/services/recommendation.service';
import { parseUserAssessmentPayload } from '@/validators/assessment.validator';
import { Logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลจากหน้าบ้าน
    const body = await request.json();
    
    // 2. ตรวจสอบความถูกต้องของข้อมูล (Zod Validation)
    const payload = parseUserAssessmentPayload(body);
    Logger.info('API/Recommend', 'Validated payload strictly', payload);

    // 3. เรียกใช้งานสมองกลคำนวณ (Logic Layer)
    const service = new RecommendationService();
    const topTeas = service.calculateTopTeas(payload);

    // 4. ส่งผลลัพธ์กลับไปให้หน้าบ้านแสดงผล
    return NextResponse.json({ success: true, data: topTeas });
    
  } catch (error) {
    // เก็บ Log ไว้เผื่อตรวจสอบเคสย้อนหลัง
    Logger.error('API/Recommend', 'Failed to process recommendation', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal Server Error or Validation Failed' },
      { status: 400 }
    );
  }
}