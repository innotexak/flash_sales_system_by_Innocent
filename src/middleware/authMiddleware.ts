import { Request, Response, NextFunction } from "express";
import { IAccount } from "../models/account.js";
import GeneralController from "../helpers/generalService.js";

export interface CustomRequest extends Request {
  user?: IAccount; // You can specify the type more explicitly for user
}

const STATUS_CODE = 403; // Can be defined at the top for easier maintenance
const ERROR_MESSAGE = {
  success: false,
  message: "Invalid authorization",
};

const TOKEN_MISSING_MESSAGE = {
  success: false,
  message: "Authorization token missing",
};

const TOKEN_EXPIRED_MESSAGE = {
  success: false,
  message: "Token has expired",
};

export const authMiddleware = async (
  request: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract the Authorization header and validate it
  const authorization: string | null =
    request?.headers?.authorization?.startsWith("Bearer ")
      ? request.headers.authorization.substring(7)
      : null;

  if (!authorization) {
    // Token missing
    res.status(STATUS_CODE).json(TOKEN_MISSING_MESSAGE);
    return; // End the request here
  }

  try {
    // Extract user from the token
    const userFound: IAccount | null = await new GeneralController().extractUserDetails(authorization);

    if (!userFound) {
      // Token invalid or user not found
      res.status(STATUS_CODE).json(ERROR_MESSAGE);
      return; // End the request here
    }

    // Attach the user object to the request for use in the next middleware
    request.user = userFound;

    // Proceed to the next middleware or route handler
    return next();
  } catch (e: any) {
    // Handle errors like token expiration
    if (e.name === "TokenExpiredError") {
      res.status(STATUS_CODE).json(TOKEN_EXPIRED_MESSAGE);
      return; // End the request here
    }

    // Other errors
    res.status(STATUS_CODE).json(ERROR_MESSAGE);
  }
};
