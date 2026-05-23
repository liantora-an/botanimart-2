export type UserRole = 'User' | 'Admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_recommended: boolean;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  plant_id: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Settlement' | 'Expire' | 'Cancel';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  midtrans_transaction_id?: string | null;
  snap_token?: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  plant_id: string;
  price_at_purchase: number;
  quantity: number;
}
