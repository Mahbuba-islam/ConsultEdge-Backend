/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { catchAsync } from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponsr";

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "Missing Stripe signature or webhook secret" });
  }

  let event;

  try {
    // IMPORTANT: req.body must be RAW buffer
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Error verifying Stripe webhook:", error);
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "Invalid Stripe webhook signature" });
  }

  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Stripe webhook processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);

    return sendResponse(res, {
      httpStatusCode: status.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event",
    });
  }
});

export const PaymentController = {
  handleStripeWebhookEvent,
};