import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { BasicInformationCard } from "./InstructorCourseSettingsComponents/BasicInformationCard";
import {
  Difficulty,
  useGetCourseBasicInfoForEditQuery,
} from "@/generated/graphql";
import { useParams } from "next/navigation";

export const CourseSettings = () => {
  const { slug } = useParams();

  const { data, loading, refetch } = useGetCourseBasicInfoForEditQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  if (!slug || loading) {
    return (
      <p className="text-muted-foreground text-sm">Loading basic info...</p>
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

      {/* Basic Information Card */}
      <BasicInformationCard
        initialValues={{
          _id: data?.getCourseBasicInfoForEdit?._id ?? "",
          title: data?.getCourseBasicInfoForEdit?.title ?? "",
          subtitle: data?.getCourseBasicInfoForEdit?.subtitle ?? "",
          description: data?.getCourseBasicInfoForEdit?.description ?? "",
          category: data?.getCourseBasicInfoForEdit?.category ?? "",
          difficulty: data?.getCourseBasicInfoForEdit?.difficulty as Difficulty,
        }}
        refetch={refetch}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Course Thumbnail Card */}
        <Card className="border-amber-100">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50">
            <CardTitle className="text-amber-800">Course Thumbnail</CardTitle>
            <CardDescription>
              Visual representation of your course
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 transition-all hover:bg-gray-50">
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <div className="mb-2 rounded-full bg-amber-100 p-3">
                    <HelpCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Course thumbnail preview
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-gray-500">
                    A compelling thumbnail can increase enrollment by up to 40%
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Upload Image
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Choose from Gallery
                  </Button>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>• Recommended size: 1280x720 pixels (16:9 ratio)</p>
                  <p>• Maximum file size: 10MB</p>
                  <p>• Supported formats: JPG, PNG</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="border-purple-100">
          <CardHeader className="border-b border-purple-100 bg-purple-50/50">
            <CardTitle className="text-purple-800">Pricing</CardTitle>
            <CardDescription>Set your course pricing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price-type" className="text-base font-medium">
                  Pricing Type
                </Label>
                <Select defaultValue="paid">
                  <SelectTrigger id="price-type">
                    <SelectValue placeholder="Select pricing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="subscription">
                      Subscription Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="course-price"
                    className="text-base font-medium"
                  >
                    Regular Price
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Consider market rates for similar courses when setting
                          your price
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="course-price"
                    type="number"
                    defaultValue="49.99"
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="sale-price" />
                <div>
                  <Label htmlFor="sale-price" className="font-medium">
                    Enable promotional price
                  </Label>
                  <p className="text-xs text-gray-500">
                    Offer a limited-time discount
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
