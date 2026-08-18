import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/inventory.service';
import { Logger } from '@/utils/logger';

export async function GET(request: Request) {
  // --- Basic Admin Guard (Step 1.3) ---
  const authHeader = request.headers.get('x-admin-token');
  const validAdminToken = process.env.ADMIN_SECRET_TOKEN || 'admin-dev-secret';

  if (process.env.NODE_ENV === 'production' && authHeader !== validAdminToken) {
    Logger.error('Unauthorized access to admin inventory API', null, { authHeader }, 'API/Admin/Inventory');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const service = new InventoryService();
    const data = service.getPredictiveInventory();
    
    // ✅ Fix signature: message, meta, context
    Logger.info('Fetched predictive inventory successfully', { totalItems: data.length }, 'API/Admin/Inventory');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // ✅ Fix signature: message, error, meta, context
    Logger.error('Failed to fetch inventory', error, undefined, 'API/Admin/Inventory');
    
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}