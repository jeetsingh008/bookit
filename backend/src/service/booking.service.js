import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Slot } from "../models/slot.model.js";
import { Experience } from "../models/experience.model.js";
import { PromoCode } from "../models/promo_code.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createNewBooking = async (bookingData) => {
  const { slotId, fullName, userEmail, promoCode } = bookingData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const slot = await Slot.findById(slotId).session(session);

    if (!slot) {
      throw new ApiError(404, "Slot not found");
    }

    if (slot.bookedCount >= slot.totalCapacity || slot.isSoldOut) {
      throw new ApiError(409, "Sorry, this slot is now sold out"); // 409 Conflict
    }

    const experience = await Experience.findById(slot.experience)
      .select("price")
      .session(session);

    if (!experience) {
      throw new ApiError(404, "Associated experience not found");
    }

    let originalPrice = experience.price;
    let finalPrice = originalPrice;
    let validPromo = null;

    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
        $or: [{ expiryDate: null }, { expiryDate: { $gt: new Date() } }],
      }).session(session);

      if (promo) {
        validPromo = promo.code;
        let discountAmount = 0;
        if (promo.discountType === "percentage") {
          discountAmount = Math.round(
            originalPrice * (promo.discountValue / 100)
          );
        } else {
          discountAmount = promo.discountValue;
        }
        finalPrice = Math.max(0, originalPrice - discountAmount);
      }
    }

    slot.bookedCount += 1;
    if (slot.bookedCount === slot.totalCapacity) {
      slot.isSoldOut = true;
    }
    await slot.save({ session });

    const [newBooking] = await Booking.create(
      [
        {
          experience: slot.experience,
          slot: slotId,
          fullName,
          userEmail,
          promoCode: validPromo,
          originalPrice,
          finalPrice,
          status: "confirmed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return newBooking;
  } catch (error) {
    await session.abortTransaction();
    
    console.error(" ORIGINAL BOOKING ERROR:", error);
    

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Booking failed due to a server error", error);
  } finally {
    session.endSession();
  }
};
