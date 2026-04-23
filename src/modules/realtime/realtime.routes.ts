import { Router, type Request, type Response } from "express";

import { Role } from "../../generated/enums";
import { checkAuth } from "../../middleware/cheackAuth";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import status from "http-status";
import {
  createAblyTokenRequest,
  roomChannel,
  userChannel,
} from "../../lib/ably";

const router = Router();

router.get(
  "/token",
  checkAuth(Role.CLIENT, Role.EXPERT, Role.ADMIN),
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    // Allow user to subscribe to their own channel and any room channel.
    const capability = {
      [userChannel(userId)]: ["subscribe", "presence"],
      [`${roomChannel("*")}`.replace("*", "*")]: ["subscribe", "publish", "presence"],
    } as Record<string, string[]>;

    const tokenRequest = await createAblyTokenRequest(userId, capability);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Ably token issued",
      data: tokenRequest,
    });
  })
);

export const realtimeRoutes = router;
