// บังคับโครงสร้างให้ตรงกับ UI หน้าบ้านของเรา
export interface TeaMatrix {
  relaxation: number;
  healthBeauty: number;
  flavorBoldness: number;
  [key: string]: number | undefined; // ทิ้งไว้เผื่อ AI มันใส่แกนอื่นมาจะได้ไม่พัง
}

export interface TeaProduct {
  id: string;
  name: string;
  description: string;
  matrix: TeaMatrix;
  [key: string]: any; // รองรับข้อมูลจุกจิกเช่น price, stock
}

export interface UserAssessmentPayload {
  mood: number;
  taste: number;
  purpose: number;
}