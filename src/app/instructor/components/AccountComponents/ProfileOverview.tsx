import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InstructorUserV2 } from "@/generated/graphql";
import React from "react";

interface ProfileOverviewProps {
  instructorData: InstructorUserV2;
}

export default function ProfileOverview({
  instructorData,
}: ProfileOverviewProps) {
  return (
    <Card className="w-full md:w-1/3 md:max-w-[420px]">
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>
          Your public instructor profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 rounded-md">
            <AvatarImage
              src={
                instructorData?.profilePicture
                  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${instructorData.profilePicture.publicId}.${instructorData.profilePicture.format}`
                  : undefined
              }
              alt="Instructor Profile Picture"
            />
          </Avatar>
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {instructorData?.fullName}
            </h3>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="text-sm font-medium">{instructorData?.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Bio</Label>
            <p className="text-sm">{instructorData?.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
