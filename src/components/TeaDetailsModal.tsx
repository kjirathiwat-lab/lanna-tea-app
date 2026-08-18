import React from 'react';
import { TeaProduct } from '@/types/tea.types';

// บังคับ Strict Typing สำหรับ Props
interface TeaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tea: TeaProduct | null;
}

export function TeaDetailsModal({ isOpen, onClose, tea }: TeaDetailsModalProps) {
  if (!isOpen || !tea) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C3E50]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F9F6F0] w-full max-w-lg border border-[#D4C4A8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#EBE5D9]">
          <h3 className="font-serif text-2xl text-[#2C3E50]">รายละเอียดชา</h3>
          <button 
            onClick={onClose}
            className="text-[#8B7355] hover:text-[#2C3E50] transition-colors text-xl font-light"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <h4 className="font-serif text-3xl text-[#2C3E50] mb-2">{tea.name}</h4>
          <p className="text-[#8B7355] text-sm tracking-widest uppercase mb-6">Signature Blend</p>
          
          <p className="text-[#5C4D3C] leading-relaxed mb-8">
            {tea.description}
            {/* ข้อความจำลอง Storytelling (รอต่อ API Google AI Studio ของจริง) */}
            <span className="block mt-4 italic text-[#8B7355]">
              "ชาตัวนี้ถูกรังสรรค์ขึ้นจากวัตถุดิบท้องถิ่นตอนเหนือของไทย ผ่านกรรมวิธีคั่วอบอย่างพิถีพิถัน เพื่อดึงรสชาติที่ซ่อนอยู่ออกมา ผสานกับความต้องการของคุณในวันนี้ได้อย่างลงตัว"
            </span>
          </p>

          <div className="bg-white p-4 border border-[#EBE5D9]">
            <h5 className="text-[#2C3E50] font-bold text-sm mb-3 uppercase tracking-wider">Tasting Notes Matrix</h5>
            <ul className="space-y-2 text-sm text-[#5C4D3C]">
              <li className="flex justify-between"><span>ความผ่อนคลาย (Relaxation):</span> <span>{tea.matrix.relaxation * 10}%</span></li>
              <li className="flex justify-between"><span>บำรุงสุขภาพ (Health & Beauty):</span> <span>{tea.matrix.healthBeauty * 10}%</span></li>
              <li className="flex justify-between"><span>ความเข้มข้น (Flavor Boldness):</span> <span>{tea.matrix.flavorBoldness * 10}%</span></li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-white border-t border-[#EBE5D9] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#2C3E50] text-[#F9F6F0] uppercase tracking-widest text-xs hover:bg-[#1A252F] transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}