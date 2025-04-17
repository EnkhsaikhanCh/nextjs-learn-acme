"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, useUpdateCourseThumbnailMutation } from "@/generated/graphql";
import { HelpCircle, ImageUp, Loader } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CldImage } from "next-cloudinary"; // 👈 нэмнэ

interface CourseThumbnailCardProps {
  course: Course;
  refetch: () => void;
}

export const CourseThumbnailCard = ({
  course,
  refetch,
}: CourseThumbnailCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tempThumbnailPublicId, setTempThumbnailPublicId] = useState<
    string | null
  >(null);
  const [updateCourseThumbnail] = useUpdateCourseThumbnailMutation();

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

      // BEFORE UPLOAD: Check image dimensions
      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const isTooSmall = img.width < 1280 || img.height < 720;

          if (isTooSmall) {
            toast.error("Image must be at least 1280x720 pixels (16:9).");
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

      // Proceed if resolution is valid
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "course_thumbnail_unsigned");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      setTempThumbnailPublicId(data.public_id);

      await updateCourseThumbnail({
        variables: {
          courseId: course._id,
          input: {
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
          },
        },
      });

      await refetch();
      setTempThumbnailPublicId(null);
      toast.success("Thumbnail updated!");
    } catch (error) {
      if (error !== undefined) {
        toast.error("Thumbnail update failed", {
          description: (error as Error).message,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-amber-100 dark:border-yellow-900">
      <CardHeader className="rounded-t-md border-b border-amber-100 bg-amber-50/50 dark:border-yellow-900 dark:bg-yellow-900/30">
        <CardTitle className="text-amber-800 dark:text-yellow-200">
          Course Thumbnail
        </CardTitle>
        <CardDescription className="dark:text-yellow-300">
          Visual representation of your course
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          disabled={isUploading}
        />
        <div className="flex flex-col items-center space-y-4">
          {course.thumbnail?.publicId ? (
            <CldImage
              src={tempThumbnailPublicId || course.thumbnail.publicId}
              width={1280}
              height={720}
              crop="fill"
              alt="Course Thumbnail"
              className={`aspect-video w-full rounded-lg object-cover transition-all duration-300 ${
                isUploading ? "blur-sm brightness-75" : ""
              }`}
              key={tempThumbnailPublicId || course.thumbnail.publicId}
            />
          ) : (
            <div
              onClick={handleUploadClick}
              className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 transition-all hover:bg-gray-50 dark:border-yellow-900 dark:bg-yellow-950/20 dark:hover:bg-yellow-900/30"
            >
              <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                <div className="mb-2 rounded-full bg-amber-100 p-3 dark:bg-yellow-800/30">
                  <HelpCircle className="h-6 w-6 text-amber-600 dark:text-yellow-300" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-yellow-200">
                  Course thumbnail preview
                </p>
                <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-yellow-400">
                  A compelling thumbnail can increase enrollment by up to 40%
                </p>
              </div>
            </div>
          )}

          <div className="flex w-full flex-col space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader className="mr-1 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageUp />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• Minimum recommended size: 1280×720 pixels (16:9 ratio)</p>
              <p>• Maximum file size: 10MB</p>
              <p>• Supported formats: JPG, PNG</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
