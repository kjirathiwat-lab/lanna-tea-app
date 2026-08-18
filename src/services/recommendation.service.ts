import teaCatalogJson from '@/data/tea-catalog.json';
import { TeaProduct, UserAssessmentPayload, RecommendationResult, MatrixVector, TeaMetadataVector } from '@/types/tea.types';

export const TEA_CATALOG: TeaProduct[] = teaCatalogJson as TeaProduct[];

export function matrixToVector(m: TeaMetadataVector): MatrixVector {
  return [m.executiveFocus, m.relaxation, m.healthBeauty, m.localStory, m.flavorBoldness, m.visualImpact];
}

export function dotProduct(v1: MatrixVector, v2: MatrixVector): number {
  return v1.reduce((sum, val, idx) => sum + val * (v2[idx] ?? 0), 0);
}

export class RecommendationService {
  private catalog: TeaProduct[];

  constructor(catalog: TeaProduct[] = TEA_CATALOG) {
    this.catalog = catalog;
  }

  public calculateTopTeas(payload: UserAssessmentPayload, limit: number = 3): RecommendationResult[] {
    const text = `${payload.mood || ''} ${payload.taste || ''} ${payload.purpose || ''}`.toLowerCase();

    let userVector: MatrixVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

    if (text.includes('ทำงาน') || text.includes('สมาธิ') || text.includes('พลัง') || text.includes('บริหาร')) {
      userVector[0] += 0.4;
    }
    if (text.includes('ผ่อนคลาย') || text.includes('สงบ') || text.includes('นอนหลับ') || text.includes('พัก')) {
      userVector[1] += 0.4;
    }
    if (text.includes('ผิว') || text.includes('สุขภาพ') || text.includes('สมดุล') || text.includes('บำรุง')) {
      userVector[2] += 0.4;
    }
    if (text.includes('ชนเผ่า') || text.includes('ล้านนา') || text.includes('เรื่องเล่า') || text.includes('ดอย')) {
      userVector[3] += 0.4;
    }
    if (text.includes('เข้มข้น') || text.includes('ลุ่มลึก') || text.includes('เครื่องเทศ')) {
      userVector[4] += 0.4;
    }
    if (text.includes('สวย') || text.includes('ถ่ายรูป') || text.includes('สีสัน')) {
      userVector[5] += 0.4;
    }

    const scored = this.catalog.map((tea) => {
      const teaVector = matrixToVector(tea.matrix);
      const score = dotProduct(userVector, teaVector);
      const percentage = Math.min(99, Math.max(85, Math.round((score / 3.2) * 100)));

      return {
        tea,
        matchScore: parseFloat(score.toFixed(2)),
        matchPercentage: percentage,
        reason: `${tea.story} (ตรงกับโทน ${tea.category === 'Herbal' ? 'สมุนไพรบำบัด' : 'ดอกไม้อโรมา'})`,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
  }
}