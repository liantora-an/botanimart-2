-- ============================================================================
-- BotaniMart — Supabase Database Migration
-- Version: 001_initial_schema
-- Date: 2026-05-25
-- ============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Custom Types ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending', 'paid', 'processing', 'shipped', 'completed', 'expired', 'canceled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- 1. Users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL UNIQUE,
  full_name  TEXT,
  phone      TEXT,
  address    TEXT,
  role       TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  icon_name  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Plants (product catalog)
CREATE TABLE IF NOT EXISTS public.plants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  price            INTEGER NOT NULL CHECK (price >= 0),
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit             TEXT NOT NULL DEFAULT 'buah',
  image_url        TEXT,
  is_recommended   BOOLEAN NOT NULL DEFAULT false,
  pickup_methods   TEXT[] NOT NULL DEFAULT ARRAY['Kirim', 'Ambil Langsung'],
  tags             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  sold_count       INTEGER NOT NULL DEFAULT 0,
  rating_avg       NUMERIC(3,2) DEFAULT 0.00,
  rating_count     INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Carts
CREATE TABLE IF NOT EXISTS public.carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plant_id   UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plant_id)
);

-- 5. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES public.users(id),
  total_amount             INTEGER NOT NULL CHECK (total_amount >= 0),
  status                   order_status NOT NULL DEFAULT 'pending',
  midtrans_order_id        TEXT UNIQUE,
  midtrans_transaction_id  TEXT UNIQUE,
  snap_token               TEXT,
  payment_method           TEXT,
  paid_at                  TIMESTAMPTZ,
  notes                    TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  plant_id          UUID NOT NULL REFERENCES public.plants(id),
  plant_name        TEXT NOT NULL,
  price_at_purchase INTEGER NOT NULL CHECK (price_at_purchase >= 0),
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  subtotal          INTEGER GENERATED ALWAYS AS (price_at_purchase * quantity) STORED
);

-- 7. Activities (Kegiatan / blog articles)
CREATE TABLE IF NOT EXISTS public.activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  author      TEXT NOT NULL,
  category    TEXT NOT NULL,
  summary     TEXT NOT NULL,
  content     TEXT,
  image_url   TEXT,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Reviews (Phase 2 — created now for forward compatibility)
CREATE TABLE IF NOT EXISTS public.reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id   UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id   UUID NOT NULL REFERENCES public.orders(id),
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (order_id, plant_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_plants_category       ON public.plants(category_id);
CREATE INDEX IF NOT EXISTS idx_plants_is_recommended ON public.plants(is_recommended);
CREATE INDEX IF NOT EXISTS idx_plants_slug           ON public.plants(slug);
CREATE INDEX IF NOT EXISTS idx_carts_user            ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user           ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_midtrans       ON public.orders(midtrans_order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order     ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_plant     ON public.order_items(plant_id);
CREATE INDEX IF NOT EXISTS idx_activities_slug       ON public.activities(slug);
CREATE INDEX IF NOT EXISTS idx_activities_published   ON public.activities(published);
CREATE INDEX IF NOT EXISTS idx_reviews_plant         ON public.reviews(plant_id);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;

-- Users: own row read/update
CREATE POLICY "users_select_own"  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_self" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
-- Admin can read all users
CREATE POLICY "users_admin_select" ON public.users FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'Admin'));

-- Categories: public read, admin write
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_insert" ON public.categories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "categories_admin_update" ON public.categories FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "categories_admin_delete" ON public.categories FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));

-- Plants: public read, admin write
CREATE POLICY "plants_public_read" ON public.plants FOR SELECT USING (true);
CREATE POLICY "plants_admin_insert" ON public.plants FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "plants_admin_update" ON public.plants FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "plants_admin_delete" ON public.plants FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));

-- Carts: user sees/manages only their own
CREATE POLICY "carts_own_select" ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "carts_own_insert" ON public.carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "carts_own_update" ON public.carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "carts_own_delete" ON public.carts FOR DELETE USING (auth.uid() = user_id);

-- Orders: user sees own, admin sees all
CREATE POLICY "orders_own_select" ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );
CREATE POLICY "orders_own_insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_update" ON public.orders FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
  );

-- Order Items: follows order access
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
    AND (o.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'))
  ));
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()
  ));

-- Activities: public read (published), admin full access
CREATE POLICY "activities_public_read" ON public.activities FOR SELECT USING (published = true);
CREATE POLICY "activities_admin_read_all" ON public.activities FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "activities_admin_insert" ON public.activities FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "activities_admin_update" ON public.activities FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));
CREATE POLICY "activities_admin_delete" ON public.activities FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'));

-- Reviews: public read, user inserts own
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Database Functions (RPC) ────────────────────────────────────────────────

-- Atomic stock adjustment with overflow protection
CREATE OR REPLACE FUNCTION adjust_plant_stock(p_plant_id UUID, p_delta INTEGER)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_stock INTEGER;
BEGIN
  UPDATE public.plants
  SET stock = stock + p_delta, updated_at = now()
  WHERE id = p_plant_id AND stock + p_delta >= 0
  RETURNING stock INTO v_new_stock;

  IF v_new_stock IS NULL THEN
    RAISE EXCEPTION 'Insufficient stock or plant not found';
  END IF;

  RETURN json_build_object('new_stock', v_new_stock);
END;
$$;

-- Create order + order items atomically
CREATE OR REPLACE FUNCTION create_order_with_items(
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

-- Decrement stock for multiple plants after payment (atomic)
CREATE OR REPLACE FUNCTION decrement_stock_for_order(p_items JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_rows INTEGER;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE public.plants
    SET
      stock = stock - (v_item->>'quantity')::INTEGER,
      sold_count = sold_count + (v_item->>'quantity')::INTEGER,
      updated_at = now()
    WHERE id = (v_item->>'plant_id')::UUID
      AND stock >= (v_item->>'quantity')::INTEGER;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows = 0 THEN
      RAISE EXCEPTION 'Insufficient stock for plant %', v_item->>'plant_id';
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$;

-- ─── Trigger: Auto-create user profile on auth.users insert ──────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'User'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger (safe for re-runs)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Trigger: Auto-update updated_at ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_plants_updated_at ON public.plants;
CREATE TRIGGER trg_plants_updated_at
  BEFORE UPDATE ON public.plants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_activities_updated_at ON public.activities;
CREATE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Seed: Default Categories ────────────────────────────────────────────────

INSERT INTO public.categories (name, slug, icon_name) VALUES
  ('Tanaman Hias',   'tanaman-hias',   'flower'),
  ('Tanaman Buah',   'tanaman-buah',   'apple'),
  ('Tanaman Obat',   'tanaman-obat',   'leaf'),
  ('Kaktus & Sukulen','kaktus-sukulen','cactus'),
  ('Tanaman Indoor', 'tanaman-indoor', 'home'),
  ('Tanaman Outdoor','tanaman-outdoor','sun'),
  ('Bibit & Benih',  'bibit-benih',    'seedling')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Done! Run this SQL in the Supabase SQL Editor.
-- ============================================================================
