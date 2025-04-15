import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Course, useGetCourseBasicInfoForEditQuery } from "@/generated/graphql";
import { useParams } from "next/navigation";
import { BasicInformationCard } from "./InstructorCourseSettingsComponents/BasicInformationCard";
import { CoursePricingCard } from "./InstructorCourseSettingsComponents/CoursePricingCard";
import { CourseThumbnailCard } from "./InstructorCourseSettingsComponents/CourseThumbnailCard";

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

      {/* Visibility & Access Card */}
      <Card className="border-blue-100">
        <CardHeader className="border-b border-blue-100 bg-blue-50/50">
          <CardTitle className="text-blue-800">Visibility & Access</CardTitle>
          <CardDescription>
            Control who can see and access your course
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="visibility-status"
                className="text-base font-medium"
              >
                Publication Status
              </Label>
              <Select defaultValue="published">
                <SelectTrigger id="visibility-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Private)</SelectItem>
                  <SelectItem value="published">Published (Public)</SelectItem>
                  <SelectItem value="scheduled">Scheduled Release</SelectItem>
                  <SelectItem value="private">
                    Private (Invitation Only)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Draft courses are only visible to you and co-instructors
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-expiry" className="text-base font-medium">
                Student Access Period
              </Label>
              <Select defaultValue="lifetime">
                <SelectTrigger id="course-expiry">
                  <SelectValue placeholder="Select access period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lifetime">Lifetime Access</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                How long students can access your course after enrollment
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                <Switch id="feature-course" defaultChecked />
                <div>
                  <Label htmlFor="feature-course" className="font-medium">
                    Feature on Profile
                  </Label>
                  <p className="text-xs text-gray-500">
                    Highlight this course on your instructor profile
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                <Switch id="allow-previews" defaultChecked />
                <div>
                  <Label htmlFor="allow-previews" className="font-medium">
                    Free Preview Content
                  </Label>
                  <p className="text-xs text-gray-500">
                    Allow non-enrolled users to preview selected lessons
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                <Switch id="course-certificate" defaultChecked />
                <div>
                  <Label htmlFor="course-certificate" className="font-medium">
                    Completion Certificate
                  </Label>
                  <p className="text-xs text-gray-500">
                    Issue certificates to students who complete the course
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                <Switch id="course-drip" />
                <div>
                  <Label htmlFor="course-drip" className="font-medium">
                    Content Dripping
                  </Label>
                  <p className="text-xs text-gray-500">
                    Release content gradually on a schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-gray-50/50 px-6 py-4">
          <Button>Save All Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
