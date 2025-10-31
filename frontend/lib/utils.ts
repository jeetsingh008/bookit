import { SlotType } from "@/types/Experience";

/**
 * Formats a date into a "Month Day" string key.
 * Example: "Oct 30"
 */
const formatDateKey = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

/**
 * Formats a date into a time string like "7:00 AM"
 */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

/**
 * Type for processed slot with extra computed fields
 */
export type ProcessedSlot = SlotType & {
  formattedTime: string;
  remaining: number;
};

/**
 * Grouped object structure:
 * {
 *   "Oct 30": [ProcessedSlot, ProcessedSlot, ...],
 *   "Oct 31": [ProcessedSlot, ...]
 * }
 */
export type GroupedSlots = Record<string, ProcessedSlot[]>;

/**
 * Groups flat slot data by date and adds formatted fields.
 */
export const groupSlotsByDate = (slots: SlotType[]): GroupedSlots => {
  return slots.reduce((acc, slot) => {
    const dateObj = new Date(slot.startTime);
    const dateKey = formatDateKey(dateObj); // e.g., "Oct 30"

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    const processedSlot: ProcessedSlot = {
      ...slot,
      formattedTime: formatTime(dateObj),
      remaining: slot.totalCapacity - slot.bookedCount,
    };

    acc[dateKey].push(processedSlot);

    return acc;
  }, {} as GroupedSlots);
};
