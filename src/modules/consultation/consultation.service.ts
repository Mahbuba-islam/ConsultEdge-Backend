import status from "http-status";
import { v7 as uuidv7 } from "uuid";

import { IBookConsultationPayload } from "./consultation.interface";

import { ConsultationStatus, PaymentStatus } from "../../generated/enums";
import { envVars } from "../../config/env";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { stripe } from "../../config/stripe.config";

// BOOK CONSULTATION WITH IMMEDIATE PAYMENT (checkout URL)
const bookConsultation = async (
  payload: IBookConsultationPayload,
  user: IRequestUser
) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email },
  });

  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false,
    },
  });

  const expertSchedule = await prisma.expertSchedule.findUniqueOrThrow({
    where: {
      id: payload.expertScheduleId,
      isDeleted: false,
    },
    include: {
      schedule: true,
    },
  });

  if (expertSchedule.isBooked) {
    throw new AppError(
      status.BAD_REQUEST,
      "This schedule is already booked for another consultation"
    );
  }

  const videoCallId = uuidv7();

  const result = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        clientId: client.id,
        expertId: expert.id,
        expertScheduleId: expertSchedule.id,
        videoCallId,
        date: expertSchedule.schedule.startDateTime, 
        status: ConsultationStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
      include: {
        expert: true,
      },
    });

    await tx.expertSchedule.update({
      where: { id: expertSchedule.id },
      data: {
        isBooked: true,
        consultationId: consultation.id,
      },
    });

    const transactionId = uuidv7();

    const payment = await tx.payment.create({
      data: {
        consultationId: consultation.id,
        amount: expert.consultationFee, // adjust field name
        transactionId,
        status: PaymentStatus.UNPAID,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // or "bdt"
            product_data: {
              name: `Consultation with ${expert.fullName}`,
            },
            unit_amount: expert.consultationFee * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        consultationId: consultation.id,
        paymentId: payment.id,
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations`,
    });

    return {
      consultation,
      payment,
      paymentUrl: session.url,
    };
  });

  return {
    consultation: result.consultation,
    payment: result.payment,
    paymentUrl: result.paymentUrl,
  };
};

// BOOK CONSULTATION WITH PAY LATER
const bookConsultationWithPayLater = async (
  payload: IBookConsultationPayload,
  user: IRequestUser
) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email },
  });

  const expert = await prisma.expert.findUniqueOrThrow({
    where: {
      id: payload.expertId,
      isDeleted: false,
    },
  });

  const expertSchedule = await prisma.expertSchedule.findUniqueOrThrow({
    where: {
      id: payload.expertScheduleId,
      isDeleted: false,
    },
    include: {
      schedule: true,
    },
  });

  if (expertSchedule.isBooked) {
    throw new AppError(
      status.BAD_REQUEST,
      "This schedule is already booked for another consultation"
    );
  }

  const videoCallId = uuidv7();

  const result = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        clientId: client.id,
        expertId: expert.id,
        expertScheduleId: expertSchedule.id,
        videoCallId,
        date: expertSchedule.schedule.startDateTime,
        status: ConsultationStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
      include: {
        expert: true,
      },
    });

    await tx.expertSchedule.update({
      where: { id: expertSchedule.id },
      data: {
        isBooked: true,
        consultationId: consultation.id,
      },
    });

    const transactionId = String(uuidv7());

    const payment = await tx.payment.create({
      data: {
        consultationId: consultation.id,
        amount: expert.consultationFee,
        transactionId,
        status: PaymentStatus.UNPAID,
      },
    });

    return {
      consultation,
      payment,
    };
  });

  return result;
};

// INITIATE PAYMENT FOR EXISTING CONSULTATION
const initiateConsultationPayment = async (
  consultationId: string,
  user: IRequestUser
) => {
  const client = await prisma.client.findUniqueOrThrow({
    where: { email: user.email },
  });

  const consultation = await prisma.consultation.findUniqueOrThrow({
    where: {
      id: consultationId,
      clientId: client.id,
    },
    include: {
      expert: true,
      payment: true,
    },
  });

  if (!consultation.payment) {
    throw new AppError(status.BAD_REQUEST, "Payment not found for this consultation");
  }

  if (consultation.payment.status === PaymentStatus.PAID) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment already completed for this consultation"
    );
  }

  if (consultation.status === ConsultationStatus.CANCELLED) {
    throw new AppError(
      status.BAD_REQUEST,
      "This consultation is canceled. Payment cannot be initiated."
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Consultation with ${consultation.expert?.fullName}`,
          },
          unit_amount: consultation.payment.amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      consultationId: consultation.id,
      paymentId: consultation.payment.id,
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/consultation-success`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/consultations`,
  });

  return {
    paymentUrl: session.url,
  };
};

// CANCEL UNPAID CONSULTATIONS AFTER 30 MINUTES
const cancelUnpaidConsultations = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const unpaidConsultations = await prisma.consultation.findMany({
    where: {
      createdAt: {
        lte: thirtyMinutesAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
      status: ConsultationStatus.PENDING,
    },
    include: {
      expertSchedule: true,
    },
  });

  const consultationIds = unpaidConsultations.map((c) => c.id);

  await prisma.$transaction(async (tx) => {
    if (consultationIds.length) {
      await tx.consultation.updateMany({
        where: {
          id: {
            in: consultationIds,
          },
        },
        data: {
          status: ConsultationStatus.CANCELLED,
        },
      });

      await tx.payment.deleteMany({
        where: {
          consultationId: {
            in: consultationIds,
          },
        },
      });

      for (const consultation of unpaidConsultations) {
        if (consultation.expertScheduleId) {
          await tx.expertSchedule.update({
            where: {
              id: consultation.expertScheduleId,
            },
            data: {
              isBooked: false,
              consultationId: null,
            },
          });
        }
      }
    }
  });
};

export const consultationService = {
  bookConsultation,
  bookConsultationWithPayLater,
  initiateConsultationPayment,
  cancelUnpaidConsultations,
};