'use client';

import React, { useEffect, useState } from 'react';
import { InventoryItem } from '@/types/admin.types';
import { InventoryTable } from '@/components/admin/InventoryTable';

export default function AdminDashboardPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงข้อมูลจาก API หลังบ้านตอนเปิดหน้าเว็บ
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/admin/inventory');
        const data = await response.json();
        
        if (data.success) {
          setInventoryData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans">
      {/* Admin Top Navigation */}
      <nav className="bg-[#2C3E50] text-[#F9F6F0] p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-serif tracking-widest text-lg">Lanna & Tribal | <span className="text-[#D4C4A8]">Operation Center</span></h1>
          <div className="text-xs tracking-wider opacity-80 uppercase">Director Dashboard</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif text-[#2C3E50] mb-2">Predictive Inventory</h2>
            <p className="text-[#8B7355]">ระบบวิเคราะห์และแจ้งเตือนสถานะวัตถุดิบล่วงหน้า</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-colors text-sm rounded-sm"
          >
            รีเฟรชข้อมูล
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-10 h-10 border-4 border-[#EBE5D9] border-t-[#2C3E50] rounded-full animate-spin mb-4"></div>
            <p className="text-[#8B7355]">กำลังโหลดข้อมูลสต๊อก...</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <InventoryTable data={inventoryData} />
            
            {/* สรุปข้อมูลสำหรับผู้บริหาร */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-[#EBE5D9] border-l-4 border-l-red-500 shadow-sm">
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Critical Items</h4>
                <p className="text-2xl font-serif text-red-600">
                  {inventoryData.filter(item => item.status === 'CRITICAL').length} <span className="text-sm font-sans text-gray-400">รายการ</span>
                </p>
              </div>
              <div className="bg-white p-6 border border-[#EBE5D9] border-l-4 border-l-amber-500 shadow-sm">
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Warning Items</h4>
                <p className="text-2xl font-serif text-amber-600">
                  {inventoryData.filter(item => item.status === 'WARNING').length} <span className="text-sm font-sans text-gray-400">รายการ</span>
                </p>
              </div>
              <div className="bg-white p-6 border border-[#EBE5D9] border-l-4 border-l-emerald-500 shadow-sm">
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Healthy Items</h4>
                <p className="text-2xl font-serif text-emerald-600">
                  {inventoryData.filter(item => item.status === 'HEALTHY').length} <span className="text-sm font-sans text-gray-400">รายการ</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}