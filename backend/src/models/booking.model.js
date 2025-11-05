import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    experience: {
      type: Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    slot: {
      type: Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    promoCode: {
      type: String,
      default: null,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);
