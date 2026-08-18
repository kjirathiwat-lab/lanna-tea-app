import React from 'react';
import { InventoryItem } from '@/types/admin.types';

interface InventoryTableProps {
  data: InventoryItem[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  // ฟังก์ชันเลือกสี Badge ตามความวิกฤตของสต๊อก
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs tracking-wider rounded-full font-bold animate-pulse">CRITICAL (ด่วน)</span>;
      case 'WARNING':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs tracking-wider rounded-full font-semibold">WARNING (เฝ้าระวัง)</span>;
      default:
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs tracking-wider rounded-full">HEALTHY (ปกติ)</span>;
    }
  };

  return (
    <div className="overflow-x-auto bg-white border border-[#EBE5D9] shadow-sm rounded-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FDFCF9] border-b border-[#EBE5D9] text-[#8B7355] text-xs uppercase tracking-widest">
            <th className="p-4 font-medium">รหัส / วัตถุดิบ</th>
            <th className="p-4 font-medium">หมวดหมู่</th>
            <th className="p-4 font-medium text-right">คงเหลือ</th>
            <th className="p-4 font-medium text-right">ใช้เฉลี่ย/วัน</th>
            <th className="p-4 font-medium text-center">คาดการณ์ (วันจะหมด)</th>
            <th className="p-4 font-medium text-center">สถานะ</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[#5C4D3C]">
          {data.map((item) => (
            <tr key={item.id} className="border-b border-[#EBE5D9] hover:bg-[#F9F6F0] transition-colors">
              <td className="p-4">
                <div className="font-serif text-[#2C3E50] text-base">{item.name}</div>
                <div className="text-xs text-[#8B7355] mt-1">{item.id}</div>
              </td>
              <td className="p-4">{item.category}</td>
              <td className="p-4 text-right font-medium">
                {item.remainingQuantity.toLocaleString()} <span className="text-xs text-gray-400 font-normal">{item.unit}</span>
              </td>
              <td className="p-4 text-right">
                {item.averageDailyUsage} <span className="text-xs text-gray-400">{item.unit}</span>
              </td>
              <td className="p-4 text-center">
                <span className={`text-lg font-serif ${item.estimatedDaysLeft <= 7 ? 'text-red-600 font-bold' : 'text-[#2C3E50]'}`}>
                  {item.estimatedDaysLeft}
                </span>
              </td>
              <td className="p-4 text-center">
                {getStatusBadge(item.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}