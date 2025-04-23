"use client";

import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
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
import { useCerateLesson } from "../feature/useCreateLesson";
import { useCreateLessonV2 } from "../feature/useCreateLessonV2";
import { useDeleteLessonV2 } from "../feature/useDeleteLessonV2";

interface CourseContentProps {
  mainRefetch: () => void;
}

export const CourseContent = ({ mainRefetch }: CourseContentProps) => {
  const { slug } = useParams();

  const { data, loading, error, refetch } = useGetInstructorCourseContentQuery({
    variables: { slug: slug as string },
    skip: !slug,
    errorPolicy: "all",
  });

  const sections = data?.getInstructorCourseContent?.sectionId ?? [];
  const courseId = data?.getInstructorCourseContent?._id;

  const { deleting, handleDelete } = useCourseSections({ refetch });
  const { updating, handleUpdate } = useUpdateCourseSection({ refetch });
  const { lessonCreating, handleLessonCreate } = useCerateLesson({ refetch });
  const { lessonV2Creating, handleLessonV2Create } = useCreateLessonV2({
    refetch,
  });
  const { lessonV2Deleting, handleDeleteLessonV2 } = useDeleteLessonV2({
    refetch,
  });

  if (loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course content...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }

  if (!loading && error && !data?.getInstructorCourseContent) {
    return (
      <div className="text-destructive">
        Error loading course content. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Course Structure
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your course content by modules and lessons
          </p>
        </div>

        <CreateSectionDialog
          courseId={courseId!}
          onCreated={async () => {
            await refetch();
            await mainRefetch();
            toast.success("Section successfully created");
          }}
          trigger={<Button variant="default">New Section</Button>}
        />
      </div>

      <Accordion type="multiple" className="space-y-2">
        {sections.map((section) => (
          <SectionItem
            key={section?._id}
            section={section as Section}
            onDelete={handleDelete}
            deleting={deleting}
            onUpdate={handleUpdate}
            updating={updating}
            onLessonCreate={handleLessonCreate}
            lessonCreating={lessonCreating}
            onLessonV2Create={handleLessonV2Create}
            lessonV2Creating={lessonV2Creating}
            onDeleteLessonV2={handleDeleteLessonV2}
            lessonV2Deleting={lessonV2Deleting}
            mainRefetch={mainRefetch}
          />
        ))}
      </Accordion>

      {sections.length === 0 && (
        <NoSectionYetSection courseId={courseId as string} refetch={refetch} />
      )}
    </div>
  );
};
