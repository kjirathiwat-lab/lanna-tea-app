import { NextResponse } from 'next/server';
import { RecommendationService } from '@/services/recommendation.service';
import { parseUserAssessmentPayload } from '@/validators/assessment.validator';
import { Logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = parseUserAssessmentPayload(body);
    
    // แก้ Error 1: ห่อข้อความและ payload ให้อยู่ในรูปแบบ Object (Record)
    Logger.info('API/Recommend', { 
      message: 'Validated payload strictly', 
      data: payload 
    });

    const service = new RecommendationService();
    const topTeas = service.calculateTopTeas(payload);

    return NextResponse.json({ success: true, data: topTeas });
    
  } catch (error) {
    // แก้ Error 2: ดักจับ error ที่เป็น unknown และแปลงเป็น Object ที่อ่านค่าได้
    Logger.error('API/Recommend', 'Failed to process recommendation', { 
      details: error instanceof Error ? error.message : String(error) 
    });
    
    return NextResponse.json(
      { success: false, error: 'Internal Server Error or Validation Failed' },
      { status: 400 }
    );
  }
}