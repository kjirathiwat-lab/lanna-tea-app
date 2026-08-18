import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { RecommendationService } from '@/services/recommendation.service';
import { assessmentSchema } from '@/validators/assessment.validator';
import { Logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate payload ด้วย Zod Schema
    const validatedData = assessmentSchema.parse(body);

    // 2. เรียก Service คำนวณ
    const service = new RecommendationService();
    const result = service.calculateTopTeas(validatedData);

    Logger.info('Generated tea recommendations successfully', { resultCount: result.length }, 'API/Recommend');

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    // 3. แยกกรณี Validation Error (422 Unprocessable Entity)
    if (error instanceof ZodError) {
      Logger.error('Validation failed for recommendation request', error, { issues: error.issues }, 'API/Recommend');
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 422 }
      );
    }

    // 4. กรณี Internal Server Error (500)
    Logger.error('Failed to process recommendation', error, undefined, 'API/Recommend');
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}