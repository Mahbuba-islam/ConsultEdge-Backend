import { catchAsync } from "../../shared/catchAsync";
import { paymentService } from "./payment.service";

const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  const result = await paymentService.handleStripeWebhookEvent(req.body, sig);

  res.status(200).json({ received: true, result });
});

export const paymentController = {
  handleStripeWebhookEvent,
};