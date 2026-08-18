'use client';

import React, { useState } from 'react';
import { TEA_CATALOG } from '@/services/recommendation.service';
import { TeaProduct } from '@/types/tea.types';
import { CartItem } from '@/types/order.types';

interface FullMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeaDetail: (tea: TeaProduct) => void;
  onAddToCart: (item: CartItem) => void;
}

const SIGNATURE_DESSERTS: CartItem[] = [
  {
    id: 'PAIR-01',
    title: 'Artisanal Scone & Lotus Jam Set',
    thaiTitle: 'ชุดสโคนชาอูหลงยอดดอยเสิร์ฟคู่แยมเกสรบัวหลวง',
    priceCents: 18000,
    quantity: 1,
    type: 'Dessert',
  },
  {
    id: 'PAIR-02',
    title: 'Heritage Roasted Sesame & Wild Honey Rice Cake',
    thaiTitle: 'ข้าวปุกงาดอยน้ำอ้อยเคี่ยวและน้ำผึ้งป่าเดือนห้า',
    priceCents: 15000,
    quantity: 1,
    type: 'Dessert',
  },
  {
    id: 'PAIR-03',
    title: 'Traditional Lanna Layered Pudding with Coconut Cream',
    thaiTitle: 'ขนมปาดล้านนาโบราณราดกะทิสด',
    priceCents: 12000,
    quantity: 1,
    type: 'Dessert',
  },
  {
    id: 'PAIR-04',
    title: 'Chulalongkorn Rose & White Tea Macarons',
    thaiTitle: 'มาการองกลิ่นกุหลาบจุฬาลงกรณ์และชาขาว',
    priceCents: 16000,
    quantity: 1,
    type: 'Dessert',
  },
];

export function FullMenuCatalogModal({
  isOpen,
  onClose,
  onSelectTeaDetail,
  onAddToCart,
}: FullMenuModalProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Herbal' | 'Floral' | 'Dessert'>('All');

  if (!isOpen) return null;

  const filteredTeas = TEA_CATALOG.filter((t) => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-serif">
      <div className="bg-[#FAF8F5] border border-stone-300 max-w-3xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 relative">
        {/* Header */}
        <div className="border-b border-stone-200 pb-4 mb-4 flex justify-between items-start">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-sans text-[#8C7355]">
              The Tea Folio
            </span>
            <h3 className="text-2xl font-normal text-stone-900 mt-0.5">
              ทำเนียบชาและของว่างเอกลักษณ์
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-1">
              คอลเลกชันชาพญาดอย 10 รายการ และของว่างสำรับชาววังล้านนา
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 text-xl font-sans px-2"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 font-sans text-xs border-b border-stone-200 pb-2">
          {(['All', 'Herbal', 'Floral', 'Dessert'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 transition ${
                activeCategory === cat
                  ? 'bg-[#25323D] text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {cat === 'All' && 'เมนูทั้งหมด'}
              {cat === 'Herbal' && 'ชาสมุนไพรบำบัด (Herbal)'}
              {cat === 'Floral' && 'ชาดอกไม้อโรมา (Floral)'}
              {cat === 'Dessert' && 'ของว่างคู่สำรับ (Pairings)'}
            </button>
          ))}
        </div>

        {/* Catalog Content Grid */}
        <div className="overflow-y-auto max-h-[60vh] space-y-4 pr-1">
          {activeCategory !== 'Dessert' &&
            filteredTeas.map((tea) => (
              <div
                key={tea.id || tea.code}
                className="bg-white border border-stone-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-stone-400 transition"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 bg-stone-100 text-stone-700">
                      {tea.code}
                    </span>
                    <h4 className="text-base font-medium text-stone-900">{tea.name}</h4>
                  </div>
                  <p className="text-xs text-stone-600 font-sans">{tea.thaiName}</p>
                  <p className="text-xs text-stone-500 italic">{tea.ingredients}</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <span className="text-sm font-semibold font-sans text-stone-800 mr-2">
                    ฿{((tea.priceCents || 22000) / 100).toFixed(0)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTeaDetail(tea);
                    }}
                    className="text-xs text-stone-600 underline font-sans hover:text-black"
                  >
                    ดูวิธีชง
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onAddToCart({
                        id: tea.id || tea.code,
                        title: tea.name,
                        thaiTitle: tea.thaiName,
                        priceCents: tea.priceCents || 22000,
                        quantity: 1,
                        type: 'Tea',
                      })
                    }
                    className="px-3 py-1.5 bg-[#25323D] hover:bg-black text-white text-xs font-sans transition"
                  >
                    + สั่งชา
                  </button>
                </div>
              </div>
            ))}

          {(activeCategory === 'All' || activeCategory === 'Dessert') && (
            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-wider text-[#8C7355] font-sans font-semibold mb-3">
                สำรับของว่างและขนมหวานคู่ชา (Curated Pairings)
              </h4>
              <div className="space-y-3">
                {SIGNATURE_DESSERTS.map((dessert) => (
                  <div
                    key={dessert.id}
                    className="bg-[#F5F2EB] border border-[#D9D2C5] p-3.5 flex justify-between items-center"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-stone-900">{dessert.title}</p>
                      <p className="text-xs text-stone-600 font-sans">{dessert.thaiTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold font-sans text-stone-800">
                        ฿{(dessert.priceCents / 100).toFixed(0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(dessert)}
                        className="px-3 py-1 bg-[#8C7355] hover:bg-[#705c43] text-white text-xs font-sans transition"
                      >
                        + สั่งของว่าง
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 pt-3 mt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-stone-400 text-xs uppercase font-sans text-stone-700 hover:bg-stone-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullMenuCatalogModal;