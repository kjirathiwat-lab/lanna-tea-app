import { InventoryItem, StockStatus } from '@/types/admin.types';

export class InventoryService {
  // จำลองฐานข้อมูลวัตถุดิบดิบหลังบ้าน (Mock Database)
  private mockInventory = [
    { id: 'INV-01', name: 'ใบชาดำดอยปู่หมื่น', category: 'Tea Leaves', remaining: 2500, unit: 'g', usage: 150 },
    { id: 'INV-02', name: 'ดอกเก๊กฮวยป่า', category: 'Herbs', remaining: 800, unit: 'g', usage: 100 },
    { id: 'INV-03', name: 'ยอดชาอู่หลงน้ำค้าง', category: 'Tea Leaves', remaining: 5000, unit: 'g', usage: 200 },
    { id: 'INV-04', name: 'มะแขว่นคั่ว', category: 'Spices', remaining: 150, unit: 'g', usage: 30 },
    { id: 'INV-05', name: 'น้ำผึ้งป่าเดือนห้า', category: 'Sweetener', remaining: 400, unit: 'ml', usage: 80 },
  ];

  // สมองกลคำนวณ Predictive Inventory
  public getPredictiveInventory(): InventoryItem[] {
    return this.mockInventory.map(item => {
      // คำนวณว่าของจะหมดในอีกกี่วัน
      const daysLeft = Math.floor(item.remaining / item.usage);
      
      // ประเมินสถานะแจ้งเตือน
      let status: StockStatus = 'HEALTHY';
      if (daysLeft <= 7) {
        status = 'CRITICAL'; // ของจะหมดภายในอาทิตย์นี้ ต้องสั่งด่วน!
      } else if (daysLeft <= 15) {
        status = 'WARNING';  // ของจะหมดในครึ่งเดือน เริ่มวางแผนสั่ง
      }

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        remainingQuantity: item.remaining,
        unit: item.unit,
        averageDailyUsage: item.usage,
        estimatedDaysLeft: daysLeft,
        status: status
      };
    });
  }
}