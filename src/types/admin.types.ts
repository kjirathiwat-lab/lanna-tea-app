// กำหนดสถานะความวิกฤตของสต๊อก
export type StockStatus = 'CRITICAL' | 'WARNING' | 'HEALTHY';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  remainingQuantity: number; // จำนวนวัตถุดิบที่มีในสต๊อก
  unit: string;              // หน่วย (เช่น กรัม, ซอง)
  averageDailyUsage: number; // อัตราการใช้เฉลี่ยต่อวัน (Predictive)
  estimatedDaysLeft: number; // คำนวณ: จำนวนที่มี / อัตราการใช้
  status: StockStatus;       // คำนวณ: CRITICAL (< 7 วัน), WARNING (< 15 วัน)
}