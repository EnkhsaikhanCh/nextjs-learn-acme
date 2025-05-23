"use client";

import { DiscoverCoursesSection } from "@/components/dashboard/home/DiscoverCoursesSection";
import { MyCoursesSection } from "@/components/dashboard/home/MyCoursesSection";
import { MyCourseSummary } from "@/components/dashboard/home/MyCourseSummary";
import { useUserStore } from "@/store/UserStoreState";
import { Loader } from "lucide-react";

export default function Page() {
  const { user } = useUserStore();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const userId = user?._id;

  return (
    <main className="space-y-3 p-5 lg:p-8">
      {/* Dashboard Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MyCourseSummary userId={userId} />
        </div>
      </section>

      <MyCoursesSection />
      <DiscoverCoursesSection />
    </main>
  );
}
