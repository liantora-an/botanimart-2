-- ============================================================================
-- BotaniMart — Database Rollback: Undo Wholesale (Grosir) Configuration
-- Date: 2026-05-28
-- Description:
--   1. Removes price_per_pack and pack_size from public.plants.
--   2. Restores the carts table's unique constraint to (user_id, plant_id).
--   3. Removes purchase_type from public.carts and public.order_items.
--   4. Reverts RPC function create_order_with_items to its original state.
-- ============================================================================

-- 1. Remove grosir columns from plants
ALTER TABLE public.plants DROP COLUMN IF EXISTS price_per_pack;
ALTER TABLE public.plants DROP COLUMN IF EXISTS pack_size;

-- 2. Restore unique constraint on carts (drop purchase_type unique, restore original)
ALTER TABLE public.carts DROP CONSTRAINT IF EXISTS carts_user_id_plant_id_purchase_type_key;
ALTER TABLE public.carts DROP CONSTRAINT IF EXISTS carts_user_id_plant_id_key;
ALTER TABLE public.carts ADD CONSTRAINT carts_user_id_plant_id_key UNIQUE (user_id, plant_id);

-- 3. Remove purchase_type column from carts and order_items
ALTER TABLE public.carts DROP COLUMN IF EXISTS purchase_type;
ALTER TABLE public.order_items DROP COLUMN IF EXISTS purchase_type;

-- 4. Revert RPC function create_order_with_items to original (no purchase_type)
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_user_id UUID,
  p_total_amount INTEGER,
  p_midtrans_order_id TEXT,
  p_notes TEXT,
  p_items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- Insert order
  INSERT INTO public.orders (user_id, total_amount, midtrans_order_id, notes, status)
  VALUES (p_user_id, p_total_amount, p_midtrans_order_id, p_notes, 'pending')
  RETURNING id INTO v_order_id;

  -- Insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (order_id, plant_id, plant_name, price_at_purchase, quantity)
    VALUES (
      v_order_id,
      (v_item->>'plant_id')::UUID,
      v_item->>'plant_name',
      (v_item->>'price_at_purchase')::INTEGER,
      (v_item->>'quantity')::INTEGER
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;
