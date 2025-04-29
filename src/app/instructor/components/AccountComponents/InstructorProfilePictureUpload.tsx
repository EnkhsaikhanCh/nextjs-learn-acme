import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InstructorUserV2,
  useUpdateInstructorProfilePictureMutation,
} from "@/generated/graphql";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";

interface InstructorProfilePictureUploadProps {
  userData: InstructorUserV2;
  refetch: () => void;
}

export function InstructorProfilePictureUpload({
  userData,
  refetch,
}: InstructorProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePicturePublicId, setProfilePicturePublicId] = useState<
    string | null
  >(null);

  const [updateInstructorProfilePicture] =
    useUpdateInstructorProfilePictureMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large. Max 10MB allowed.");
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPG and PNG images are allowed.");
        return;
      }

      const img = new Image();
      const imageURL = URL.createObjectURL(file);
      img.src = imageURL;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          if (img.width < 256 || img.height < 256) {
            toast.error("Image must be at least 256x256 pixels.");
            reject();
          } else {
            resolve();
          }
        };
        img.onerror = () => {
          toast.error("Could not read image.");
          reject();
        };
      });

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "profile_picture_unsigned");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      setProfilePicturePublicId(data.public_id);

      await updateInstructorProfilePicture({
        variables: {
          id: userData._id,
          input: {
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
          },
        },
      });

      await refetch();
      setProfilePicturePublicId(null);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Thumbnail update failed", {
        description: (error as Error).message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Profile Picture</Label>
      <div className="flex items-center gap-4">
        <Avatar className="rounded-md">
          <AvatarImage
            src={
              profilePicturePublicId
                ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${profilePicturePublicId}.png`
                : userData.profilePicture
                  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${userData.profilePicture.publicId}.${userData.profilePicture.format}`
                  : undefined
            }
            alt="Instructor Profile Picture"
            key={profilePicturePublicId || userData.profilePicture?.publicId}
          />

          {isUploading && (
            <AvatarFallback>
              <Loader className="h-4 w-4 animate-spin" />
            </AvatarFallback>
          )}
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload New"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
