import { prisma } from "../../lib/prisma";

const createReview = async (studentId: string, data: any) => {
  const { bookingId, rating, comment } = data;

  // 1. Validate booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");

  // ⭐ Allow review only if session is completed OR past
  if (booking.status !== "COMPLETED") {
    throw new Error("Session not completed");
  }

  // 2. Prevent duplicate review
  const existing = await prisma.review.findFirst({
    where: { bookingId },
  });

  if (existing) throw new Error("Review already submitted");

  // ⭐ 3. Mark booking as completed (IMPORTANT)
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  // 4. Create review
  const review = await prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId: booking.id,
      rating,
      comment,
    },
  });

  // 5. Update tutor rating + totalReviews
  const stats = await prisma.review.aggregate({
    where: { tutorId: booking.tutorId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      rating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
      //  isFeatured: (stats._avg.rating || 0) > 4, 

    },
  });

  return review;
};

export const reviewService = {
  createReview,
};