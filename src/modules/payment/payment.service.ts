/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";

import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  // Prevent duplicate processing
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return { message: `Event ${event.id} already processed. Skipping.` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;

      const consultationId = session.metadata?.consultationId;
      const paymentId = session.metadata?.paymentId;

      if (!consultationId || !paymentId) {
        console.error("Missing metadata in Stripe session");
        return { message: "Missing metadata" };
      }

      // Fetch consultation
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: { payment: true },
      });

      if (!consultation) {
        console.error(`Consultation ${consultationId} not found`);
        return { message: "Consultation not found" };
      }

      // Update consultation + payment atomically
      const result = await prisma.$transaction(async (tx) => {
        const updatedConsultation = await tx.consultation.update({
          where: { id: consultationId },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            stripeEventId: event.id,
          },
        });

        return { updatedConsultation, updatedPayment };
      });

      console.log(
        `Payment ${session.payment_status} for consultation ${consultationId}`
      );
      return result;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired.`);
      break;
    }

    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed.`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook event ${event.id} processed successfully` };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};