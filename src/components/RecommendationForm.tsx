'use client';

import React, { useState } from 'react';
import { TeaProduct, UserAssessmentPayload } from '@/types/tea.types';
import { TeaDetailsModal } from './TeaDetailsModal';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { UpSaleRecommendation } from './UpSaleRecommendation';

export function RecommendationForm() {
  const { saveProfile } = useGuestProfile();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<TeaProduct[]>([]);
  const [selectedTea, setSelectedTea] = useState<TeaProduct | null>(null);
  
  const [assessment, setAssessment] = useState<UserAssessmentPayload>({
    mood: 1, taste: 1, purpose: 1
  });

  const [showDeepPath, setShowDeepPath] = useState<boolean>(false);
  const [deepPrompt, setDeepPrompt] = useState<string>('');
  const [isDeepLoading, setIsDeepLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null); // เพิ่ม State รับคำตอบ AI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setShowDeepPath(false);
    setAiResponse(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment),
      });
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setResults(data.data);
        saveProfile(assessment, data.data[0].id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันยิง API ไปหา AI Sommelier ตัวจริง
  const handleDeepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deepPrompt.trim()) return;
    
    setIsDeepLoading(true);
    setAiResponse(null);
    
    try {
      const response = await fetch('/api/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: deepPrompt }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAiResponse(data.data); // นำคำตอบ AI มาเก็บไว้โชว์
        setDeepPrompt('');
      } else {
        console.error('AI Error:', data.error);
      }
    } catch (error) {
      console.error('Error in Deep Personalization:', error);
    } finally {
      setIsDeepLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#3E3124] p-8 font-serif selection:bg-amber-200">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#2C3E50] mb-4">
            Lanna & Tribal
          </h1>
          <p className="text-[#8B7355] text-lg italic">
            "ค้นพบชาที่สะท้อนตัวตนและอารมณ์ของคุณในวันนี้"
          </p>
          <div className="w-24 h-[1px] bg-[#D4C4A8] mx-auto mt-6"></div>
        </div>

        {!loading && results.length === 0 && (
          <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-[#EBE5D9] relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B7355] via-[#D4C4A8] to-[#8B7355]"></div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-lg text-[#2C3E50]">1. อารมณ์ของคุณในขณะนี้?</label>
                <select 
                  className="w-full p-3 bg-[#FDFCF9] border border-[#EBE5D9] rounded-none focus:outline-none focus:border-[#8B7355] text-[#5C4D3C] appearance-none"
                  value={assessment.mood}
                  onChange={(e) => setAssessment({...assessment, mood: Number(e.target.value)})}
                >
                  <option value={1}>ต้องการความสงบและผ่อนคลายจากความวุ่นวาย</option>
                  <option value={2}>ต้องการความสดชื่นและพลังงานในการโฟกัส</option>
                  <option value={3}>รู้สึกเบิกบานและต้องการดื่มด่ำกับสุนทรียภาพ</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-lg text-[#2C3E50]">2. โทนรสชาติที่ปรารถนา?</label>
                <select 
                  className="w-full p-3 bg-[#FDFCF9] border border-[#EBE5D9] rounded-none focus:outline-none focus:border-[#8B7355] text-[#5C4D3C] appearance-none"
                  value={assessment.taste}
                  onChange={(e) => setAssessment({...assessment, taste: Number(e.target.value)})}
                >
                  <option value={1}>นุ่มนวล หอมกลิ่นดอกไม้และธรรมชาติ</option>
                  <option value={2}>เข้มข้น ลุ่มลึก มีมิติของเครื่องเทศ</option>
                  <option value={3}>สดชื่น อมเปรี้ยวอมหวานแบบผลไม้ป่า</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-lg text-[#2C3E50]">3. สิ่งที่อยากให้ชาแก้วนี้มอบให้?</label>
                <select 
                  className="w-full p-3 bg-[#FDFCF9] border border-[#EBE5D9] rounded-none focus:outline-none focus:border-[#8B7355] text-[#5C4D3C] appearance-none"
                  value={assessment.purpose}
                  onChange={(e) => setAssessment({...assessment, purpose: Number(e.target.value)})}
                >
                  <option value={1}>บำรุงผิวพรรณและปรับสมดุลร่างกาย</option>
                  <option value={2}>ช่วยเรื่องระบบย่อยอาหารและความอบอุ่น</option>
                  <option value={3}>ซึมซับเรื่องราวและวัฒนธรรมท้องถิ่น</option>
                </select>
              </div>

              <button type="submit" className="w-full mt-6 py-4 bg-[#2C3E50] text-[#F9F6F0] tracking-widest uppercase text-sm hover:bg-[#1A252F] transition-colors">
                รับการรังสรรค์เมนูชา
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#EBE5D9] border-t-[#8B7355] rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-serif text-[#2C3E50] mb-2">กำลังรังสรรค์เมนูชา...</h3>
            <p className="text-[#8B7355] italic">วิเคราะห์ความเข้ากันได้ของรสชาติและอารมณ์</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-10 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-[#2C3E50] mb-3">Lanna Tea Selections</h2>
              <p className="text-[#8B7355] text-sm tracking-widest uppercase">ชาที่รังสรรค์มาเพื่อคุณโดยเฉพาะ</p>
              <div className="w-16 h-[1px] bg-[#8B7355] mx-auto mt-6"></div>
            </div>
            
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              {results.map((tea, index) => (
                <div key={tea.id} className="bg-transparent border border-[#D4C4A8] p-8 flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-[#FDFCF9] transition-all duration-300 relative overflow-hidden">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-[#8B7355] font-serif italic text-lg">No. {index + 1}</span>
                      <h3 className="text-2xl font-serif text-[#2C3E50]">{tea.name}</h3>
                    </div>
                    <p className="text-[#5C4D3C] text-sm leading-relaxed mt-3">
                      {tea.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 md:mt-0 md:pl-6 md:border-l md:border-[#EBE5D9] flex flex-col items-start md:items-end min-w-[120px]">
                    <span className="text-xs text-[#8B7355] tracking-widest uppercase mb-1">Match Rate</span>
                    <span className="text-xl text-[#2C3E50] font-serif">{Math.floor(99 - (index * 4.5))}%</span>
                    <button 
                      onClick={() => setSelectedTea(tea)}
                      className="mt-4 text-xs text-[#2C3E50] border-b border-[#2C3E50] pb-1 hover:text-[#8B7355] hover:border-[#8B7355] transition-colors uppercase tracking-wider"
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <UpSaleRecommendation />

            {/* ส่วน Deep Path ที่อัปเดตให้แสดงผลลัพธ์จาก AI */}
            {!showDeepPath && !aiResponse ? (
              <div className="mt-8 text-center animate-fade-in">
                <button 
                  onClick={() => setShowDeepPath(true)}
                  className="text-[#8B7355] text-sm underline hover:text-[#2C3E50] transition-colors italic"
                >
                  ไม่พบชาที่ถูกใจ? ขอคำแนะนำเชิงลึก (Deep Personalization)
                </button>
              </div>
            ) : null}

            {/* ฟอร์มรับข้อมูล AI */}
            {showDeepPath && !aiResponse && (
              <div className="mt-12 bg-white p-8 border border-[#D4C4A8] animate-fade-in-up">
                <h3 className="text-2xl font-serif text-[#2C3E50] mb-3">AI Tea Sommelier</h3>
                <p className="text-[#5C4D3C] text-sm mb-6">
                  บอกเล่าความรู้สึกของคุณอย่างอิสระ เพื่อให้ผู้เชี่ยวชาญ AI รังสรรค์ชาที่ตอบโจทย์คุณที่สุด
                </p>
                <form onSubmit={handleDeepSubmit}>
                  <textarea
                    rows={4}
                    className="w-full p-4 bg-[#FDFCF9] border border-[#EBE5D9] focus:outline-none focus:border-[#8B7355] text-[#5C4D3C] resize-none mb-4"
                    placeholder="เช่น วันนี้ประชุมหนักมาก รู้สึกเหนื่อยล้า อยากได้ชาที่ดื่มแล้วตาสว่างแต่ไม่ทำให้ใจสั่น..."
                    value={deepPrompt}
                    onChange={(e) => setDeepPrompt(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowDeepPath(false)}
                      className="px-6 py-3 border border-[#2C3E50] text-[#2C3E50] uppercase tracking-widest text-xs hover:bg-[#F9F6F0] transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      type="submit" 
                      disabled={isDeepLoading || !deepPrompt.trim()}
                      className="flex-1 px-6 py-3 bg-[#2C3E50] text-[#F9F6F0] uppercase tracking-widest text-xs hover:bg-[#1A252F] transition-colors disabled:opacity-50"
                    >
                      {isDeepLoading ? 'กำลังปรึกษาผู้เชี่ยวชาญ...' : 'ขอคำแนะนำจาก AI'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* แสดงคำตอบที่ได้จาก AI */}
            {aiResponse && (
              <div className="mt-12 bg-[#2C3E50] text-[#F9F6F0] p-8 md:p-10 relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 right-0 w-40 h-40 border border-[#8B7355] rounded-full opacity-20 -mr-10 -mt-10"></div>
                <h3 className="text-2xl font-serif text-[#D4C4A8] mb-4">The Sommelier's Recommendation</h3>
                <div className="prose prose-invert prose-p:text-[#EBE5D9] prose-p:leading-relaxed max-w-none">
                  {/* แสดงข้อความที่ได้จาก AI โดยจัดการบรรทัดใหม่ให้สวยงาม */}
                  {aiResponse.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
                <div className="mt-8 text-center">
                   <button 
                    onClick={() => { setAiResponse(null); setShowDeepPath(true); setDeepPrompt(''); }}
                    className="text-[#D4C4A8] text-sm underline hover:text-white transition-colors"
                  >
                    ปรึกษาเรื่องอื่นเพิ่มเติม
                  </button>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center gap-4">
              <button onClick={() => setResults([])} className="px-8 py-3 border border-[#2C3E50] text-[#2C3E50] uppercase tracking-widest text-xs hover:bg-[#2C3E50] hover:text-[#F9F6F0] transition-colors">
                เริ่มประเมินใหม่
              </button>
            </div>
          </div>
        )}
      </div>

      <TeaDetailsModal 
        isOpen={selectedTea !== null} 
        onClose={() => setSelectedTea(null)} 
        tea={selectedTea} 
      />
    </div>
  );
}