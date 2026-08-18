'use client';

import React from 'react';
import { TeaProduct } from '@/types/tea.types';
import { CartItem } from '@/types/order.types';

interface UpSaleProps {
  primaryTea?: TeaProduct;
  onAddToCart?: (item: CartItem) => void;
}

export function UpSaleRecommendation({ primaryTea, onAddToCart }: UpSaleProps) {
  if (!primaryTea) return null;

  const isFloral = primaryTea.category === 'Floral';

  const pairingData = isFloral
    ? {
        id: 'PAIR-01',
        title: 'Artisanal Scone & Lotus Jam Set',
        thaiTitle: 'ชุดสโคนชาอูหลงยอดดอยเสิร์ฟคู่แยมเกสรบัวหลวง',
        desc: 'ช่วยชูความหอมละมุนของชาดอกไม้ให้เด่นชัดขึ้นในทุกคำ',
        priceCents: 18000,
        priceDisplay: '฿180',
      }
    : {
        id: 'PAIR-02',
        title: 'Heritage Roasted Sesame & Wild Honey Rice Cake',
        thaiTitle: 'ข้าวปุกงาดอยน้ำอ้อยเคี่ยวและน้ำผึ้งป่าเดือนห้า',
        desc: 'ความนุ่มหนึบและหวานธรรมชาติ ช่วยตัดและผสานรสเข้มของชาสมุนไพรอย่างลงตัว',
        priceCents: 15000,
        priceDisplay: '฿150',
      };

  const handleAddPairing = () => {
    if (onAddToCart) {
      onAddToCart({
        id: pairingData.id,
        title: pairingData.title,
        thaiTitle: pairingData.thaiTitle,
        priceCents: pairingData.priceCents,
        quantity: 1,
        type: 'Dessert',
      });
    }
  };

  return (
    <div className="bg-[#F5F2EB] border border-[#D9D2C5] p-5 my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] tracking-widest bg-[#8C7355] text-white px-2 py-0.5 uppercase font-sans">
          Curated Pairing
        </span>
        <span className="text-xs text-stone-600 font-serif italic">
          ยกระดับสุนทรียรสคู่กับ {primaryTea.name}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="font-medium text-stone-900 text-sm">{pairingData.title}</h4>
          <p className="text-xs text-stone-700 font-sans mt-0.5">{pairingData.thaiTitle}</p>
          <p className="text-xs text-stone-500 mt-1">{pairingData.desc}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-300">
          <span className="text-sm font-semibold text-stone-900 font-sans">{pairingData.priceDisplay}</span>
          <button
            type="button"
            onClick={handleAddPairing}
            className="px-3 py-1.5 bg-[#25323D] hover:bg-black text-white text-xs font-sans transition cursor-pointer"
          >
            + สั่งคู่กับชา
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpSaleRecommendation;