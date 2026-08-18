import { NextResponse } from "next/server";
import teaCatalog from "@/data/tea-catalog.json";
import { RecommendationService } from "@/services/recommendation.service";
import type { RecommendResponse, TeaProduct } from "@/types/tea.types";
import { Logger } from "@/utils/logger";
import {
  formatAssessmentValidationError,
  parseUserAssessmentPayload,
} from "@/validators/assessment.validator";

const CONTEXT = "api/recommend";

const catalog = teaCatalog as TeaProduct[];
const service = new RecommendationService(catalog);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const payload = parseUserAssessmentPayload(body);

    if (!payload) {
      const details = formatAssessmentValidationError(body);
      Logger.warn("Invalid recommendation payload", { details }, CONTEXT);
      return NextResponse.json(
        {
          error: "Invalid request body.",
          details,
        },
        { status: 400 },
      );
    }

    const recommendations = service.recommend(payload, 3);

    Logger.info(
      "Recommendations generated",
      {
        sessionId: payload.sessionId,
        resultCount: recommendations.length,
      },
      CONTEXT,
    );

    const response: RecommendResponse = {
      recommendations,
      meta: {
        requestedAt: new Date().toISOString(),
        candidateCount: catalog.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    Logger.error("Recommendation request failed", error, undefined, CONTEXT);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
