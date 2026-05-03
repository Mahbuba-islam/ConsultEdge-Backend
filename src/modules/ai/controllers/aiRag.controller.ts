import type { Request, Response } from "express";

import { catchAsync } from "../../../shared/catchAsync";
import { sendAIResponse } from "../utils/response";
import { aiRagService } from "../services/aiRag.service";

const query = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Parameters<typeof aiRagService.query>[0];
  const result = await aiRagService.query(payload);
  sendAIResponse(res, result.data, result.meta);
});

export const aiRagController = {
  query,
};
