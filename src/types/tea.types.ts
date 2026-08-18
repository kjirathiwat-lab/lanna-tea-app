export interface TeaFlavorProfile {
  floral: number;
  fruity: number;
  earthy: number;
  herbal: number;
  sweetness: number;
  astringency: number;
  body: number;
}

export type FlavorVector = [number, number, number, number, number, number, number];

export interface TeaProduct {
  id: string;
  name: string;
  thaiName: string;
  origin: string;
  category: 'Black' | 'Oolong' | 'Green' | 'Herbal' | 'White';
  description: string;
  brewingInstructions: {
    temperatureCelsius: number;
    steepTimeSeconds: number;
    ratioGramsPerMl: string;
  };
  flavorProfile: TeaFlavorProfile;
  tags: string[];
  priceCents?: number;
  inventoryCount?: number;
}

export interface UserAssessmentPayload {
  mood?: string | number;
  taste?: string | number;
  purpose?: string | number;
  preferredCategories?: string[];
  maxCaffeine?: boolean;
}

export interface RecommendationResult {
  tea: TeaProduct;
  matchScore: number;
  reason: string;
}