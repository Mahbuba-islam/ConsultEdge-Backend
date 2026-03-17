/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import cron from "node-cron";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import { envVars } from "./config/env";



import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { indexRoutes } from ".";
import { consultationService } from "./modules/consultation/consultation.service";
import { paymentControler } from "./modules/payment/payment.controler";

const app: Application = express();

/* -------------------------------------------
   View Engine (EJS)
-------------------------------------------- */
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

/* -------------------------------------------
   Stripe Webhook (RAW BODY)
-------------------------------------------- */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentControler.handlerStripeWebhookEvent
);

/* -------------------------------------------
   CORS
-------------------------------------------- */
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------------------------------
   BetterAuth
-------------------------------------------- */
app.use("/api/auth", toNodeHandler(auth));

/* -------------------------------------------
   Body Parsers
-------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------------------------------
   Basic Health Route
-------------------------------------------- */
app.get("/", (req: Request, res: Response) => {
  res.send("ConsultEdge Backend Running Successfully!");
});

/* -------------------------------------------
   Cron Job — Cancel Unpaid Consultations
-------------------------------------------- */
cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job: cancel unpaid consultations");
   //  await consultationService.cancelUnpaidConsultations();
  } catch (error: any) {
    console.error(
      "Error occurred while canceling unpaid consultations:",
      error.message
    );
  }
});

/* -------------------------------------------
   API Routes
-------------------------------------------- */
app.use("/api/v1", indexRoutes);

/* -------------------------------------------
   Global Error Handler + 404
-------------------------------------------- */
app.use(globalErrorHandler);
app.use(notFound);

export default app;