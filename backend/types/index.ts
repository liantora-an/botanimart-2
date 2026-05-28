// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'User' | 'Admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  created_at: string;
}

// ─── Plant / Catalog ─────────────────────────────────────────────────────────

export interface Plant {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;           // stored as integer IDR (e.g. 25000)
  stock: number;
  unit: string;            // e.g. "buah", "pack"
  image_url: string | null;
  is_recommended: boolean;
  pickup_methods: string[];
  tags: string[];
  sold_count: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  // joined relation
  category?: Category;
}

export interface PlantWithCategory extends Omit<Plant, 'category'> {
  category: Category | null;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface Cart {
  id: string;
  user_id: string;
  plant_id: string;
  quantity: number;
  created_at: string;
  // joined
  plant?: Plant;
}

export interface CartWithPlant extends Cart {
  plant: Plant;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'expired'
  | 'canceled';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  midtrans_order_id: string | null;
  midtrans_transaction_id: string | null;
  snap_token: string | null;
  payment_method: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  order_items?: OrderItem[];
  user?: Pick<User, 'id' | 'email' | 'full_name'>;
}

export interface OrderItem {
  id: string;
  order_id: string;
  plant_id: string;
  plant_name: string;         // snapshot of name at purchase time
  price_at_purchase: number;
  quantity: number;
  subtotal: number;           // generated column: price_at_purchase * quantity
  // joined
  plant?: Pick<Plant, 'id' | 'name' | 'image_url' | 'slug'>;
}

// ─── Activity (Kegiatan) ─────────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  summary: string;
  content: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  plant_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Pick<User, 'id' | 'full_name'>;
}
