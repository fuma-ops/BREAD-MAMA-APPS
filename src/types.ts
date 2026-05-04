export interface ProductQuality {
  ingredients: string;
  process: string;
  handmade: string;
  love: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

export interface Product {
  id: number;
  name: string;
  arabicName: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  quality: ProductQuality;
  reviews: Review[];
  images: string[];
  tags: string[];
  available: boolean;
  preparation_time: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export type OrderStatus = 'PENDING' | 'VALIDATED' | 'IN_PREPARATION' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderHistoryEvent {
  status: OrderStatus;
  timestamp: string;
  actor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  history?: OrderHistoryEvent[];
}
