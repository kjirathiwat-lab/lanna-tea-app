export interface TeaMetadataVector {
  executiveFocus: number;
  relaxation: number;
  healthBeauty: number;
  localStory: number;
  flavorBoldness: number;
  visualImpact: number;
}

export type MatrixVector = [number, number, number, number, number, number];

export interface TeaProduct {
  id: string;
  code: string;
  name: string;
  thaiName: string;
  category: 'Herbal' | 'Floral' | 'Black' | 'Oolong' | 'Green' | 'White';
  ingredients?: string;
  description: string;
  story: string;
  matrix: TeaMetadataVector;
  brewingInstructions: {
    temperatureCelsius: number;
    steepTimeSeconds: number;
    ratioGramsPerMl: string;
  };
  priceCents?: number;
  inventoryCount?: number;
}

export interface UserAssessmentPayload {
  mood?: string | number;
  taste?: string | number;
  purpose?: string | number;
}

export interface RecommendationResult {
  tea: TeaProduct;
  matchScore: number;
  matchPercentage?: number;
  reason: string;
}