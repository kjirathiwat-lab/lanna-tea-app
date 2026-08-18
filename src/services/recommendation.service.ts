import { TeaProduct, UserAssessmentPayload, RecommendationResult, TeaFlavorProfile, FlavorVector } from '@/types/tea.types';

export function profileToVector(p: TeaFlavorProfile): FlavorVector {
  return [p.floral, p.fruity, p.earthy, p.herbal, p.sweetness, p.astringency, p.body];
}

export function dotProduct(v1: FlavorVector, v2: FlavorVector): number {
  return v1.reduce((sum, val, idx) => sum + val * (v2[idx] ?? 0), 0);
}

export class RecommendationService {
  private catalog: TeaProduct[];

  constructor(catalog?: TeaProduct[]) {
    this.catalog = catalog || [
      {
        id: 'TEA-01',
        name: 'Doi Mae Salong Oolong',
        thaiName: 'ชาอู่หลงดอยแม่สลอง',
        origin: 'Chiang Rai, Thailand',
        category: 'Oolong',
        description: 'Floral aroma with a smooth, lingering sweet finish.',
        brewingInstructions: { temperatureCelsius: 90, steepTimeSeconds: 45, ratioGramsPerMl: '5g/150ml' },
        flavorProfile: { floral: 8, fruity: 4, earthy: 2, herbal: 3, sweetness: 7, astringency: 3, body: 6 },
        tags: ['Relaxing', 'Floral', 'Digestive'],
        inventoryCount: 50,
      },
      {
        id: 'TEA-02',
        name: 'Doi Pu Muen Black Tea',
        thaiName: 'ชาดำดอยปู่หมื่น',
        origin: 'Fang, Chiang Mai',
        category: 'Black',
        description: 'Rich malty profile with natural forest honey undertones.',
        brewingInstructions: { temperatureCelsius: 95, steepTimeSeconds: 60, ratioGramsPerMl: '4g/200ml' },
        flavorProfile: { floral: 2, fruity: 6, earthy: 7, herbal: 2, sweetness: 8, astringency: 5, body: 8 },
        tags: ['Energizing', 'Morning', 'Bold'],
        inventoryCount: 35,
      },
      {
        id: 'TEA-03',
        name: 'Wild Chamomile & Chrysanthemum',
        thaiName: 'เก๊กฮวยป่าและคาโมมายล์',
        origin: 'Nan, Thailand',
        category: 'Herbal',
        description: 'Caffeine-free soothing infusion for evening calm.',
        brewingInstructions: { temperatureCelsius: 85, steepTimeSeconds: 120, ratioGramsPerMl: '3g/250ml' },
        flavorProfile: { floral: 9, fruity: 3, earthy: 1, herbal: 8, sweetness: 6, astringency: 1, body: 3 },
        tags: ['Caffeine-Free', 'Sleep', 'Herbal'],
        inventoryCount: 12,
      },
    ];
  }

  public calculateTopTeas(payload: UserAssessmentPayload, limit: number = 3): RecommendationResult[] {
    const userVector: FlavorVector = [
      typeof payload.mood === 'number' ? payload.mood * 2 : 5,
      typeof payload.taste === 'number' ? payload.taste * 2 : 5,
      3, 4, 6, 2, 5
    ];

    let candidates = [...this.catalog];

    if (payload.maxCaffeine) {
      candidates = candidates.filter(t => t.category === 'Herbal');
    }

    if (payload.preferredCategories && payload.preferredCategories.length > 0) {
      const filtered = candidates.filter(t => payload.preferredCategories!.includes(t.category));
      if (filtered.length > 0) candidates = filtered;
    }

    const scored = candidates.map(tea => {
      const teaVector = profileToVector(tea.flavorProfile);
      const score = dotProduct(userVector, teaVector);
      return {
        tea,
        matchScore: Math.round(score),
        reason: `Matched based on flavor harmony (${tea.category} profile)`,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
  }
}