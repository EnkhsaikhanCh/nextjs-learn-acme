"use client";

// import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseOverview } from "./CourseOverview";
import { CourseSettings } from "./CourseSettings";
// import { CourseContent } from "@/components/course-content";
// import { CourseStudents } from "@/components/course-students";
// import { CourseAnalytics } from "@/components/course-analytics";
// import { DashboardHeader } from "@/components/dashboard-header";
// import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function InstructorDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab") ?? "overview";
  const [tab, setTab] = useState(tabParam);

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", value);
    router.replace(`${pathname}?${newParams.toString()}`);
    setTab(value);
  };

  return (
    <div className="flex overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {/* <TabsTrigger value="content">Content</TabsTrigger> */}
                {/* <TabsTrigger value="students">Students</TabsTrigger> */}
                {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <CourseOverview />
              </TabsContent>
              {/* <TabsContent value="content" className="space-y-6">
                <CourseContent />
              </TabsContent> */}
              {/* <TabsContent value="students" className="space-y-6">
                <CourseStudents />
              </TabsContent> */}
              {/* <TabsContent value="analytics" className="space-y-6">
                <CourseAnalytics />
              </TabsContent> */}
              <TabsContent value="settings" className="space-y-6">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
