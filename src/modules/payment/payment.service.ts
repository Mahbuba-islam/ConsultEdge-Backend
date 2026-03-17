import Stripe from "stripe";

import { PaymentStatus, ConsultationStatus } from "../../generated/enums";

import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

const handleStripeWebhookEvent = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new AppError(400, `Webhook signature verification failed: ${err.message}`);
  }

  // Prevent duplicate processing
  const existing = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existing) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const consultationId = session.metadata?.consultationId;
      const paymentId = session.metadata?.paymentId;

      if (!consultationId || !paymentId) {
        console.error("Missing metadata");
        return;
      }

      await prisma.$transaction(async (tx) => {
        await tx.consultation.update({
          where: { id: consultationId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: ConsultationStatus.CONFIRMED,
          },
        });

        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.PAID,
            stripeEventId: event.id,
            paymentGatewayData: session as any,
          },
        });
      });

      break;
    }
  }

  return { success: true };
};

export const paymentService = {
  handleStripeWebhookEvent,
};