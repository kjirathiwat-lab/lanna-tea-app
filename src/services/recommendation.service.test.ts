import { describe, it, expect } from 'vitest';
import { RecommendationService, dotProduct, matrixToVector } from './recommendation.service';
import { MatrixVector, TeaMetadataVector } from '@/types/tea.types';

describe('RecommendationService - 6D Matrix Math & Business Logic', () => {
  it('should calculate 6D dot product accurately', () => {
    const v1: MatrixVector = [0.9, 0.2, 1.0, 0.7, 1.0, 0.6];
    const v2: MatrixVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    // 0.45 + 0.10 + 0.50 + 0.35 + 0.50 + 0.30 = 2.2
    const result = dotProduct(v1, v2);
    expect(parseFloat(result.toFixed(2))).toBe(2.2);
  });

  it('should convert TeaMetadataVector to MatrixVector array correctly', () => {
    const meta: TeaMetadataVector = {
      executiveFocus: 0.8,
      relaxation: 0.4,
      healthBeauty: 0.8,
      localStory: 0.7,
      flavorBoldness: 0.9,
      visualImpact: 0.7,
    };
    const vec = matrixToVector(meta);
    expect(vec).toEqual([0.8, 0.4, 0.8, 0.7, 0.9, 0.7]);
  });

  it('should return top 3 matching teas with valid match percentage', () => {
    const service = new RecommendationService();
    const results = service.calculateTopTeas(
      {
        mood: 'ต้องการความสงบและผ่อนคลายจากความวุ่นวาย',
        taste: 'หอมหวานอวลกลิ่นดอกไม้ นุ่มนวลละมุนลิ้น',
        purpose: 'บำรุงผิวพรรณและปรับสมดุลร่างกาย',
      },
      3
    );

    expect(results).toHaveLength(3);
    expect(results[0].matchPercentage).toBeGreaterThanOrEqual(results[1].matchPercentage || 0);
    expect(results[0].tea).toHaveProperty('name');
    expect(results[0].tea).toHaveProperty('category');
  });

  it('should rank floral/relaxation teas higher for relaxation and beauty input', () => {
    const service = new RecommendationService();
    const results = service.calculateTopTeas({
      mood: 'ผ่อนคลาย นอนหลับ',
      taste: 'หอมหวาน ดอกไม้',
      purpose: 'ผิวพรรณ สวยงาม',
    });

    const topTea = results[0].tea;
    // กลุ่ม Relaxation & Beauty ควรได้ชา Floral เด่นขึ้นมา เช่น Chulalongkorn Rose Oolong หรือ Wild Chamomile
    expect(['FT01', 'FT02', 'FT04', 'HT02']).toContain(topTea.id || topTea.code);
  });
});