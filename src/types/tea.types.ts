/** Normalized flavor axes (0–1). Same keys used for user prefs and product profiles. */
export interface TeaMatrix {
  floral: number;
  fruity: number;
  earthy: number;
  sweet: number;
  bitter: number;
  warming: number;
  caffeine: number;
}

export interface TeaProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  matrix: TeaMatrix;
  priceCents: number;
  inventoryCount: number;
  imageUrl?: string;
  tags: readonly string[];
}

export interface UserAssessmentPayload {
  preferences: TeaMatrix;
  sessionId?: string;
  constraints?: {
    maxPriceCents?: number;
    inStockOnly?: boolean;
  };
}

export const TEA_MATRIX_KEYS = [
  "floral",
  "fruity",
  "earthy",
  "sweet",
  "bitter",
  "warming",
  "caffeine",
] as const satisfies readonly (keyof TeaMatrix)[];

export type TeaMatrixKey = (typeof TEA_MATRIX_KEYS)[number];

export interface ScoredTeaProduct {
  product: TeaProduct;
  score: number;
}

export interface RecommendResponse {
  recommendations: readonly ScoredTeaProduct[];
  meta: {
    requestedAt: string;
    candidateCount: number;
  };
}
