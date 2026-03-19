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
  const user = req.user as IRequestUser // after fixing IRequestUser
  const payload = req.body;

  const testimonial = await testimonialService.createTestimonial(
    user.userId,
    payload
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Testimonial created successfully",
    data: testimonial,
  });
});

// ------------------------------
// GET ALL TESTIMONIALS
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
  getTestimonialsByExpert,
  updateTestimonial,
  deleteTestimonial,
};