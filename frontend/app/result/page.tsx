"use client";

// This component must be wrapped in <Suspense>
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// We use lucide-react for the nice checkmark and X icons
// Run: npm install lucide-react
import { CheckCircle, XCircle } from "lucide-react";

/**
 * This is the inner component that uses the search params.
 * We do this so we can wrap it in a <Suspense> boundary.
 */
function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  // We'll get the Booking ID on success
  const bookingId = searchParams.get("bookingId");

  // --- SUCCESS STATE (Matches your screenshot) ---
  if (status === "success") {
    return (
      <div className="flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-semibold mb-2">Booking Confirmed</h1>
        {bookingId && (
          <p className="text-gray-500 text-lg mb-8">Ref ID: {bookingId}</p>
        )}
        <Link
          href="/"
          className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // --- ERROR STATE ---
  return (
    <div className="flex flex-col items-center">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-semibold mb-2">Booking Failed</h1>
      <p className="text-gray-600 mb-4 max-w-md">
        Unfortunately, we could not process your booking. Please try again.
      </p>
      {message && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md mb-8 w-full max-w-md">
          <strong>Error:</strong> {message}
        </p>
      )}
      <Link
        href="/"
        className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

/**
 * This is the main page component.
 * It provides a <Suspense> boundary, which is required
 * when using `useSearchParams` in the App Router.
 */
export default function ResultPage() {
  return (
    <main className="container grow flex items-center justify-center py-20 text-center">
      <Suspense
        fallback={<p className="text-lg animate-pulse">Loading result...</p>}
      >
        <ResultContent />
      </Suspense>
    </main>
  );
}
