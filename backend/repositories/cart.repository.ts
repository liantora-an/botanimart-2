import { createClient } from '@/lib/supabase/server';
import type { Cart, CartWithPlant } from '@/backend/types';

/**
 * cart.repository.ts
 * Data access layer for the public.carts table.
 */

const CART_SELECT = `
  *,
  plant:plants (
    id, name, slug, price, stock, unit, image_url, pickup_methods
  )
`;

/**
 * Returns all cart items for a user with plant details.
 */
export async function getCartByUserId(userId: string): Promise<CartWithPlant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('carts')
    .select(CART_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[cart.repository] getCartByUserId error:', error.message);
    return [];
  }
  return (data ?? []) as CartWithPlant[];
}

/**
 * Finds a specific cart item for a user + plant combination.
 */
export async function getCartItem(
  userId: string,
  plantId: string
): Promise<Cart | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .eq('plant_id', plantId)
    .single();

  if (error) return null;
  return data as Cart;
}

/**
 * Adds an item to the cart. If it already exists, increments quantity.
 * Enforced at DB level by UNIQUE(user_id, plant_id).
 */
export async function upsertCartItem(
  userId: string,
  plantId: string,
  quantity: number
): Promise<Cart | null> {
  const supabase = await createClient();

  // Check if item already exists
  const existing = await getCartItem(userId, plantId);

  if (existing) {
    // Increment quantity
    const { data, error } = await supabase
      .from('carts')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('[cart.repository] upsertCartItem update error:', error.message);
      return null;
    }
    return data as Cart;
  }

  // Insert new item
  const { data, error } = await supabase
    .from('carts')
    .insert({ user_id: userId, plant_id: plantId, quantity })
    .select()
    .single();

  if (error) {
    console.error('[cart.repository] upsertCartItem insert error:', error.message);
    return null;
  }
  return data as Cart;
}

/**
 * Updates the quantity of a cart item by its ID.
 */
export async function updateCartItemQuantity(
  cartId: string,
  userId: string,
  quantity: number
): Promise<Cart | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('carts')
    .update({ quantity })
    .eq('id', cartId)
    .eq('user_id', userId) // security: ensure ownership
    .select()
    .single();

  if (error) {
    console.error('[cart.repository] updateCartItemQuantity error:', error.message);
    return null;
  }
  return data as Cart;
}

/**
 * Removes a single cart item.
 */
export async function removeCartItem(
  cartId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('carts')
    .delete()
    .eq('id', cartId)
    .eq('user_id', userId);

  if (error) {
    console.error('[cart.repository] removeCartItem error:', error.message);
    return false;
  }
  return true;
}

/**
 * Clears the entire cart for a user. Called after successful checkout.
 */
export async function clearCart(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('carts')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('[cart.repository] clearCart error:', error.message);
    return false;
  }
  return true;
}

/**
 * Returns count of items in a user's cart.
 */
export async function getCartItemCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('carts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count ?? 0;
}
