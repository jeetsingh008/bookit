import { Schema, model, Types } from "mongoose";

export const slotSchema = new Schema(
  {
    experience: {
      type: Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
      default: 10,
    },
    bookedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Slot = model("Slot", slotSchema);
