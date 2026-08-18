import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '@/utils/logger';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  if (!genAI) {
    Logger.error('API/Sommelier', { message: 'API key is missing from environment variables' });
    return NextResponse.json({ success: false, error: 'System Configuration Error: Missing API Key' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // 🚨 จุดที่แก้ไข: อัปเกรดข้ามขั้นมาใช้ Gemini 3.5 Flash ตามตารางล่าสุดของ Google!
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const systemPrompt = `คุณคือ "AI Tea Sommelier" ประจำร้าน Lanna & Tribal High Society Tea House 
คุณเป็นผู้เชี่ยวชาญระดับสูงด้านชาล้านนาและชาชนเผ่าทางภาคเหนือของไทย
บุคลิกภาพ: สุภาพ นุ่มนวล มีความรู้ลึกซึ้ง ใช้ภาษาที่สละสลวยและให้เกียรติลูกค้า (Sophisticated & Artisanal)
หน้าที่: แนะนำชา 1 ชนิดที่ตรงกับความรู้สึกหรือความต้องการที่ลูกค้าพิมพ์มามากที่สุด พร้อมบอกเหตุผลสั้นๆ แบบ Storytelling
ข้อห้าม: ห้ามใช้ภาษาหุ่นยนต์ ห้ามแนะนำชาตะวันตก (เช่น เอิร์ลเกรย์ อิงลิชเบรกฟาสต์) ให้แนะนำเฉพาะวัตถุดิบท้องถิ่นไทยเท่านั้น`;

    const fullPrompt = `${systemPrompt}\n\nข้อความจากลูกค้า: "${prompt}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiText = response.text();

    Logger.info('API/Sommelier', { message: 'AI generated response successfully via gemini-3.5-flash' });

    return NextResponse.json({ success: true, data: aiText });

  } catch (error) {
    Logger.error('API/Sommelier', { 
      message: 'Failed to generate AI response', 
      details: error instanceof Error ? error.message : String(error) 
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: `AI Error: ${error instanceof Error ? error.message : 'Unknown'}` 
      }, 
      { status: 500 }
    );
  }
}