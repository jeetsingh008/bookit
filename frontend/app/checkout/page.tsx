"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ExperienceType, SlotType } from "@/types/Experience"; // Assuming SlotType is in here too

// --- Helper Types ---
type CheckoutDetails = {
  experience: ExperienceType;
  slot: SlotType;
};

type PriceSummary = {
  subtotal: number;
  taxes: number;
  total: number;
  originalTotal: number;
  discount: number;
  appliedPromo: string | null;
};

// --- Main Component ---
// We wrap this in <Suspense> in layout.tsx or a parent component
// because useSearchParams() requires it.
function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Form State ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // --- Data & Price State ---
  const [details, setDetails] = useState<CheckoutDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<PriceSummary | null>(null);

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // 1. Fetch checkout details on page load
  useEffect(() => {
    const slotId = searchParams.get("slotId");
    const qty = parseInt(searchParams.get("quantity") || "1", 10);
    setQuantity(qty);

    if (!slotId) {
      setError("No slot selected.");
      setIsLoading(false);
      return;
    }

    const mockPrice = 9900; // You'd get this from your fetch
    const sub = mockPrice * qty;
    const tax = 5900;
    setPrice({
      subtotal: sub,
      taxes: tax,
      total: sub + tax,
      originalTotal: sub + tax,
      discount: 0,
      appliedPromo: null,
    });
    setIsLoading(false);
    // --- End Placeholder ---
  }, [searchParams]);

  // 2. Handle Promo Code Validation
  const handleApplyPromo = async () => {
    if (!promoCode || !price) return;

    setPromoMessage("Validating...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promo/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: promoCode,
            currentPrice: price.subtotal, // Validate against subtotal
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid promo code");
      }

      const { finalPrice, discountAmount } = data.data;
      setPrice((prev) => ({
        ...prev!,
        total: finalPrice + prev!.taxes,
        discount: discountAmount,
        appliedPromo: promoCode.toUpperCase(),
      }));

      setPromoMessage(data.data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPromoMessage("Invalid promo code");
      }
      setPrice((prev) => ({
        // Reset price on failure
        ...prev!,
        total: prev!.originalTotal,
        discount: 0,
        appliedPromo: null,
      }));
    }
  };

  // 3. Handle Final Booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !price) return;

    setIsBooking(true);
    setError(null);

    const slotId = searchParams.get("slotId");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slotId,
          fullName: fullName,
          userEmail: email,
          promoCode: price.appliedPromo,
          // The service calculates price on the backend to be secure
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      // Success! Redirect to result page
      router.push(`/result?status=success&bookingId=${data.data._id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        router.push(
          `/result?status=error&message=${encodeURIComponent(err.message)}`
        );
      }
      // Failure! Redirect to result page with error
    } finally {
      setIsBooking(false);
    }
  };

  // --- Form Validation ---
  const isFormValid = fullName && email && agreeTerms && !isBooking;

  if (isLoading) {
    return (
      <main className="container py-12 text-center">
        <p>Loading checkout...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          Go Home
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <Link
        href="/"
        className="text-gray-600 hover:text-black inline-flex items-center mb-6"
      >
        &larr; Checkout
      </Link>

      <form
        onSubmit={handleBooking}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* === Left Column: Form === */}
        <div className="md:col-span-2 bg-[#EFEFEF] rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-2 bg-[#DDDDDD] rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 bg-[#DDDDDD] rounded-md"
              />
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full p-2 bg-[#DDDDDD] rounded-md"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="btn-secondary"
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <p className="text-sm text-gray-600 mb-4">{promoMessage}</p>
          )}

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="h-4 w-4 text-primary rounded accent-black"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        {/* === Right Column: Summary === */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Summary</h2>

            {/* These would be populated by the fetch call */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium">
                  {details?.experience.name || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium">
                  {details
                    ? new Date(details.slot.startTime).toLocaleDateString()
                    : "..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium">
                  {details
                    ? new Date(details.slot.startTime).toLocaleTimeString()
                    : "..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Qty</span>
                <span className="font-medium">{quantity}</span>
              </div>
            </div>

            {/* Price Lines */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  ₹{price ? price.subtotal / 100 : 0}
                </span>
              </div>
              {price && price.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({price.appliedPromo})</span>
                  <span className="font-medium">-₹{price.discount / 100}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">
                  ₹{price ? price.taxes / 100 : 0}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{price ? price.total / 100 : 0}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full text-center py-3 rounded-lg font-semibold mt-4 btn-primary disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isBooking ? "Booking..." : "Pay and Confirm"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

// We must wrap the component in <Suspense>
export default function CheckoutPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="container py-12 text-center">
          <p>Loading checkout...</p>
        </main>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
