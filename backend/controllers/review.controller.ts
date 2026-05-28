import {
  getPlantReviewsAndEligibility,
  submitReview,
} from '@/backend/services/review.service';

/**
 * review.controller.ts
 * Handles HTTP requests and responses for plant review endpoints.
 */

export async function handleGetPlantReviews(
  plantId: string,
  currentUserId?: string
): Promise<Response> {
  if (!plantId) {
    return Response.json(
      { success: false, error: 'plantId wajib diisi.' },
      { status: 400 }
    );
  }

  const data = await getPlantReviewsAndEligibility(plantId, currentUserId);
  return Response.json({ success: true, data });
}

export async function handleCreateReview(
  plantId: string,
  userId: string,
  body: any
): Promise<Response> {
  if (!plantId) {
    return Response.json(
      { success: false, error: 'plantId wajib diisi.' },
      { status: 400 }
    );
  }

  const rating = Number(body.rating);
  const comment = body.comment || null;

  if (isNaN(rating)) {
    return Response.json(
      { success: false, error: 'Rating harus berupa angka.' },
      { status: 400 }
    );
  }

  const result = await submitReview({
    plantId,
    userId,
    rating,
    comment,
  });

  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return Response.json(
    { success: true, data: result.data, message: 'Ulasan berhasil disimpan.' },
    { status: 201 }
  );
}
