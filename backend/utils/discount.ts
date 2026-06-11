export function isDiscountActive(plant: {
  discount_price?: number | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
}): boolean {
  if (plant.discount_price === null || plant.discount_price === undefined) {
    return false;
  }

  const now = new Date();

  // If start date is set, ensure current time is >= start date
  if (plant.discount_start_date) {
    const start = new Date(plant.discount_start_date);
    if (now < start) {
      return false;
    }
  }

  // If end date is set, ensure current time is <= end date
  if (plant.discount_end_date) {
    const end = new Date(plant.discount_end_date);
    if (now > end) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the effective price of a plant, prioritizing the discount price if it is active.
 */
export function getActivePrice(plant: {
  price: number;
  discount_price?: number | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
}): number {
  return isDiscountActive(plant) ? (plant.discount_price as number) : plant.price;
}
