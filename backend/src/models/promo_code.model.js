import { Schema, model } from "mongoose";

export const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // Each code must be unique
      trim: true,
      uppercase: true, // Store codes consistently
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null, // null means it never expires
    },
  },
  { timestamps: true }
);

export const PromoCode = model("PromoCode", promoCodeSchema);
