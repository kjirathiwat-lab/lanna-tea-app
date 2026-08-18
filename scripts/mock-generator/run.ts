import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  TEA_MATRIX_KEYS,
  type TeaMatrix,
  type TeaProduct,
  type UserAssessmentPayload,
} from "../../src/types/tea.types";
import teaCatalog from "../../src/data/tea-catalog.json";

interface GuestAssessment {
  submittedAt: string;
  payload: UserAssessmentPayload;
}

interface GuestUser {
  sessionId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  assessments: GuestAssessment[];
}

interface InventoryProductStat {
  teaId: string;
  name: string;
  inventoryCount: number;
  lowStock: boolean;
}

interface MockDataset {
  generatedAt: string;
  period: { from: string; to: string };
  guestUsers: GuestUser[];
  inventoryStats: {
    asOf: string;
    lowStockThreshold: number;
    products: InventoryProductStat[];
    summary: {
      totalSkus: number;
      totalUnits: number;
      lowStockCount: number;
      outOfStockCount: number;
    };
  };
}

const LOW_STOCK_THRESHOLD = 10;
const GUEST_USER_COUNT = 120;
const DAYS = 30;

const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const randomMatrix = (): TeaMatrix => {
  const matrix = {} as TeaMatrix;
  for (const key of TEA_MATRIX_KEYS) {
    matrix[key] = Number(randomBetween(0.1, 1).toFixed(2));
  }
  return matrix;
};

const randomDateWithinLastDays = (days: number): Date => {
  const now = Date.now();
  const offsetMs = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(now - offsetMs);
};

const uuid = (): string => crypto.randomUUID();

const buildGuestUsers = (from: Date, to: Date): GuestUser[] =>
  Array.from({ length: GUEST_USER_COUNT }, () => {
    const sessionId = uuid();
    const assessmentCount = Math.floor(randomBetween(1, 4));
    const assessments: GuestAssessment[] = Array.from(
      { length: assessmentCount },
      () => ({
        submittedAt: randomDateWithinLastDays(DAYS).toISOString(),
        payload: {
          sessionId,
          preferences: randomMatrix(),
          constraints: {
            inStockOnly: Math.random() > 0.3,
            maxPriceCents:
              Math.random() > 0.5
                ? Math.floor(randomBetween(800, 2500))
                : undefined,
          },
        },
      }),
    ).sort(
      (a, b) =>
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    );

    const firstSeenAt = assessments[0].submittedAt;
    const lastSeenAt = assessments[assessments.length - 1].submittedAt;

    return {
      sessionId,
      firstSeenAt,
      lastSeenAt,
      assessments,
    };
  }).filter((user) => {
    const last = new Date(user.lastSeenAt);
    return last >= from && last <= to;
  });

const buildInventoryStats = (
  catalog: readonly TeaProduct[],
): MockDataset["inventoryStats"] => {
  const products: InventoryProductStat[] = catalog.map((tea) => {
    const inventoryCount = Math.floor(randomBetween(0, 80));
    return {
      teaId: tea.id,
      name: tea.name,
      inventoryCount,
      lowStock: inventoryCount > 0 && inventoryCount <= LOW_STOCK_THRESHOLD,
    };
  });

  const totalUnits = products.reduce((sum, p) => sum + p.inventoryCount, 0);

  return {
    asOf: new Date().toISOString(),
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    products,
    summary: {
      totalSkus: products.length,
      totalUnits,
      lowStockCount: products.filter((p) => p.lowStock).length,
      outOfStockCount: products.filter((p) => p.inventoryCount === 0).length,
    },
  };
};

async function main(): Promise<void> {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - DAYS);

  const dataset: MockDataset = {
    generatedAt: new Date().toISOString(),
    period: { from: from.toISOString(), to: to.toISOString() },
    guestUsers: buildGuestUsers(from, to),
    inventoryStats: buildInventoryStats(teaCatalog as TeaProduct[]),
  };

  const outDir = path.join(process.cwd(), "scripts", "mock-generator", "output");
  await mkdir(outDir, { recursive: true });

  const outPath = path.join(outDir, "mock-dataset.json");
  await writeFile(outPath, JSON.stringify(dataset, null, 2), "utf8");

  console.info(`Mock dataset written to ${outPath}`);
  console.info(
    `Guest users: ${dataset.guestUsers.length}, SKUs: ${dataset.inventoryStats.summary.totalSkus}`,
  );
}

main().catch((error) => {
  console.error("Mock generation failed:", error);
  process.exit(1);
});
