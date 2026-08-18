import {
  TEA_MATRIX_KEYS,
  type ScoredTeaProduct,
  type TeaMatrix,
  type TeaProduct,
  type UserAssessmentPayload,
} from "@/types/tea.types";

const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

export const matrixToVector = (matrix: TeaMatrix): readonly number[] =>
  TEA_MATRIX_KEYS.map((key) => clamp(matrix[key]));

/** Dot product — higher score = stronger alignment with user preferences */
export const dotProduct = (
  a: readonly number[],
  b: readonly number[],
): number => a.reduce((sum, value, index) => sum + value * b[index], 0);

const passesConstraints = (
  product: TeaProduct,
  payload: UserAssessmentPayload,
): boolean => {
  const { constraints } = payload;
  if (!constraints) return true;

  if (
    constraints.maxPriceCents !== undefined &&
    product.priceCents > constraints.maxPriceCents
  ) {
    return false;
  }

  if (constraints.inStockOnly && product.inventoryCount <= 0) {
    return false;
  }

  return true;
};

export class RecommendationService {
  constructor(private readonly catalog: readonly TeaProduct[]) {}

  recommend(
    payload: UserAssessmentPayload,
    limit = 3,
  ): readonly ScoredTeaProduct[] {
    const userVector = matrixToVector(payload.preferences);

    return this.catalog
      .filter((product) => passesConstraints(product, payload))
      .map((product) => ({
        product,
        score: dotProduct(userVector, matrixToVector(product.matrix)),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
