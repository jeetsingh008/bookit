import { PromoCode } from "../models/promo_code.model.js";
import { ApiError } from "../utils/ApiError.js";

export const validateCode = async (code, currentPrice) => {
  
  const uppercaseCode = code.toUpperCase();
  const promo = await PromoCode.findOne({ code: uppercaseCode });

  
  if (!promo) {
    throw new ApiError(404, "Invalid promo code");
  }
  if (!promo.isActive) {
    throw new ApiError(400, "This promo code is no longer active");
  }
  if (promo.expiryDate && promo.expiryDate < new Date()) {
    throw new ApiError(400, "This promo code has expired");
  }

  
  let discountAmount = 0;

  if (promo.discountType === "percentage") {
    discountAmount = currentPrice * (promo.discountValue / 100);
  } else if (promo.discountType === "fixed") {
    discountAmount = promo.discountValue; 
  }

  
  discountAmount = Math.min(currentPrice, discountAmount);

  
  discountAmount = Math.round(discountAmount);

  const finalPrice = currentPrice - discountAmount;

  
  return {
    success: true,
    code: uppercaseCode,
    originalPrice: currentPrice,
    discountAmount,
    finalPrice,
    message: "Promo code applied successfully",
  };
};
