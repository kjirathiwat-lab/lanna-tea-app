export interface PairingItem {
  id: string;
  targetTeaId: string; // อ้างอิง ID ของชาที่เข้าคู่กัน
  name: string;
  description: string;
  price: number;
}

export const teaPairings: PairingItem[] = [
  { 
    id: 'P01', 
    targetTeaId: 'FT01', // สำหรับ Lanna Oolong Hills
    name: 'อาลัวชาวังอบควันเทียน', 
    description: 'ความหวานละมุนและกลิ่นควันเทียนอ่อนๆ จะช่วยชูความหอมของชาอู่หลงยอดน้ำค้างให้โดดเด่นยิ่งขึ้น', 
    price: 120 
  },
  { 
    id: 'P02', 
    targetTeaId: 'HT01', // สำหรับ Lanna Chrysanthemum Pu-erh
    name: 'ข้าวแต๋นน้ำแตงโมไซส์มินิ', 
    description: 'ความกรุบกรอบและรสหวานธรรมชาติ จะช่วยตัดความลุ่มลึกของชาผูเอ่อร์บ่มหมักได้อย่างลงตัว', 
    price: 85 
  },
  { 
    id: 'P03', 
    targetTeaId: 'HT02', // สำหรับ Lanna Mountain Black
    name: 'ดาร์กช็อกโกแลตสอดไส้มะแขว่น', 
    description: 'ยกระดับรสชาติชาดำด้วยมิติความเข้มข้น และความเผ็ดร้อนซ่าบางๆ ที่ปลายลิ้นของสมุนไพรล้านนา', 
    price: 150 
  }
];