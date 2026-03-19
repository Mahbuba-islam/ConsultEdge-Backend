import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { ICreateTestimonialPayload, IUpdateTestimonialPayload } from "./testimonial.types";
import { testimonialFilterableFields, testimonialIncludeConfig, testimonialSearchableFields } from "./testimonial.constant";

// ------------------------------
// CREATE TESTIMONIAL
// ------------------------------
const createTestimonial = async (
  clientId: string,
  payload: ICreateTestimonialPayload
) => {
  const { rating, comment, consultationId } = payload;

  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  });

  if (!consultation) {
    throw new AppError(status.NOT_FOUND, "Consultation not found");
  }

  if (consultation.clientId !== clientId) {
    throw new AppError(status.FORBIDDEN, "Not your consultation");
  }

  // ⭐ FIX: ensure expertId is not null
  if (!consultation.expertId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Consultation has no expert assigned"
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      rating,
      comment,
      clientId,
      expertId: consultation.expertId, // now always string
      consultationId,
    },
  });

  return testimonial;
};

// ------------------------------
// GET ALL TESTIMONIALS
// ------------------------------
const getAllTestimonials = async (query: IqueryParams) => {
  const qb = new QueryBuilder(
    prisma.testimonial,
    query,
    {
      searchableFields: testimonialSearchableFields,
      filterableFields: testimonialFilterableFields,
    }
  );

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
  const result = await prisma.testimonial.findMany({
    where: { expertId },
    include: testimonialIncludeConfig,
  });

  return result;
};

// ------------------------------
// UPDATE TESTIMONIAL
// ------------------------------
const updateTestimonial = async (
  id: string,
  clientId: string,
  payload: IUpdateTestimonialPayload
) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    throw new AppError(status.NOT_FOUND, "Testimonial not found");
  }

  if (testimonial.clientId !== clientId) {
    throw new AppError(status.FORBIDDEN, "Not your testimonial");
  }

  return prisma.testimonial.update({
    where: { id },
    data: payload,
  });
};

// ------------------------------
// DELETE TESTIMONIAL
// ------------------------------
const deleteTestimonial = async (id: string, clientId: string) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    throw new AppError(status.NOT_FOUND, "Testimonial not found");
  }

  if (testimonial.clientId !== clientId) {
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
  deleteTestimonial,
};