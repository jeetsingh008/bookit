import { groupSlotsByDate, GroupedSlots } from "@/lib/utils";
import { ExperienceType, SlotType } from "@/types/Experience";
import ExperienceDetailsClient from "./ExperienceDetailsClient"; // We will create this

// Helper type for the fetched data
type ExperienceDetails = ExperienceType & {
  slots: SlotType[];
};

// --- This is now a Server Component ---
export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // This is the new Next.js way
}) {
  const { id } = await params;
  let experience: ExperienceDetails | null = null;
  let groupedSlots: GroupedSlots = {};
  let error: string | null = null;

  try {
    // --- 1. Fetch data on the Server ---
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/experiences/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch experience details");
    }

    const apiResponse = await response.json();

    if (!apiResponse.data) {
      throw new Error("Experience not found");
    }

    experience = apiResponse.data;

    // --- 2. Process data on the Server ---
    if (experience?.slots) {
      groupedSlots = groupSlotsByDate(experience.slots);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
  }

  // --- 3. Render the UI (or error state) ---
  if (error) {
    return (
      <div className="container py-12 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container py-12 text-center">Experience not found.</div>
    );
  }

  // --- 4. Pass Server data to the Client Component as props ---
  return (
    <ExperienceDetailsClient
      experience={experience}
      groupedSlots={groupedSlots}
    />
  );
}
