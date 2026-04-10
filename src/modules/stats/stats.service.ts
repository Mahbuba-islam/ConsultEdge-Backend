import { prisma } from "../../lib/prisma";
import { Role, PaymentStatus, ConsultationStatus } from "../../generated/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getDashboardStatsData = async (user: IRequestUser) => {
  switch (user.role) {
    case Role.ADMIN:
      return getAdminStats();
    case Role.EXPERT:
      return getExpertStats(user);
    case Role.CLIENT:
      return getClientStats(user);
    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role for dashboard");
  }
};



const getAdminStats = async () => {
  const expertCount = await prisma.expert.count();
  const clientCount = await prisma.client.count();
  const consultationCount = await prisma.consultation.count();
  const industryCount = await prisma.industry.count();
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();

  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const formattedStatus = consultationStatusDistribution.map(({ status, _count }) => ({
    status,
    count: _count.id,
  }));

  const revenueByMonth = await getRevenueByMonth();

  return {
    expertCount,
    clientCount,
    consultationCount,
    industryCount,
    paymentCount,
    userCount,
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    consultationStatusDistribution: formattedStatus,
    revenueByMonth,
  };
};





//expert stats

const getExpertStats = async (user: IRequestUser) => {
  const expert = await prisma.expert.findUniqueOrThrow({
    where: { userId: user.userId },
  });

  const consultationCount = await prisma.consultation.count({
    where: { expertId: expert.id },
  });

  const uniqueClients = await prisma.consultation.groupBy({
    by: ["clientId"],
    where: { expertId: expert.id },
    _count: { id: true },
  });

  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
      consultation: { expertId: expert.id },
    },
  });

  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    where: { expertId: expert.id },
    _count: { id: true },
  });

  const formattedStatus = consultationStatusDistribution.map(({ status, _count }) => ({
    status,
    count: _count.id,
  }));

  const reviewCount = await prisma.testimonial.count({
    where: { expertId: expert.id },
  });

  return {
    consultationCount,
    clientCount: uniqueClients.length,
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    consultationStatusDistribution: formattedStatus,
    reviewCount,
  };
};





//client stats

const getClientStats = async (user: IRequestUser) => {
  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });

  if (!client) {
    return {
      consultationCount: 0,
      consultationStatusDistribution: [],
    };
  }

  const consultationCount = await prisma.consultation.count({
    where: { clientId: client.id },
  });

  const consultationStatusDistribution = await prisma.consultation.groupBy({
    by: ["status"],
    where: { clientId: client.id },
    _count: { id: true },
  });

  const formattedStatus = consultationStatusDistribution.map(({ status, _count }) => ({
    status,
    count: _count.id,
  }));

  return {
    consultationCount,
    consultationStatusDistribution: formattedStatus,
  };
};




//revenue by month for admin dashboard

const getRevenueByMonth = async () => {
  const revenueByMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
           CAST(SUM("amount") AS INTEGER) AS amount
    FROM "payments"
    WHERE "status" = 'PAID'
    GROUP BY month
    ORDER BY month ASC;
  `;

  return revenueByMonth;
};




export const StatsService = {
  getDashboardStatsData,
};
