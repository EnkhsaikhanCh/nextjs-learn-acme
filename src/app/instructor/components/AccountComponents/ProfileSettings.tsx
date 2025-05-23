import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { InstructorProfilePictureUpload } from "./InstructorProfilePictureUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  InstructorUserV2,
  useUpdateInstructorUserV2Mutation,
} from "@/generated/graphql";
import { toast } from "sonner";

interface ProfileSettingsProps {
  instructorData: InstructorUserV2;
  instructorRefetch: () => void;
  userId: string;
}

export default function ProfileSettings({
  instructorData,
  instructorRefetch,
  userId,
}: ProfileSettingsProps) {
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  const [updateInstructorUserV2] = useUpdateInstructorUserV2Mutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<{ fullName: string; bio: string }>({
    defaultValues: { fullName: "", bio: "" },
  });

  const onSubmitProfile = async (vals: { fullName: string; bio: string }) => {
    setIsProfileUpdating(true);

    try {
      await updateInstructorUserV2({
        variables: {
          id: userId,
          input: { fullName: vals.fullName, bio: vals.bio },
        },
      });

      await instructorRefetch();

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile", {
        description: (err as Error).message,
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  useEffect(() => {
    if (instructorData) {
      reset({
        fullName: instructorData.fullName || "",
        bio: instructorData.bio || "",
      });
    }
  }, [instructorData, reset]);

  return (
    <TabsContent value="profile" className="space-y-4 pt-4">
      <InstructorProfilePictureUpload
        userData={instructorData as InstructorUserV2}
        refetch={instructorRefetch}
      />
      <form onSubmit={handleSubmit(onSubmitProfile)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("fullName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled
              defaultValue={instructorData.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} {...register("bio")} />
          </div>
          <Button
            type="submit"
            disabled={isProfileUpdating || isSubmitting || !isDirty}
            className="mt-4"
          >
            {isProfileUpdating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </TabsContent>
  );
}
