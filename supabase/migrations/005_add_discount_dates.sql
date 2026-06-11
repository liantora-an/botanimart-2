-- Migration 005: Add discount start and end dates to plants table
-- This migration adds support for timed product-level discounts.

ALTER TABLE public.plants
ADD COLUMN discount_start_date TIMESTAMPTZ,
ADD COLUMN discount_end_date TIMESTAMPTZ;

-- Add a constraint to ensure that the end date is after the start date
ALTER TABLE public.plants
ADD CONSTRAINT check_discount_dates 
CHECK (
  discount_end_date IS NULL OR 
  discount_start_date IS NULL OR 
  discount_end_date > discount_start_date
);
