"use client";

import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce"; // From Canvas
import { useEffect, useState } from "react";

const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // This is the state for the <input> field
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  // This is the debounced value of the input
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  // --- EFFECT 1: SYNC URL TO INPUT STATE ---
  // This runs when searchParams changes (e.g., user hits "Back" button)
  // It ensures the input field always shows what's in the URL.
  useEffect(() => {
    const handleSearchParamsChange = () => {
      setSearchTerm(searchParams.get("search") || "");
    };

    handleSearchParamsChange();

    // Clean up the effect when it's no longer needed
    return () => {
      // Clean up any resources here
    };
  }, [searchParams]);

  // --- EFFECT 2: SYNC INPUT STATE TO URL ---
  // This runs when the user stops typing (debounced)
  useEffect(() => {
    // Check if the URL already matches the debounced term.
    // This prevents an unnecessary URL update on page load.
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearchTerm === currentSearch) {
      return; // No change needed
    }

    // If they are different, update the URL
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    // Update the URL. This will trigger Effect 1,
    // but the state update will be idempotent (setSearchTerm("k") -> setSearchTerm("k"))
    replace(`${pathname}?${params.toString()}`);

  }, [debouncedSearchTerm, pathname, replace, searchParams]); // We add searchParams back

  // This handles the form submission (e.g., pressing Enter)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the URL update immediately, bypassing the debounce
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto flex justify-between items-center py-3">
      <Image src="/logo.png" alt="logo" width={90} height={90} />
      <form onSubmit={handleSearchSubmit} className="flex gap-1 items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchbar px-2 py-1 placeholder:text-[#727272] placeholder:text-sm w-36 sm:w-44 md:w-64 lg:w-72"
          placeholder="Search experiences"
        />
        <button
          type="submit"
          className="p-2 rounded-sm block md:hidden bg-yellow-400"
        >
          <RiSearchLine />
        </button>
        <button type="submit" className="btn-primary hidden md:block">
          Search
        </button>
      </form>
    </div>
  );
};

export default Header;
