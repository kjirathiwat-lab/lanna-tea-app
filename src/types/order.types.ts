import { TeaProduct } from './tea.types';

export interface UpSaleItem {
  id: string;
  name: string;
  thaiName: string;
  priceCents: number;
  description: string;
  category: 'Dessert' | 'Snack' | 'Teaware';
}

export interface CartItem {
  id: string;
  title: string;
  thaiTitle: string;
  priceCents: number;
  quantity: number;
  type: 'Tea' | 'Dessert';
}

export interface OrderPayload {
  orderId: string;
  items: CartItem[];
  totalPriceCents: number;
  createdAt: string;
}