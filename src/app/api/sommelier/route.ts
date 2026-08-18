import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '@/utils/logger';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MAX_PROMPT_LENGTH = 300;

const TEA_MENU_CONTEXT = `
[รายการชา 10 Signature Blends ของร้าน Lanna & Tribal]:
1. Royal Assam Ginger Supreme (HT01): ชาอัสสัม + ขิงแก่ดอย + ชะเอมเทศ (รสเข้ม อบอุ่น ช่วยย่อย)
2. Northern Lemongrass & Oolong (HT02): ชาอูหลง + ตะไคร้หอมดอย + ใบเตย (หอมนุ่ม สดชื่น คลายเครียด)
3. Chiang Rai Cinnamon Black (HT03): ชาดำดอยช้าง + อบเชยไทย + มะกรูดเชื่อม (คลาสสิกสไตล์อังกฤษ รสลุ่มลึก)
4. Golden Gooseberry & Wild Tea (HT04): ชาเมี่ยงป่า + มะขามป้อม + ผลหม่อน (เปรี้ยวอมหวาน ชุ่มคอ วิตามินซีสูง)
5. Doi Chang Gotu Kola & White (HT05): ชาขาวเข็มเงิน + ใบบัวบก + ชะเอม (รสนุ่มเบา สดชื่น บำรุงสมอง)
6. Chulalongkorn Rose Oolong (FT01): ชาอูหลง + กุหลาบจุฬาลงกรณ์ (หอมหวานโรแมนติก บำรุงผิวพรรณ)
7. Wild Chamomile & Mountain Green (FT02): ชาเขียวป่า + เก๊กฮวยป่า/คาโมมายล์ (หอมนุ่มนวล หลับสบาย)
8. Siam Coffee Blossom White (FT03): ชาขาวเข็มเงิน + ดอกกาแฟอาราบิก้า (กลิ่นวานิลลาผสมมะลิ หายาก)
9. Royal Lotus & Jade Oolong (FT04): ชาอูหลง + เกสรบัวหลวง + ดอกปีบ (หอมเย็น ปรับสมดุล สร้างสมาธิ)
10. Highland Hibiscus Imperial (FT05): ชาดำ + กระเจี๊ยบแดงดอย + ดอกคำฝอย (สีแดงก่ำ เปรี้ยวอมหวาน สดชื่น)

[รายการขนม/Food Pairing ประจำร้าน]:
1. ข้าวปุกงาดอยน้ำอ้อยเคี่ยวและน้ำผึ้งป่าเดือนห้า (฿150) — เหมาะกับชาสมุนไพรรสเข้มข้น เช่น Royal Assam Ginger หรือ Chiang Rai Cinnamon Black
2. ชุดสโคนชาอูหลงยอดดอยเสิร์ฟคู่แยมเกสรบัวหลวง (฿180) — เหมาะกับชาดอกไม้ เช่น Chulalongkorn Rose Oolong หรือ Royal Lotus & Jade Oolong
3. ขนมปาดล้านนาโบราณราดกะทิสด (฿120) — เหมาะกับชาดำรสลุ่มลึก เช่น Chiang Rai Cinnamon Black
4. มาการองกลิ่นกุหลาบจุฬาลงกรณ์และชาขาว (฿160) — เหมาะกับชาขาว Siam Coffee Blossom White หรือ Doi Chang Gotu Kola & White
`;

export async function POST(request: Request) {
  if (!genAI) {
    Logger.error('API key is missing from environment variables', null, undefined, 'API/Sommelier');
    return NextResponse.json({ success: false, error: 'System Configuration Error: Missing API Key' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid prompt string is required' }, { status: 400 });
    }

    const sanitizedPrompt = prompt.trim();

    if (sanitizedPrompt.length === 0) {
      return NextResponse.json({ success: false, error: 'Prompt cannot be empty' }, { status: 400 });
    }

    if (sanitizedPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ 
        success: false, 
        error: `Prompt is too long (Maximum ${MAX_PROMPT_LENGTH} characters allowed)` 
      }, { status: 422 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.6-flash',
      generationConfig: {
        maxOutputTokens: 2048, 
        temperature: 0.7,
      },
      systemInstruction: `คุณคือ "AI Tea Sommelier" ประจำร้าน Lanna & Tribal High Society Tea House
หน้าที่: ให้คำแนะนำเมนูชาและขนมทานเล่นที่เข้าคู่กัน (Pairing) โดยใช้ภาษาไทยระดับทางการ นุ่มนวล สุภาพ และสละสลวย

กฎเกณฑ์สำคัญ:
1. ตอบเป็นภาษาไทยล้วนเท่านั้น และต้องเขียนจบประโยคอย่างสมบูรณ์
2. แนะนำเฉพาะเมนูชา หรือเมนูขนมที่มีอยู่ในรายการด้านล่างนี้เท่านั้น
3. เมื่อแนะนำขนม ให้ระบุชื่อเมนู ราคา และเหตุผลของการจับคู่กับชาให้ครบถ้วน

${TEA_MENU_CONTEXT}`
    });

    let aiText = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await model.generateContent(`[คำขอจากลูกค้า]: ${sanitizedPrompt}\n\n[คำตอบจาก Sommelier เป็นภาษาไทยที่ครบถ้วนสมบูรณ์]:`);
        const response = await result.response;
        aiText = response.text();
        if (aiText) break;
      } catch (err: any) {
        if (attempt === 1 && err?.message?.includes('503')) {
          await new Promise(resolve => setTimeout(resolve, 800));
          continue;
        }
        throw err;
      }
    }

    Logger.info('AI generated response successfully', { promptLength: sanitizedPrompt.length }, 'API/Sommelier');

    return NextResponse.json({ success: true, data: aiText });

  } catch (error: any) {
    Logger.error('Failed to generate AI response', error, undefined, 'API/Sommelier');
    
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message?.includes('503') 
          ? 'AI Sommelier กำลังให้บริการลูกค้าท่านอื่นอยู่ กรุณากดลองใหม่อีกครั้งครับ'
          : `AI Error: ${error instanceof Error ? error.message : 'Internal Server Error'}`
      }, 
      { status: 500 }
    );
  }
}