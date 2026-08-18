import { describe, it, expect } from 'vitest';
import { RecommendationService, dotProduct } from './recommendation.service';
import { FlavorVector } from '@/types/tea.types';

describe('RecommendationService - Vector Math & Ranking', () => {
  it('should calculate dot product accurately', () => {
    const v1: FlavorVector = [1, 2, 3, 4, 5, 6, 7];
    const v2: FlavorVector = [7, 6, 5, 4, 3, 2, 1];
    // 7+12+15+16+15+12+7 = 84
    expect(dotProduct(v1, v2)).toBe(84);
  });

  it('should return top matching tea recommendations', () => {
    const service = new RecommendationService();
    const results = service.calculateTopTeas({ mood: 5, taste: 5 }, 2);

    expect(results).toHaveLength(2);
    expect(results[0].matchScore).toBeGreaterThanOrEqual(results[1].matchScore);
    expect(results[0].tea).toHaveProperty('name');
  });

  it('should filter only herbal teas when maxCaffeine is true', () => {
    const service = new RecommendationService();
    const results = service.calculateTopTeas({ maxCaffeine: true });

    expect(results.every(r => r.tea.category === 'Herbal')).toBe(true);
  });
});