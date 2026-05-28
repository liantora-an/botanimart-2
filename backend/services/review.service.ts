import {
  getReviewsByPlantId,
  createReview,
  checkUserReviewEligibility,
  updatePlantRatingStats,
} from '@/backend/repositories/review.repository';
import type { Review } from '@/backend/types';

/**
 * review.service.ts
 * Business logic layer for plant reviews and ratings.
 */

export interface ReviewResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Fetches reviews and checks if the current user is eligible to write a review.
 */
export async function getPlantReviewsAndEligibility(
  plantId: string,
  userId?: string
): Promise<{
  reviews: Review[];
  isEligible: boolean;
  eligibleOrderId: string | null;
}> {
  const reviews = await getReviewsByPlantId(plantId);

  let isEligible = false;
  let eligibleOrderId: string | null = null;

  if (userId) {
    eligibleOrderId = await checkUserReviewEligibility(userId, plantId);
    isEligible = eligibleOrderId !== null;
  }

  return {
    reviews,
    isEligible,
    eligibleOrderId,
  };
}

/**
 * Validates and submits a new review from a user.
 */
export async function submitReview(params: {
  plantId: string;
  userId: string;
  rating: number;
  comment: string | null;
}): Promise<ReviewResult> {
  const { plantId, userId, rating, comment } = params;

  // Validation
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: 'Rating harus berupa angka antara 1 dan 5.' };
  }

  if (comment && comment.trim().length > 1000) {
    return { success: false, error: 'Komentar ulasan maksimal 1000 karakter.' };
  }

  // Check eligibility and fetch eligible order ID
  const eligibleOrderId = await checkUserReviewEligibility(userId, plantId);
  if (!eligibleOrderId) {
    return {
      success: false,
      error: 'Anda hanya dapat memberikan ulasan untuk produk yang sudah Anda beli dan selesaikan transaksinya.',
    };
  }

  // Create review
  const review = await createReview({
    plantId,
    userId,
    orderId: eligibleOrderId,
    rating,
    comment: comment ? comment.trim() : null,
  });

  if (!review) {
    return { success: false, error: 'Gagal mengirimkan ulasan. Silakan coba lagi.' };
  }

  // Recalculate and update the plant average rating and count atomically
  await updatePlantRatingStats(plantId);

  return { success: true, data: review };
}
