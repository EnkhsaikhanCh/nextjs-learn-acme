import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Course, useGetCourseBasicInfoForEditQuery } from "@/generated/graphql";
import { useParams } from "next/navigation";
import { BasicInformationCard } from "./InstructorCourseSettingsComponents/BasicInformationCard";
import { CoursePricingCard } from "./InstructorCourseSettingsComponents/CoursePricingCard";
import { CourseThumbnailCard } from "./InstructorCourseSettingsComponents/CourseThumbnailCard";
import { VisibilityAndAcessCard } from "./InstructorCourseSettingsComponents/VisibilityAndAccessCard";

export const CourseSettings = () => {
  const { slug } = useParams();

  const { data, loading, refetch } = useGetCourseBasicInfoForEditQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  if (!slug || loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course settings...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your course details and preferences
          </p>
        </div>
        <Button>Save All Changes</Button>
      </div>

      <BasicInformationCard
        initialValues={data?.getCourseBasicInfoForEdit as Course}
        refetch={refetch}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <CourseThumbnailCard
          course={data?.getCourseBasicInfoForEdit as Course}
          refetch={refetch}
        />

        <CoursePricingCard
          initialValues={data?.getCourseBasicInfoForEdit as Course}
          refetch={refetch}
        />
      </div>

      <VisibilityAndAcessCard />
    </div>
  );
};
