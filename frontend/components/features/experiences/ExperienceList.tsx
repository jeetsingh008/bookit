"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExperienceType } from "@/types/Experience";
// import { Loader2 } from "lucide-react";

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  // 1. Fetch all experiences on component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/experiences`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperiences(data.data || []);
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
        setExperiences([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []); // Empty dependency array: runs once on mount

  // 2. Get the search term from the URL
  const searchTerm = searchParams.get("search") || "";

  // 3. Filter experiences based on the search term (memoized)
  const filteredExperiences = useMemo(() => {
    if (!searchTerm) {
      return experiences; // Return all if no search
    }
    return experiences.filter((exp) =>
      exp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [experiences, searchTerm]); // Re-runs only when experiences or search term change

  // --- Render ---

  if (isLoading) {
    return <ExperienceListSkeleton />;
  }

  if (filteredExperiences.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No experiences found.</h2>
        <p className="text-gray-500">
          Try adjusting your search or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredExperiences.map((exp: ExperienceType) => (
        <ExperienceCard key={exp._id} experience={exp} />
      ))}
    </div>
  );
}

// --- Card Component (moved in here for simplicity) ---
function ExperienceCard({ experience }: { experience: ExperienceType }) {
  const [imgSrc, setImgSrc] = useState(
    experience.images[0] || "https://placehold.co/600x400"
  );

  const priceInRupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(experience.price / 100);

  return (
    <Link
      href={`/experiences/${experience._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group"
    >
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={experience.name}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc("https://placehold.co/600x400")}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold truncate group-hover:text-primary">
            {experience.name}
          </h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            {experience.location}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {experience.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-primary">
            {priceInRupees}
          </span>
          <button className="py-2 px-4 bg-primary text-black font-semibold rounded-md shadow-sm text-sm group-hover:bg-primary-dark">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

// --- Skeleton Loading Component ---
// This is shown while the data is being fetched, thanks to <Suspense>
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
    </div>
  </div>
);

// This is how we attach the Skeleton to the main component
// So we can import it as `ExperienceList.Skeleton`
// CHANGED: This is now a NAMED EXPORT
export function ExperienceListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
