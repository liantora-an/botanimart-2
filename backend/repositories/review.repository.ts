import { createClient } from '@/lib/supabase/server';
import type { Review } from '@/backend/types';

/**
 * review.repository.ts
 * Data access layer for the public.reviews table.
 */

const REVIEW_SELECT = `
  *,
  user:users (id, full_name)
`;

/**
 * Returns all reviews for a specific plant.
 */
export async function getReviewsByPlantId(plantId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('plant_id', plantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[review.repository] getReviewsByPlantId error:', error.message);
    return [];
  }
  return (data ?? []) as Review[];
}

/**
 * Inserts a new review into the database.
 */
export async function createReview(params: {
  plantId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string | null;
}): Promise<Review | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      plant_id: params.plantId,
      user_id: params.userId,
      order_id: params.orderId,
      rating: params.rating,
      comment: params.comment || null,
    })
    .select(REVIEW_SELECT)
    .single();

  if (error) {
    console.error('[review.repository] createReview error:', error.message);
    return null;
  }
  return data as Review;
}

/**
 * Checks if a user is eligible to review a product.
 * Returns the eligible completed order_id if they can, or null.
 */
export async function checkUserReviewEligibility(
  userId: string,
  plantId: string
): Promise<string | null> {
  const supabase = await createClient();

  // Find completed orders for this user
  const { data: completedOrders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      order_items!inner(plant_id)
    `)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .eq('order_items.plant_id', plantId);

  if (ordersError || !completedOrders || completedOrders.length === 0) {
    return null;
  }

  // Find already reviewed orders for this user and product
  const { data: reviewedOrders, error: reviewsError } = await supabase
    .from('reviews')
    .select('order_id')
    .eq('user_id', userId)
    .eq('plant_id', plantId);

  if (reviewsError) return null;

  const reviewedIds = new Set((reviewedOrders ?? []).map(r => r.order_id));

  // Find the first completed order that hasn't been reviewed
  for (const order of completedOrders) {
    if (!reviewedIds.has(order.id)) {
      return order.id;
    }
  }

  return null;
}

/**
 * Automatically recalculates and updates the rating statistics (average and count)
 * of a plant based on all of its existing reviews.
 */
export async function updatePlantRatingStats(plantId: string): Promise<boolean> {
  const supabase = await createClient();

  // Fetch all ratings for this plant
  const { data: reviews, error: fetchError } = await supabase
    .from('reviews')
    .select('rating')
    .eq('plant_id', plantId);

  if (fetchError || !reviews) {
    console.error('[review.repository] updatePlantRatingStats fetch error:', fetchError?.message);
    return false;
  }

  const count = reviews.length;
  const avg = count > 0 
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(2)) 
    : 0.00;

  // Update the plants table
  const { error: updateError } = await supabase
    .from('plants')
    .update({
      rating_avg: avg,
      rating_count: count,
      updated_at: new Date().toISOString()
    })
    .eq('id', plantId);

  if (updateError) {
    console.error('[review.repository] updatePlantRatingStats update error:', updateError.message);
    return false;
  }

  return true;
}
