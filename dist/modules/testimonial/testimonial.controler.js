import status from "http-status";
import { testimonialService } from "./testimonial.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
// ------------------------------
// CREATE TESTIMONIAL
// ------------------------------
const createTestimonial = catchAsync(async (req, res) => {
    console.log("USER:", req.user);
    console.log("PAYLOAD:", req.body);
    const user = req.user;
    const payload = req.body;
    const testimonial = await testimonialService.createTestimonial(user.userId, payload);
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
const getAllTestimonials = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await testimonialService.getAllTestimonials(query);
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
const getAllTestimonialsForAdmin = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await testimonialService.getAllTestimonials(query, true);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "All testimonials retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
// ------------------------------
// GET TESTIMONIALS BY EXPERT
// ------------------------------
const getTestimonialsByExpert = catchAsync(async (req, res) => {
    const { expertId } = req.params;
    const normalizedExpertId = Array.isArray(expertId) ? expertId[0] : expertId;
    const testimonials = await testimonialService.getTestimonialsByExpert(normalizedExpertId);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Expert testimonials retrieved successfully",
        data: testimonials,
    });
});
// ------------------------------
// UPDATE TESTIMONIAL
// ------------------------------
const updateTestimonial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const clientId = req.user.userId;
    const payload = req.body;
    const updated = await testimonialService.updateTestimonial(id, clientId, payload);
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
const replyToTestimonial = catchAsync(async (req, res) => {
    const { id } = req.params;
    const expertUserId = req.user.userId;
    const result = await testimonialService.replyToTestimonial(id, expertUserId, req.body);
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
const updateReviewStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await testimonialService.updateReviewStatus(id, req.body);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Review status updated successfully",
        data: result,
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
    updateReviewStatus
};
//# sourceMappingURL=testimonial.controler.js.map