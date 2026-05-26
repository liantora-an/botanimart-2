// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth Requests ────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Catalog Requests ─────────────────────────────────────────────────────────

export interface CreatePlantRequest {
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit?: string;
  image_url?: string;
  is_recommended?: boolean;
  pickup_methods?: string[];
  tags?: string[];
}

export type UpdatePlantRequest = Partial<CreatePlantRequest>;

export interface PlantQueryParams {
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  is_recommended?: boolean;
  tags?: string;
}

export interface AdjustStockRequest {
  delta: number; // positive = add, negative = remove
}

// ─── Cart Requests ────────────────────────────────────────────────────────────

export interface AddToCartRequest {
  plant_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// ─── Order Requests ───────────────────────────────────────────────────────────

export interface CheckoutRequest {
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'processing' | 'shipped' | 'completed' | 'canceled';
}

// ─── Activity Requests ────────────────────────────────────────────────────────

export interface CreateActivityRequest {
  title: string;
  author: string;
  category: string;
  summary: string;
  content?: string;
  image_url?: string;
  published?: boolean;
}

export type UpdateActivityRequest = Partial<CreateActivityRequest>;

// ─── Category Requests ────────────────────────────────────────────────────────

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon_name?: string;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
