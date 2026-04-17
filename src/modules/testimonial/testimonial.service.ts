import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import {
  ICreateTestimonialPayload,
  IReplyToTestimonialPayload,
  IUpdateReviewStatusPayload,
  IUpdateTestimonialPayload,
} from "./testimonial.types";
import {
  testimonialFilterableFields,
  testimonialIncludeConfig,
  testimonialSearchableFields,
} from "./testimonial.constant";
import { ReviewStatus } from "../../generated/enums";


// ------------------------------
// CREATE TESTIMONIAL
// ------------------------------
const createTestimonial = async (
  userId: string,
  payload: ICreateTestimonialPayload
) => {
  const { rating, comment, consultationId } = payload;

  console.log("AUTH USER ID:", userId);
  console.log("PAYLOAD:", payload);

  // ✅ STEP 1: Get client from userId
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  console.log("CLIENT ID:", client.id);

  // ✅ STEP 2: Find consultation
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  });

  console.log("CONSULTATION CLIENT ID:", consultation?.clientId);

  if (!consultation) {
    throw new AppError(status.NOT_FOUND, "Consultation not found");
  }

  // ✅ STEP 3: Correct comparison (FIXED)
  if (consultation.clientId !== client.id) {
    throw new AppError(status.FORBIDDEN, "Not your consultation");
  }

  if (!consultation.expertId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Consultation has no expert assigned"
    );
  }

  const expertId = consultation.expertId;

  // ✅ STEP 4: Transaction
  const testimonial = await prisma.$transaction(async (tx) => {
    const createdTestimonial = await tx.testimonial.create({
      data: {
        rating,
        comment,
        clientId: client.id, // ✅ FIXED
        expertId,
        consultationId,
        status: ReviewStatus.PENDING,
      },
    });

    const expert = await tx.expert.findUnique({
      where: { id: expertId },
      select: { userId: true },
    });

    if (expert) {
      await tx.notification.create({
        data: {
          type: "NEW_TESTIMONIAL",
          message: "You received a new review from a client.",
          userId: expert.userId,
        },
      });
    }

    return createdTestimonial;
  });

  return testimonial;
};




// ------------------------------
// GET ALL TESTIMONIALS
// ------------------------------
const getAllTestimonials = async (
  query: IqueryParams,
  includeAll = false
) => {
  // ✅ Ensure status logic is safe
  const effectiveQuery = { ...query };

  if (!includeAll) {
    effectiveQuery.status = ReviewStatus.APPROVED;
  }

  const qb = new QueryBuilder(prisma.testimonial, effectiveQuery, {
    searchableFields: testimonialSearchableFields,
    filterableFields: testimonialFilterableFields,
  });

  const result = await qb
    .search()
    .filter()
    .paginate()
    .dynamicInclude(testimonialIncludeConfig)
    .sort()
    .fields()
    .excute();

  return result;
};




// ------------------------------
// GET TESTIMONIALS BY EXPERT
// ------------------------------
const getTestimonialsByExpert = async (expertId: string) => {
  // ✅ Optional validation (recommended)
  const expert = await prisma.expert.findUnique({
    where: { id: expertId },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert not found");
  }

  // const result = await prisma.testimonial.findMany({
  //   where: {
  //     expertId,
  //     status: ReviewStatus.APPROVED,
  //   },
  //   include: testimonialIncludeConfig,
  //   orderBy: { createdAt: "desc" },
  // });
const result = await prisma.testimonial.findMany({
  where: {
    expertId,
  },
  include: testimonialIncludeConfig,
});
  return result;
};


// ------------------------------
// EXPERT REPLY TO TESTIMONIAL
// ------------------------------
const replyToTestimonial = async (
  id: string,
  expertUserId: string,
  payload: IReplyToTestimonialPayload
) => {
  const expert = await prisma.expert.findUnique({
    where: { userId: expertUserId },
    select: { id: true, fullName: true },
  });

  if (!expert) {
    throw new AppError(status.NOT_FOUND, "Expert profile not found");
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: {
      client: {
        select: { userId: true },
      },
    },
  });

  if (!testimonial) {
    throw new AppError(status.NOT_FOUND, "Testimonial not found");
  }

  if (testimonial.expertId !== expert.id) {
    throw new AppError(status.FORBIDDEN, "You can only reply to your own reviews");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedTestimonial = await tx.testimonial.update({
      where: { id },
      data: {
        expertReply: payload.expertReply,
        expertRepliedAt: new Date(),
      },
    });

    await tx.notification.create({
      data: {
        type: "REVIEW_REPLY",
        message: `${expert.fullName} replied to your review.`,
        userId: testimonial.client.userId,
      },
    });

    return updatedTestimonial;
  });

  return result;
};

// ------------------------------
// ADMIN UPDATE REVIEW STATUS
// ------------------------------
const updateTestimonial = async (
  id: string,
  userId: string,
  payload: IUpdateTestimonialPayload
) => {
  // ✅ get client
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new AppError(status.NOT_FOUND, "Testimonial not found");
  }

  // ✅ FIXED comparison
  if (testimonial.clientId !== client.id) {
    throw new AppError(status.FORBIDDEN, "Not your testimonial");
  }

  return prisma.testimonial.update({
    where: { id },
    data: {
      ...payload,
      status: ReviewStatus.PENDING,
    },
  });
};



// ------------------------------
// DELETE TESTIMONIAL
// ------------------------------
const deleteTestimonial = async (id: string, userId: string) => {
  // ✅ get client
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    throw new AppError(status.NOT_FOUND, "Client not found");
  }

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new AppError(status.NOT_FOUND, "Testimonial not found");
  }

  // ✅ FIXED comparison
  if (testimonial.clientId !== client.id) {
    throw new AppError(status.FORBIDDEN, "Not your testimonial");
  }

  await prisma.testimonial.delete({ where: { id } });

  return { message: "Testimonial deleted successfully" };
};


export const testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialsByExpert,
  updateTestimonial,
  replyToTestimonial,
  ReviewStatus,
  deleteTestimonial,
};