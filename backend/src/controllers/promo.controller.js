import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as promoService from "../service/promo.service.js";

export const validatePromoCode = asyncHandler(async (req, res) => {
  const { code, currentPrice } = req.body;

  if (!code) {
    throw new ApiError(400, "Promo code is required");
  }
  if (currentPrice === undefined || typeof currentPrice !== "number") {
    throw new ApiError(400, "Current price is required and must be a number");
  }

  const validationResult = await promoService.validateCode(code, currentPrice);

  return res
    .status(200)
    .json(new ApiResponse(200, validationResult, "Promo code validated"));
});
