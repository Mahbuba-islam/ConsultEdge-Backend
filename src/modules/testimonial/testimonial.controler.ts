import { Request, Response } from "express";
import status from "http-status";

import { IqueryParams } from "../../interfaces/query.interface";
import { testimonialService } from "./testimonial.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { IRequestUser } from "../../interfaces/requestUser.interface";

// ------------------------------
// CREATE TESTIMONIAL
// ------------------------------
const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  console.log("USER:", req.user);
console.log("PAYLOAD:", req.body);
  const user = req.user as IRequestUser;
  const payload = req.body;

  const testimonial = await testimonialService.createTestimonial(
    user.userId,
    payload
  );
  console.log("USER:", req.user);
console.log("PAYLOAD:", req.body);
  console.log("PAYLOAD:", payload);
console.log("USER:", user.userId);
console.log("CONSULTATION:", payload.consultationId);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Testimonial created successfully",
    data: testimonial,
  });
});

// ------------------------------
// GET ALL APPROVED TESTIMONIALS (PUBLIC)
// ------------------------------
const getAllTestimonials = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await testimonialService.getAllTestimonials(
    query as IqueryParams
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Testimonials retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// ------------------------------
// GET ALL TESTIMONIALS FOR ADMIN
// ------------------------------
const getAllTestimonialsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await testimonialService.getAllTestimonials(
      query as IqueryParams,
      true
    );

    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "All testimonials retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// ------------------------------
// GET TESTIMONIALS BY EXPERT
// ------------------------------
const getTestimonialsByExpert = catchAsync(
  async (req: Request, res: Response) => {
    const { expertId } = req.params;

    const normalizedExpertId =
      Array.isArray(expertId) ? expertId[0] : expertId;

    const testimonials = await testimonialService.getTestimonialsByExpert(
      normalizedExpertId
    );

    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Expert testimonials retrieved successfully",
      data: testimonials,
    });
  }
);

// ------------------------------
// UPDATE TESTIMONIAL
// ------------------------------
const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const clientId = req.user.userId;
  const payload = req.body;

  const updated = await testimonialService.updateTestimonial(
    id as string,
    clientId,
    payload
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Testimonial updated successfully",
    data: updated,
  });
});

// ------------------------------
// EXPERT REPLY TO TESTIMONIAL
// ------------------------------
const replyToTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const expertUserId = req.user.userId;

  const result = await testimonialService.replyToTestimonial(
    id as string,
    expertUserId,
    req.body
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Reply added successfully",
    data: result,
  });
});

// ------------------------------
// ADMIN UPDATE REVIEW STATUS
// ------------------------------
const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await testimonialService.updateTestimonial(
    id as string,
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Review status updated successfully",
    data: result,
  });
});

// ------------------------------
// DELETE TESTIMONIAL
// ------------------------------
const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const clientId = req.user.userId;

  await testimonialService.deleteTestimonial(id as string, clientId);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Testimonial deleted successfully",
  });
});

// ------------------------------
// EXPORT CONTROLLER
// ------------------------------
export const TestimonialController = {
  createTestimonial,
  getAllTestimonials,
  getAllTestimonialsForAdmin,
  getTestimonialsByExpert,
  updateTestimonial,
  replyToTestimonial,
  updateReviewStatus,
  deleteTestimonial,
};