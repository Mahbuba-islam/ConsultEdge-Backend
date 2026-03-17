import { NextFunction, Request, Response } from "express";
import { reviewService } from "./testimonial.service";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    // 1. Auth check
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const studentId = user.id;

    // 2. Create review
    const review = await reviewService.createReview(studentId, req.body);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
};