'use client';

import React from 'react';
import { CartItem } from '@/types/order.types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, items, onClose, onUpdateQty, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs font-serif">
      <div className="bg-[#FAF8F5] w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 border-l border-stone-300">
        <div>
          <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-4">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-sans text-[#8C7355]">
                Your Selection
              </span>
              <h3 className="text-xl font-normal text-stone-900 mt-0.5">ตะกร้าเมนูจิบชา</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-800 text-lg font-sans px-2"
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-stone-500 italic text-center py-12">
              ยังไม่มีรายการในตะกร้า เลือกเมนูชาหรือของว่างเพื่อสั่งซื้อ
            </p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 border border-stone-200"
                >
                  <div className="space-y-0.5 max-w-[200px]">
                    <p className="text-xs font-semibold text-stone-900">{item.title}</p>
                    <p className="text-[11px] text-stone-500 font-sans">{item.thaiTitle}</p>
                    <p className="text-xs text-[#8C7355] font-sans">
                      ฿{(item.priceCents / 100).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-sans">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-6 h-6 border border-stone-300 flex items-center justify-center text-xs hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-6 h-6 border border-stone-300 flex items-center justify-center text-xs hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <div className="flex justify-between items-center font-sans">
              <span className="font-serif text-stone-700">ยอดรวมสุทธิ</span>
              <span className="text-xl font-semibold text-stone-900">
                ฿{(totalCents / 100).toFixed(0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3 bg-[#25323D] hover:bg-black text-white text-xs uppercase tracking-wider font-sans transition"
            >
              ยืนยันการสั่ง (ส่งเข้า Tea Master)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;