import { InventoryItem, StockStatus } from '@/types/admin.types';

export class InventoryService {
  // ซิงก์วัตถุดิบจริงตาม 10 Signature Blends และ Signature Pairings
  private mockInventory = [
    { id: 'RAW-01', name: 'ใบชาอัสสัมดอยสูง (Assam Leaves)', category: 'Tea Leaves', remaining: 3500, unit: 'g', usage: 120 },
    { id: 'RAW-02', name: 'ชาขาวเข็มเงินดอยช้าง (Silver Needle)', category: 'Tea Leaves', remaining: 1200, unit: 'g', usage: 90 },
    { id: 'RAW-03', name: 'ยอดชาอูหลงยอดดอย (Jade Oolong)', category: 'Tea Leaves', remaining: 4500, unit: 'g', usage: 150 },
    { id: 'RAW-04', name: 'ดอกกุหลาบจุฬาลงกรณ์อบแห้ง', category: 'Floral & Herbs', remaining: 600, unit: 'g', usage: 80 },
    { id: 'RAW-05', name: 'ดอกกาแฟอาราบิก้าสยาม (Coffee Blossom)', category: 'Floral & Herbs', remaining: 180, unit: 'g', usage: 30 },
    { id: 'RAW-06', name: 'เกสรบัวหลวงและดอกปีบ', category: 'Floral & Herbs', remaining: 450, unit: 'g', usage: 50 },
    { id: 'RAW-07', name: 'ขิงแก่ดอยและชะเอมเทศ', category: 'Herbs & Spices', remaining: 2000, unit: 'g', usage: 100 },
    { id: 'RAW-08', name: 'กระเจี๊ยบแดงดอยและดอกคำฝอย', category: 'Herbs & Spices', remaining: 850, unit: 'g', usage: 70 },
    { id: 'RAW-09', name: 'น้ำผึ้งป่าเดือนห้าและน้ำอ้อยเคี่ยว', category: 'Sweetener & Pairing', remaining: 400, unit: 'ml', usage: 80 },
    { id: 'RAW-10', name: 'แป้งข้าวปุกงาดอยกึ่งสำเร็จรูป', category: 'Bakery & Dessert', remaining: 500, unit: 'g', usage: 100 },
  ];

  public getPredictiveInventory(): InventoryItem[] {
    return this.mockInventory.map((item) => {
      const daysLeft = Math.floor(item.remaining / item.usage);

      let status: StockStatus = 'HEALTHY';
      if (daysLeft <= 7) {
        status = 'CRITICAL';
      } else if (daysLeft <= 15) {
        status = 'WARNING';
      }

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        remainingQuantity: item.remaining,
        unit: item.unit,
        averageDailyUsage: item.usage,
        estimatedDaysLeft: daysLeft,
        status: status,
      };
    });
  }
}