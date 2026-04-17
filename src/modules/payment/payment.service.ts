/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import status from "http-status";

import { prisma } from "../../lib/prisma";
import { ConsultationStatus, PaymentStatus, Role } from "../../generated/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { stripe } from "../../config/stripe.config";

type IConfirmConsultationPaymentPayload = {
  consultationId: string;
  paymentId: string;
  transactionId: string;
  sessionId?: string;
};

const findPaidCheckoutSessionByMetadata = async (
  payload: IConfirmConsultationPaymentPayload
) => {
  // Fallback lookup when session_id is not available in the success redirect.
  let startingAfter: string | undefined;

  for (let page = 0; page < 5; page += 1) {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    const match = sessions.data.find((session) => {
      return (
        session.payment_status === "paid" &&
        session.status === "complete" &&
        session.metadata?.consultationId === payload.consultationId &&
        session.metadata?.paymentId === payload.paymentId &&
        session.metadata?.transactionId === payload.transactionId
      );
    });

    if (match) {
      return match;
    }

    if (!sessions.has_more || sessions.data.length === 0) {
      break;
    }

    startingAfter = sessions.data[sessions.data.length - 1]?.id;
  }

  return null;
};

const confirmConsultationPaymentSuccess = async (
  payload: IConfirmConsultationPaymentPayload,
  user: IRequestUser
) => {
  if (!payload.consultationId || !payload.paymentId || !payload.transactionId) {
    throw new AppError(status.BAD_REQUEST, "consultationId, paymentId and transactionId are required");
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id: payload.consultationId },
    include: {
      payment: true,
      client: {
        select: {
          userId: true,
          fullName: true,
        },
      },
      expert: {
        select: {
          userId: true,
          fullName: true,
        },
      },
    },
  });

  if (!consultation || !consultation.payment) {
    throw new AppError(status.NOT_FOUND, "Consultation payment not found");
  }

  if (user.role !== Role.ADMIN && consultation.client.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You are not allowed to sync this payment");
  }

  if (
    consultation.payment.id !== payload.paymentId ||
    consultation.payment.transactionId !== payload.transactionId
  ) {
    throw new AppError(status.BAD_REQUEST, "Provided payment identifiers do not match consultation records");
  }

  if (
    consultation.payment.status === PaymentStatus.PAID &&
    consultation.paymentStatus === PaymentStatus.PAID
  ) {
    return {
      consultationId: consultation.id,
      paymentId: consultation.payment.id,
      synced: true,
      alreadyPaid: true,
    };
  }

  let paidSession: Stripe.Checkout.Session | null = null;

  if (payload.sessionId) {
    const session = await stripe.checkout.sessions.retrieve(payload.sessionId);

    const metadataMatches =
      session.metadata?.consultationId === payload.consultationId &&
      session.metadata?.paymentId === payload.paymentId &&
      session.metadata?.transactionId === payload.transactionId;

    if (session.payment_status === "paid" && metadataMatches) {
      paidSession = session;
    }
  }

  if (!paidSession) {
    paidSession = await findPaidCheckoutSessionByMetadata(payload);
  }

  if (!paidSession) {
    throw new AppError(
      status.BAD_REQUEST,
      "Stripe has not confirmed this payment yet. Please retry shortly."
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedConsultation = await tx.consultation.update({
      where: { id: consultation.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status:
          consultation.status !== ConsultationStatus.CANCELLED &&
          consultation.status !== ConsultationStatus.COMPLETED &&
          consultation.status !== ConsultationStatus.ONGOING
            ? ConsultationStatus.CONFIRMED
            : consultation.status,
      },
    });

    const updatedPayment = await tx.payment.update({
      where: { id: consultation.payment!.id },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: paidSession,
      },
    });

    await tx.notification.createMany({
      data: [
        {
          type: "CONSULTATION_CONFIRMED",
          message: `Your payment for the consultation with ${consultation.expert?.fullName ?? "your expert"} was successful. The session is now confirmed.`,
          userId: consultation.client.userId,
        },
        {
          type: "CONSULTATION_CONFIRMED",
          message: `${consultation.client.fullName} completed payment. Your consultation is now confirmed.`,
          userId: consultation.expert?.userId ?? "",
        },
      ].filter((item) => Boolean(item.userId)),
    });

    return { updatedConsultation, updatedPayment };
  });

  return {
    consultationId: updated.updatedConsultation.id,
    paymentId: updated.updatedPayment.id,
    synced: true,
    alreadyPaid: false,
  };
};

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
        include: {
          payment: true,
          client: {
            select: {
              userId: true,
              fullName: true,
            },
          },
          expert: {
            select: {
              userId: true,
              fullName: true,
            },
          },
        },
      });

      if (!consultation) {
        console.error(`Consultation ${consultationId} not found`);
        return { message: "Consultation not found" };
      }

      if (
        consultation.payment?.status === PaymentStatus.PAID &&
        consultation.paymentStatus === PaymentStatus.PAID
      ) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            paymentGatewayData: session,
            stripeEventId: event.id,
          },
        });

        return {
          message: `Consultation ${consultationId} is already paid. Stripe event recorded.`,
        };
      }

      // Update consultation + payment atomically
      const result = await prisma.$transaction(async (tx) => {
        const isPaid = session.payment_status === "paid";

        const updatedConsultation = await tx.consultation.update({
          where: { id: consultationId },
          data: {
            paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            status:
              isPaid &&
              consultation.status !== ConsultationStatus.CANCELLED &&
              consultation.status !== ConsultationStatus.COMPLETED &&
              consultation.status !== ConsultationStatus.ONGOING
                ? ConsultationStatus.CONFIRMED
                : consultation.status,
          },
        });

        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            stripeEventId: event.id,
          },
        });

        if (isPaid) {
          await tx.notification.createMany({
            data: [
              {
                type: "CONSULTATION_CONFIRMED",
                message: `Your payment for the consultation with ${consultation.expert?.fullName ?? "your expert"} was successful. The session is now confirmed.`,
                userId: consultation.client.userId,
              },
              {
                type: "CONSULTATION_CONFIRMED",
                message: `${consultation.client.fullName} completed payment. Your consultation is now confirmed.`,
                userId: consultation.expert?.userId ?? "",
              },
            ].filter((item) => Boolean(item.userId)),
          });
        }

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
  confirmConsultationPaymentSuccess,
};