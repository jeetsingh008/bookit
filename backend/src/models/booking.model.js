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
    // We use userName to match the service
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
    // --- THIS IS THE FIX ---
    // The service is sending these two fields, not `price`.
    originalPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    // --- END FIX ---
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);
