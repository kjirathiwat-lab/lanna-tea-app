import { describe, expect, it } from "vitest";
import {
  dotProduct,
  matrixToVector,
  RecommendationService,
} from "@/services/recommendation.service";
import type { TeaMatrix, TeaProduct, UserAssessmentPayload } from "@/types/tea.types";

const floralTea: TeaProduct = {
  id: "test-floral",
  name: "Test Floral",
  slug: "test-floral",
  description: "High floral profile",
  origin: "Test",
  matrix: {
    floral: 1,
    fruity: 0,
    earthy: 0,
    sweet: 0.5,
    bitter: 0,
    warming: 0,
    caffeine: 0.3,
  },
  priceCents: 1000,
  inventoryCount: 10,
  tags: ["test"],
};

const earthyTea: TeaProduct = {
  id: "test-earthy",
  name: "Test Earthy",
  slug: "test-earthy",
  description: "High earthy profile",
  origin: "Test",
  matrix: {
    floral: 0,
    fruity: 0,
    earthy: 1,
    sweet: 0.2,
    bitter: 0.6,
    warming: 0.7,
    caffeine: 0.8,
  },
  priceCents: 1500,
  inventoryCount: 5,
  tags: ["test"],
};

const outOfStockTea: TeaProduct = {
  ...floralTea,
  id: "test-oos",
  name: "Test Out of Stock",
  slug: "test-oos",
  inventoryCount: 0,
};

const expensiveTea: TeaProduct = {
  ...floralTea,
  id: "test-expensive",
  name: "Test Expensive",
  slug: "test-expensive",
  priceCents: 5000,
};

const catalog = [floralTea, earthyTea, outOfStockTea, expensiveTea];

describe("dotProduct", () => {
  it("returns highest score for identical vectors", () => {
    const vector = matrixToVector(floralTea.matrix);
    expect(dotProduct(vector, vector)).toBeCloseTo(1.34, 5);
  });

  it("returns zero for orthogonal preference and product vectors", () => {
    const floralVector = matrixToVector({
      floral: 1,
      fruity: 0,
      earthy: 0,
      sweet: 0,
      bitter: 0,
      warming: 0,
      caffeine: 0,
    });
    const earthyVector = matrixToVector(earthyTea.matrix);
    expect(dotProduct(floralVector, earthyVector)).toBe(0);
  });
});

describe("matrixToVector", () => {
  it("clamps values above 1 and below 0", () => {
    const matrix: TeaMatrix = {
      floral: 1.5,
      fruity: -0.2,
      earthy: 0.5,
      sweet: 0.5,
      bitter: 0.5,
      warming: 0.5,
      caffeine: 0.5,
    };
    const vector = matrixToVector(matrix);
    expect(vector[0]).toBe(1);
    expect(vector[1]).toBe(0);
  });
});

describe("RecommendationService", () => {
  const service = new RecommendationService(catalog);

  it("ranks floral tea first when user prefers floral notes", () => {
    const payload: UserAssessmentPayload = {
      preferences: {
        floral: 1,
        fruity: 0,
        earthy: 0,
        sweet: 0.5,
        bitter: 0,
        warming: 0,
        caffeine: 0,
      },
    };

    const results = service.recommend(payload, 10);
    expect(results[0].product.id).toBe("test-floral");

    const floralScore = results.find((r) => r.product.id === "test-floral")!
      .score;
    const earthyScore = results.find((r) => r.product.id === "test-earthy")!
      .score;
    expect(floralScore).toBeGreaterThan(earthyScore);
  });

  it("excludes out-of-stock items when inStockOnly is true", () => {
    const payload: UserAssessmentPayload = {
      preferences: floralTea.matrix,
      constraints: { inStockOnly: true },
    };

    const results = service.recommend(payload, 10);
    expect(results.every((r) => r.product.inventoryCount > 0)).toBe(true);
    expect(results.find((r) => r.product.id === "test-oos")).toBeUndefined();
  });

  it("includes out-of-stock items when inStockOnly is false", () => {
    const payload: UserAssessmentPayload = {
      preferences: floralTea.matrix,
      constraints: { inStockOnly: false },
    };

    const results = service.recommend(payload, 10);
    expect(results.find((r) => r.product.id === "test-oos")).toBeDefined();
  });

  it("filters by maxPriceCents constraint", () => {
    const payload: UserAssessmentPayload = {
      preferences: floralTea.matrix,
      constraints: { maxPriceCents: 1200 },
    };

    const results = service.recommend(payload, 10);
    expect(results.every((r) => r.product.priceCents <= 1200)).toBe(true);
    expect(
      results.find((r) => r.product.id === "test-expensive"),
    ).toBeUndefined();
  });

  it("returns at most the requested limit", () => {
    const payload: UserAssessmentPayload = {
      preferences: {
        floral: 0.5,
        fruity: 0.5,
        earthy: 0.5,
        sweet: 0.5,
        bitter: 0.5,
        warming: 0.5,
        caffeine: 0.5,
      },
    };

    expect(service.recommend(payload, 2)).toHaveLength(2);
  });

  it("sorts results by descending score", () => {
    const payload: UserAssessmentPayload = {
      preferences: {
        floral: 0.8,
        fruity: 0,
        earthy: 0.8,
        sweet: 0.3,
        bitter: 0.5,
        warming: 0.5,
        caffeine: 0.5,
      },
    };

    const results = service.recommend(payload, 3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});
