// Import both the default component AND the named skeleton
import ExperienceList, {
  ExperienceListSkeleton,
} from "@/components/features/experiences/ExperienceList";
import { Suspense } from "react";

function Home() {
  return (
    // 1. Added `container` class to main to align with header
    // 2. Removed the extra <div>
    <main className="container py-8">
      <Suspense
        // 3. Use the *imported* component, not the attached property
        fallback={<ExperienceListSkeleton />}
      >
        <ExperienceList />
      </Suspense>
    </main>
  );
}
export default Home;
