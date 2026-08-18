import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/inventory.service';
import { Logger } from '@/utils/logger';

export async function GET() {
  try {
    // 1. เรียกใช้งานสมองกล
    const service = new InventoryService();
    
    // 2. สั่งให้คำนวณ Predictive Data
    const data = service.getPredictiveInventory();
    
    Logger.info('API/Admin/Inventory', { message: 'Fetched predictive inventory successfully' });

    // 3. ส่งข้อมูลกลับไปให้หน้า Dashboard
    return NextResponse.json({ success: true, data });
  } catch (error) {
    Logger.error('API/Admin/Inventory', { 
      message: 'Failed to fetch inventory', 
      details: error instanceof Error ? error.message : String(error) 
    });
    
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}