"use client";

import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateSectionDialog } from "./InstructorCourseContentComponents/CreateSectionDialog";
import { SectionItem } from "./InstructorCourseContentComponents/SectionItem";
import { useCourseSections } from "../feature/useCourseSections";
import {
  Section,
  useGetInstructorCourseContentQuery,
} from "@/generated/graphql";
import { NoSectionYetSection } from "./InstructorCourseContentComponents/NoSectionYetSection";
import { useUpdateCourseSection } from "../feature/useupdateCourseSection";

export const CourseContent = () => {
  const { slug } = useParams();

  const { data, loading, error, refetch } = useGetInstructorCourseContentQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  const sections = data?.getInstructorCourseContent?.sectionId ?? [];
  const courseId = data?.getInstructorCourseContent?._id;

  const { deleting, handleDelete } = useCourseSections({ refetch });
  const { updating, handleUpdate } = useUpdateCourseSection({ refetch });

  if (loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course content...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your course structure and materials
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Organize your course content by modules and lessons
              </CardDescription>
            </div>

            <CreateSectionDialog
              courseId={courseId!}
              onCreated={() => {
                refetch();
                toast.success("Section successfully created");
              }}
              trigger={<Button variant="default">New Section</Button>}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {sections.map((section) => (
              <SectionItem
                key={section?._id}
                section={section as Section}
                onDelete={handleDelete}
                deleting={deleting}
                onUpdate={handleUpdate}
                updating={updating}
              />
            ))}
          </Accordion>

          {sections.length === 0 && (
            <NoSectionYetSection
              courseId={courseId as string}
              refetch={refetch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
