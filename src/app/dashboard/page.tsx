"use client";

import { DiscoverCoursesSection } from "@/components/dashboard/home/DiscoverCoursesSection";
import { MyCoursesSection } from "@/components/dashboard/home/MyCoursesSection";
import { MyCourseSummary } from "@/components/dashboard/home/MyCourseSummary";
import { WelcomeSection } from "@/components/dashboard/home/WelcomeSection";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user._id;

  return (
    <main className="p-5 lg:p-8">
      <WelcomeSection />

      {/* Dashboard Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MyCourseSummary userId={userId} />
        </div>
      </section>

      <MyCoursesSection userId={userId} />
      <DiscoverCoursesSection userId={userId} />
    </main>
  );
}
