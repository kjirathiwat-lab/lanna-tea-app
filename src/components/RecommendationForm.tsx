'use client';

import React, { useState } from 'react';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { RecommendationResult, TeaProduct, UserAssessmentPayload } from '@/types/tea.types';
import { Logger } from '@/utils/logger';
import { UpSaleRecommendation } from './UpSaleRecommendation';
import { TeaDetailsModal } from './TeaDetailsModal';

const MOOD_OPTIONS = [
  { value: 'ต้องการความสงบและผ่อนคลายจากความวุ่นวาย', label: 'ต้องการความสงบและผ่อนคลายจากความวุ่นวาย' },
  { value: 'ต้องการสมาธิ ปลุกพลังสมองและความคิดสร้างสรรค์', label: 'ต้องการสมาธิ ปลุกพลังสมองและความคิดสร้างสรรค์' },
  { value: 'รู้สึกเหนื่อยล้า อยากได้ความสดชื่นรื่นรมย์', label: 'รู้สึกเหนื่อยล้า อยากได้ความสดชื่นรื่นรมย์' },
  { value: 'อยากเปิดรับประสบการณ์ใหม่ สัมผัสเรื่องราวล้านนา', label: 'อยากเปิดรับประสบการณ์ใหม่ สัมผัสเรื่องราวล้านนา' },
];

const TASTE_OPTIONS = [
  { value: 'เข้มข้น ลุ่มลึก มีมิติของเครื่องเทศและไม้อบ', label: 'เข้มข้น ลุ่มลึก มีมิติของเครื่องเทศและไม้อบ' },
  { value: 'หอมหวานอวลกลิ่นดอกไม้ นุ่มนวลละมุนลิ้น', label: 'หอมหวานอวลกลิ่นดอกไม้ นุ่มนวลละมุนลิ้น' },
  { value: 'นุ่มเบา กลมกล่อม สดชื่น ชุ่มคอ ดื่มง่าย', label: 'นุ่มเบา กลมกล่อม สดชื่น ชุ่มคอ ดื่มง่าย' },
  { value: 'เปรี้ยวอมหวาน สดชื่น มีชีวิตชีวา', label: 'เปรี้ยวอมหวาน สดชื่น มีชีวิตชีวา' },
];

const PURPOSE_OPTIONS = [
  { value: 'บำรุงผิวพรรณและปรับสมดุลร่างกาย', label: 'บำรุงผิวพรรณและปรับสมดุลร่างกาย' },
  { value: 'เพิ่มสมาธิ บำรุงสมอง พร้อมสำหรับงานบริหาร', label: 'เพิ่มสมาธิ บำรุงสมอง พร้อมสำหรับงานบริหาร' },
  { value: 'คลายเครียด ปรับสมดุลอารมณ์ ช่วยให้นอนหลับสบาย', label: 'คลายเครียด ปรับสมดุลอารมณ์ ช่วยให้นอนหลับสบาย' },
  { value: 'ช่วยระบบย่อยอาหาร อบอุ่นร่างกาย มอบพลังงาน', label: 'ช่วยระบบย่อยอาหาร อบอุ่นร่างกาย มอบพลังงาน' },
];

export function RecommendationForm() {
  const { profile, isLoaded, isReturningGuest, recordVisitAndOrder } = useGuestProfile();

  // Form State
  const [mood, setMood] = useState<string>(MOOD_OPTIONS[0].value);
  const [taste, setTaste] = useState<string>(TASTE_OPTIONS[0].value);
  const [purpose, setPurpose] = useState<string>(PURPOSE_OPTIONS[0].value);

  // Flow & Interaction State
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTea, setSelectedTea] = useState<TeaProduct | null>(null);

  // Hybrid Flow State (AI Sommelier Deep Dive)
  const [showDeepDive, setShowDeepDive] = useState<boolean>(false);
  const [deepDivePrompt, setDeepDivePrompt] = useState<string>('');
  const [deepDiveResult, setDeepDiveResult] = useState<string | null>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState<boolean>(false);
  const [deepDiveError, setDeepDiveError] = useState<string | null>(null);

  // 1. Submit Quick Match (Phase 1)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: UserAssessmentPayload = { mood, taste, purpose };

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'ไม่สามารถประมวลผลคำแนะนำได้');
      }

      setResults(json.data);

      if (json.data.length > 0) {
        recordVisitAndOrder(payload, json.data[0].tea);
      }

      Logger.info('Recommendation calculated successfully', { count: json.data.length }, 'UI/RecommendationForm');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการประมวลผล';
      setError(message);
      Logger.error('Form submission error', err, undefined, 'UI/RecommendationForm');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Deep Dive AI Sommelier (Phase 3)
  const handleDeepDiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deepDivePrompt.trim() || deepDiveLoading) return;

    setDeepDiveLoading(true);
    setDeepDiveError(null);
    setDeepDiveResult(null);

    try {
      const res = await fetch('/api/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: deepDivePrompt.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'AI Sommelier ไม่สามารถให้คำแนะนำได้ในขณะนี้');
      }

      setDeepDiveResult(json.data);
      Logger.info('AI Sommelier consultation completed', undefined, 'UI/RecommendationForm');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ AI';
      setDeepDiveError(message);
      Logger.error('Deep dive submission error', err, undefined, 'UI/RecommendationForm');
    } finally {
      setDeepDiveLoading(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setShowDeepDive(false);
    setDeepDiveResult(null);
    setDeepDiveError(null);
    setDeepDivePrompt('');
    setDeepDiveLoading(false);
    setError(null);
  };

  return (
    <div className="w-full font-serif text-stone-800">
      {/* Header Banner */}
      <div className="bg-black text-white text-center py-5 px-4 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold tracking-wide">Lanna Tea</h2>
        <p className="text-xs text-stone-400 mt-1 tracking-wider">
          Discover teas from Northern Thailand, matched to your taste.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Brand Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-normal text-slate-800 tracking-tight">
            Lanna & Tribal
          </h1>
          <p className="text-sm italic text-stone-600 mt-2 font-serif">
            &quot;ค้นพบชาที่สะท้อนตัวตนและอารมณ์ของคุณในวันนี้&quot;
          </p>
          <div className="w-16 h-px bg-stone-300 mx-auto mt-4" />
        </div>

        {/* Anonymous Personalization Greeting */}
        {isLoaded && isReturningGuest && profile?.lastOrderedTea && results.length === 0 && (
          <div className="mb-6 p-4 bg-[#F5F2EB] border border-[#D9D2C5] text-center space-y-1">
            <p className="text-xs font-sans uppercase tracking-widest text-[#8C7355]">
              Welcome Back • ยินดีต้อนรับกลับมาเยือนอีกครั้ง (ครั้งที่ {profile.visitCount})
            </p>
            <p className="text-xs text-stone-700 italic">
              ครั้งก่อนคุณเลือกลิ้มลอง &quot;{profile.lastOrderedTea.name}&quot; วันนี้ต้องการรสชาติเดิมหรือลองสิ่งใหม่ดีครับ?
            </p>
          </div>
        )}

        {/* State 1: Choice Selection Form (Quick Match) */}
        {results.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-stone-200/80 p-8 shadow-sm border-t-2 border-t-[#8C7355]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-800 mb-2">
                  1. อารมณ์ของคุณในขณะนี้?
                </label>
                <div className="relative">
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-stone-600 appearance-none cursor-pointer pr-10"
                  >
                    {MOOD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-800 mb-2">
                  2. โทนรสชาติที่ปรารถนา?
                </label>
                <div className="relative">
                  <select
                    value={taste}
                    onChange={(e) => setTaste(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-stone-600 appearance-none cursor-pointer pr-10"
                  >
                    {TASTE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-800 mb-2">
                  3. สิ่งที่อยากให้ชาแก้วนี้มอบให้?
                </label>
                <div className="relative">
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-3 bg-white border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-stone-600 appearance-none cursor-pointer pr-10"
                  >
                    {PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                    ▼
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#25323D] hover:bg-[#1B252D] text-white text-sm font-sans tracking-wide transition duration-150 disabled:opacity-50"
              >
                {loading ? 'กำลังรังสรรค์เมนูชา...' : 'รับการรังสรรค์เมนูชา'}
              </button>
            </form>
          </div>
        ) : (
          /* State 2: Results Display + Up-Sale + Hybrid Deep Dive */
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-normal text-slate-800">
                Lanna Tea Selections
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                ชาที่รังสรรค์มาเพื่อคุณโดยเฉพาะ
              </p>
            </div>

            {/* Tea Cards */}
            <div className="space-y-4">
              {results.map((item, idx) => {
                const displayRate = item.matchPercentage || Math.min(99, Math.max(80, 99 - idx * 5));

                return (
                  <div
                    key={item.tea.id || item.tea.code}
                    className="bg-[#FAF8F5] border border-stone-300/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-stone-400"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-baseline gap-2">
                        <span className="italic text-stone-500 text-sm">
                          No. {idx + 1}
                        </span>
                        <h3 className="text-lg font-medium text-slate-900">
                          {item.tea.name}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {item.tea.description || item.tea.story}
                      </p>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-200">
                      <div>
                        <div className="text-[10px] tracking-widest text-stone-400 uppercase font-sans">
                          MATCH RATE
                        </div>
                        <div className="text-xl font-light text-slate-800">
                          {displayRate}%
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTea(item.tea)}
                        className="text-xs text-stone-700 underline hover:text-black mt-2 font-sans"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Up-Sale Component */}
            {results.length > 0 && (
              <div className="mt-6">
                <UpSaleRecommendation primaryTea={results[0].tea} />
              </div>
            )}

            {/* Hybrid Deep-Dive Trigger */}
            {!showDeepDive ? (
              <div className="text-center pt-4 border-t border-stone-200">
                <p className="text-xs text-stone-500 mb-3">
                  ยังไม่ตรงใจ หรือต้องการรสชาติที่เฉพาะเจาะจงเป็นพิเศษ?
                </p>
                <button
                  type="button"
                  onClick={() => setShowDeepDive(true)}
                  className="px-5 py-2 bg-[#8C7355] hover:bg-[#735C42] text-white text-xs tracking-wider uppercase font-sans transition"
                >
                  ปรึกษา AI Tea Sommelier แบบเจาะลึก
                </button>
              </div>
            ) : (
              /* Deep-Dive AI Sommelier Chat Section */
              <div className="mt-8 p-6 bg-stone-50 border border-stone-300 space-y-4">
                <h4 className="text-base font-medium text-slate-900">
                  AI Tea Sommelier Consultation (คำปรึกษาเจาะลึก)
                </h4>
                <form onSubmit={handleDeepDiveSubmit} className="space-y-3">
                  <textarea
                    value={deepDivePrompt}
                    onChange={(e) => setDeepDivePrompt(e.target.value)}
                    placeholder="ระบุความต้องการเพิ่มเติม เช่น อยากได้ชาที่มีกลิ่นควันไม้เล็กน้อย หรือต้องการดื่มหลังมื้ออาหารหนัก..."
                    className="w-full p-3 bg-white border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-600 h-24"
                    maxLength={300}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-400">
                      {deepDivePrompt.length}/300 ตัวอักษร
                    </span>
                    <button
                      type="submit"
                      disabled={deepDiveLoading || !deepDivePrompt.trim()}
                      className="px-4 py-2 bg-[#25323D] hover:bg-[#1B252D] text-white text-xs font-sans disabled:opacity-50 transition cursor-pointer"
                    >
                      {deepDiveLoading ? 'กำลังวิเคราะห์...' : 'ส่งคำขอคำแนะนำ'}
                    </button>
                  </div>
                </form>

                {deepDiveError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {deepDiveError}
                  </div>
                )}

                {deepDiveResult && (
                  <div className="mt-4 p-4 bg-white border-l-2 border-[#8C7355] text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                    <div className="font-semibold text-stone-900 mb-1">
                      คำแนะนำจาก Sommelier:
                    </div>
                    {deepDiveResult}
                  </div>
                )}
              </div>
            )}

            {/* Reset Button */}
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-stone-400 text-xs tracking-wider uppercase font-sans text-stone-700 hover:bg-stone-100 transition"
              >
                ค้นหาใหม่อีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal View Details */}
      {selectedTea && (
        <TeaDetailsModal
          tea={selectedTea}
          isOpen={!!selectedTea}
          onClose={() => setSelectedTea(null)}
        />
      )}
    </div>
  );
}

export default RecommendationForm;