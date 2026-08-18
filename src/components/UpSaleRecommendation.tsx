'use client';

import React, { useEffect, useState } from 'react';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { teaPairings, PairingItem } from '@/data/pairings';

export function UpSaleRecommendation() {
  const { profile, isLoaded } = useGuestProfile();
  const [pairing, setPairing] = useState<PairingItem | null>(null);

  // ดึงข้อมูลสินค้าที่ตรงกับความจำของระบบ
  useEffect(() => {
    if (isLoaded && profile?.preferredTeaId) {
      const matchedPairing = teaPairings.find(p => p.targetTeaId === profile.preferredTeaId);
      setPairing(matchedPairing || null);
    }
  }, [profile, isLoaded]);

  // ถ้ายังโหลดไม่เสร็จ หรือไม่มีข้อมูลที่ตรงกัน ให้ซ่อน Component นี้ไปเลย
  if (!pairing) return null;

  return (
    <div className="mt-16 bg-[#FDFCF9] border border-[#8B7355] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden animate-fade-in-up">
      {/* Decorative Background Texture */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4C4A8] opacity-10 rounded-full -mr-16 -mt-16"></div>
      
      <div className="flex-1 pr-0 md:pr-8 text-center md:text-left z-10">
        <h4 className="text-xs text-[#8B7355] tracking-widest uppercase mb-2">Curated Pairing</h4>
        <h3 className="text-2xl font-serif text-[#2C3E50] mb-2">
          เติมเต็มสุนทรียภาพด้วย "{pairing.name}"
        </h3>
        <p className="text-[#5C4D3C] text-sm leading-relaxed">
          {pairing.description}
        </p>
      </div>

      <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end z-10 border-t md:border-t-0 md:border-l border-[#EBE5D9] pt-6 md:pt-0 md:pl-8 min-w-[150px]">
        <span className="text-[#2C3E50] font-serif text-2xl mb-3">
          ฿{pairing.price}
        </span>
        <button className="w-full px-6 py-2 bg-transparent border border-[#2C3E50] text-[#2C3E50] text-xs uppercase tracking-widest hover:bg-[#2C3E50] hover:text-[#F9F6F0] transition-colors">
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}