import { Schema, model } from "mongoose";

export const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      uppercase: true, 
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
      default: null, 
    },
  },
  { timestamps: true }
);

export const PromoCode = model("PromoCode", promoCodeSchema);
