-- ============================================================================
-- BotaniMart — Supabase Database Migration
-- Version: 004_add_product_discounts
-- Date: 2026-06-11
-- ============================================================================

-- Add discount_price column to plants table
-- Constrain: discount_price must be positive and strictly less than price
ALTER TABLE public.plants
ADD COLUMN discount_price INTEGER CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price < price));
