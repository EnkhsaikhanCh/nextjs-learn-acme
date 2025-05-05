import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { InstructorUserV2 } from "@/generated/graphql";

interface CourseInstructorProps {
  courseInstructor: InstructorUserV2;
}

export function CourseInstructor({ courseInstructor }: CourseInstructorProps) {
  const profilePictureUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${courseInstructor.profilePicture?.publicId}.${courseInstructor.profilePicture?.format}`;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Instructor</h2>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profilePictureUrl}
              alt="Instructor Profile Picture"
              className="block"
            />
            <AvatarFallback>
              {courseInstructor.fullName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-lg font-medium">{courseInstructor.fullName}</h3>
          </div>
        </div>

        <div className="mt-4">
          <p>{courseInstructor.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}
