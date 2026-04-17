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

const confirmConsultationPaymentSuccess = catchAsync(
  async (req: Request, res: Response) => {
    const source = req.method === "GET" ? req.query : req.body;

    const consultationId = String(source?.consultationId ?? "").trim();
    const paymentId = String(source?.paymentId ?? "").trim();
    const transactionId = String(source?.transactionId ?? "").trim();
    const sessionId = String(source?.sessionId ?? source?.session_id ?? "").trim();

    const result = await PaymentService.confirmConsultationPaymentSuccess(
      {
        consultationId,
        paymentId,
        transactionId,
        sessionId: sessionId || undefined,
      },
      req.user
    );

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Consultation payment synced successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  handleStripeWebhookEvent,
  confirmConsultationPaymentSuccess,
};