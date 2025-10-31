"use client"; // This component MUST be a client component

import { useState } from "react"; // Removed useMemo and useEffect
import Image from "next/image";
import Link from "next/link";
import {
  GroupedSlots,
  ProcessedSlot,
  // cn utility is no longer used
} from "@/lib/utils";
import { ExperienceType } from "@/types/Experience";
import { Plus, Minus } from "lucide-react";

// Helper type for props
// type ExperienceDetails = ExperienceType & {
//   slots: ProcessedSlot[];
// };

type Props = {
  experience: ExperienceType;
  groupedSlots: GroupedSlots;
};

// --- This component handles all state and interactivity ---
export default function ExperienceDetailsClient({
  experience,
  groupedSlots = {}, // <-- Reverted: Removed default value
}: Props) {
  // --- State for Selection (Only useState is needed) ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ProcessedSlot | null>(null);
  const [quantity, setQuantity] = useState(1);

  // --- Simplified Data Handling (No hooks needed) ---

  // Get the available date keys (e.g., ["Oct 22", "Oct 23"])
  // We can calculate this directly, no useMemo needed
  const availableDates = Object.keys(groupedSlots);

  // Get Slots for the *Currently Selected Date*
  // If selectedDate is null, this will correctly be an empty array
  const slotsForSelectedDate = groupedSlots[selectedDate || ""] || [];

  // --- Price Calculation ---
  const subtotal = (experience.price || 0) * quantity; // <-- Reverted: Removed optional chaining
  const taxes = 5900; // 59 Rupees
  const total = subtotal + taxes;

  // --- Reverted: Removed the Guard Clause ---

  // --- Render Logic (This is the same JSX as before) ---
  return (
    <main className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* === Left Column: Image and Details === */}
        <div className="md:col-span-2">
          {/* Back Button */}
          <Link
            href="/"
            className="text-gray-600 hover:text-black inline-flex items-center mb-4"
          >
            &larr; Details
          </Link>

          {/* Main Image */}
          <div className="relative w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden mb-6 shadow-lg">
            <Image
              // --- Reverted: Removed optional chaining ---
              src={experience.images[0] || "https://placehold.co/800x450"}
              alt={experience.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">{experience.name}</h1>
          <p className="text-gray-600 mb-8">{experience.description}</p>

          {/* --- The Interactive Slot Picker --- */}
          <div className="p-6">
            {/* --- Date Picker --- */}
            <h2 className="text-xl font-semibold mb-4">Choose date</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {availableDates.length > 0 ? (
                availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null); // Reset selected slot
                    }}
                    // Replaced cn() with template literals
                    className={`px-4 py-2 border border-gray-300 rounded-md font-medium ${
                      selectedDate === date
                        ? "bg-primary text-black border-0"
                        : "hover:bg-gray-200 "
                    }`}
                  >
                    {date}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No available dates.</p>
              )}
            </div>

            {/* --- Time Picker --- */}
            <h2 className="text-xl font-semibold mb-4">Choose time</h2>
            <p className="text-sm text-gray-500 mb-4">
              All times are in IST (GMT +5:30)
            </p>
            <div className="flex flex-wrap gap-2">
              {slotsForSelectedDate.length > 0 ? (
                slotsForSelectedDate.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={slot.isSoldOut}
                    // Replaced cn() with template literals
                    className={`px-4 py-3 rounded-md border border-gray-300 text-left transition-colors ${
                      slot.isSoldOut
                        ? " text-gray-400 line-through cursor-not-allowed"
                        : selectedSlot?._id === slot._id
                        ? "bg-primary border-0"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <span className="font-semibold">{slot.formattedTime}</span>
                    <span className="text-xs ml-2 text-red-500 font-semibold">
                      {slot.isSoldOut ? "Sold out" : `${slot.remaining} left`}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">
                  {/* This message will now show on initial load */}
                  Please select a date to see available times.
                </p>
              )}
            </div>
            {/* --- About Section --- */}
            <h2 className="text-xl font-semibold mt-8 mb-4">About</h2>
            <p className="text-[#838383] text-sm bg-[#EEEEEE] p-1 rounded-sm">
              Scenic routes, trained guides, and safety briefing. Minimum age
              10.
            </p>
          </div>
        </div>

        {/* === Right Column: Price Summary === */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">
              Starts at ₹{experience.price / 100}
            </h2>

            {/* Quantity */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Quantity</span>
              <div className="flex items-center gap-2 border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => {
                    // Capping quantity at remaining slots
                    const maxQuantity = selectedSlot?.remaining || 1;
                    setQuantity((q) => Math.min(maxQuantity, q + 1));
                  }}
                  // Disable if no slot is selected or if quantity is at max
                  disabled={
                    !selectedSlot || quantity >= (selectedSlot?.remaining || 1)
                  }
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Price Lines */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal / 100}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">₹{taxes / 100}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{total / 100}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <Link
              href={
                selectedSlot
                  ? `/checkout?slotId=${selectedSlot._id}&quantity=${quantity}`
                  : "#"
              }
              aria-disabled={!selectedSlot}
              tabIndex={!selectedSlot ? -1 : undefined}
              // Replaced cn() with template literals
              className={`w-full text-center py-3 rounded-lg font-semibold mt-4 block ${
                !selectedSlot
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "btn-primary" // Using your global CSS class
              }`}
            >
              Confirm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
