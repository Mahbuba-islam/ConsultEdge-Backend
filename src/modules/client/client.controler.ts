import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { clientService } from "./client.service";
import { IqueryParams } from "../../interfaces/query.interface";

const getAllClients = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.getAllClients(req.query as IqueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Clients fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getClientById = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.getClientById(String(req.params.id));

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Client retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.getMyProfile(req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Client profile retrieved successfully",
    data: result,
  });
});

const updateClient = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.updateClient(
    String(req.params.id),
    req.body,
    req.user
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Client updated successfully",
    data: result,
  });
});

const deleteClient = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.deleteClient(String(req.params.id));

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Client deleted successfully",
    data: result,
  });
});

export const clientController = {
  getAllClients,
  getClientById,
  getMyProfile,
  updateClient,
  deleteClient,
};
