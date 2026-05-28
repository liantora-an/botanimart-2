import {
  getCartByUserId,
  upsertCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getCartItemCount,
} from '@/backend/repositories/cart.repository';
import { getPlantById } from '@/backend/repositories/catalog.repository';
import type { CartWithPlant } from '@/backend/types';

/**
 * cart.service.ts
 * Business logic for shopping cart operations.
 * Requires login — no guest cart.
 */

export interface CartResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Returns the current user's cart with plant details and computed total.
 */
export async function getCart(userId: string): Promise<{
  items: CartWithPlant[];
  totalItems: number;
  totalPrice: number;
}> {
  const items = await getCartByUserId(userId);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.plant?.price ?? 0) * item.quantity,
    0
  );
  return { items, totalItems, totalPrice };
}

/**
 * Adds a plant to the cart. Validates stock before adding.
 */
export async function addToCart(
  userId: string,
  plantId: string,
  quantity: number
): Promise<CartResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: 'Jumlah tidak valid. Minimal 1.' };
  }

  // Validate plant exists and has sufficient stock
  const plant = await getPlantById(plantId);
  if (!plant) {
    return { success: false, error: 'Produk tidak ditemukan.' };
  }
  if (plant.stock < quantity) {
    return {
      success: false,
      error: `Stok tidak mencukupi. Tersisa ${plant.stock} ${plant.unit}.`,
    };
  }

  const cartItem = await upsertCartItem(userId, plantId, quantity);
  if (!cartItem) {
    return { success: false, error: 'Gagal menambahkan ke keranjang.' };
  }
  return { success: true, data: cartItem };
}

/**
 * Updates the quantity of an existing cart item.
 */
export async function updateCartItem(
  userId: string,
  cartId: string,
  quantity: number
): Promise<CartResult> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: 'Jumlah minimal 1.' };
  }
  if (quantity > 999) {
    return { success: false, error: 'Jumlah maksimal 999.' };
  }

  const updated = await updateCartItemQuantity(cartId, userId, quantity);
  if (!updated) {
    return { success: false, error: 'Item keranjang tidak ditemukan.' };
  }
  return { success: true, data: updated };
}

/**
 * Removes a single item from the cart.
 */
export async function removeFromCart(
  userId: string,
  cartId: string
): Promise<CartResult> {
  const ok = await removeCartItem(cartId, userId);
  if (!ok) {
    return { success: false, error: 'Item tidak ditemukan.' };
  }
  return { success: true };
}

/**
 * Clears the entire cart (used after checkout).
 */
export async function emptyCart(userId: string): Promise<CartResult> {
  const ok = await clearCart(userId);
  if (!ok) {
    return { success: false, error: 'Gagal mengosongkan keranjang.' };
  }
  return { success: true };
}

/**
 * Validates cart stock before checkout.
 * Returns list of items with insufficient stock.
 */
export async function validateCartForCheckout(userId: string): Promise<{
  valid: boolean;
  items: CartWithPlant[];
  insufficientItems: Array<{ plantId: string; name: string; available: number; requested: number }>;
  totalAmount: number;
}> {
  const items = await getCartByUserId(userId);

  if (items.length === 0) {
    return { valid: false, items: [], insufficientItems: [], totalAmount: 0 };
  }

  const insufficientItems: Array<{
    plantId: string;
    name: string;
    available: number;
    requested: number;
  }> = [];

  for (const item of items) {
    if (!item.plant) continue;
    if (item.plant.stock < item.quantity) {
      insufficientItems.push({
        plantId: item.plant_id,
        name: item.plant.name,
        available: item.plant.stock,
        requested: item.quantity,
      });
    }
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.plant?.price ?? 0) * item.quantity,
    0
  );

  return {
    valid: insufficientItems.length === 0,
    items,
    insufficientItems,
    totalAmount,
  };
}
