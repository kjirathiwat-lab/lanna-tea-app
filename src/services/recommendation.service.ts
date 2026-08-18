import { TeaProduct, UserAssessmentPayload } from '@/types/tea.types';

// Hardcode ฐานข้อมูลชาสไตล์ Lanna & Tribal High Society 
const lannaTeas: TeaProduct[] = [
  { id: 'FT01', name: 'Lanna Oolong Hills', description: 'ชาอู่หลงยอดน้ำค้าง หอมกลิ่นกล้วยไม้ป่า นุ่มนวล ชุ่มคอ', matrix: { relaxation: 0.8, healthBeauty: 0.5, flavorBoldness: 0.4 } },
  { id: 'HT01', name: 'Lanna Chrysanthemum Pu-erh', description: 'ชาผูเอ่อร์บ่มหมัก ผสมดอกเก๊กฮวยป่า ให้ความรู้สึกอบอุ่น ลุ่มลึก', matrix: { relaxation: 0.4, healthBeauty: 0.9, flavorBoldness: 0.8 } },
  { id: 'HT02', name: 'Lanna Mountain Black', description: 'ชาดำรสเข้มข้น มีมิติของโกโก้และมอลต์ ปลุกพลังงาน', matrix: { relaxation: 0.2, healthBeauty: 0.6, flavorBoldness: 1.0 } }
];

export class RecommendationService {
  public calculateTopTeas(payload: UserAssessmentPayload, limit: number = 3): TeaProduct[] {
    // แปลง 3 คำถามเป็นค่าน้ำหนัก
    const userVector = {
      relax: payload.mood === 1 ? 1.0 : 0.2,
      health: payload.purpose === 1 ? 1.0 : 0.5,
      flavor: payload.taste === 1 ? 1.0 : 0.3,
    };

    // คำนวณ Dot Product หาชาที่เข้ากันที่สุด
    const scoredTeas = lannaTeas.map(tea => {
      const score = 
        (userVector.relax * tea.matrix.relaxation) +
        (userVector.health * tea.matrix.healthBeauty) +
        (userVector.flavor * tea.matrix.flavorBoldness);
      return { tea, score };
    });

    return scoredTeas.sort((a, b) => b.score - a.score).slice(0, limit).map(r => r.tea);
  }
}