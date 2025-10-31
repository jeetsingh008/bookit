"use client";

import { useState, useEffect } from "react";

/**
 * A custom hook to debounce a value.
 * @param value The value to debounce
 * .param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set debouncedValue to value (the "fresh" value) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called ...
      // ... if value changes (within the delay period)
      // This is how we prevent the state update
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
