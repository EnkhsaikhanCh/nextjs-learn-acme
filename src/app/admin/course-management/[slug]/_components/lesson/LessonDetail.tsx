import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteLessonMutation,
  useUpdateLessonMutation,
} from "@/generated/graphql";
import { CircleCheck, CircleDot, CircleX, FilePenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/app/admin/_components/ConfirmDeleteDialog";

interface LessonDetailProps {
  lessonId: string;
  title?: string;
  content?: string;
  videoUrl?: string;
  isPublished?: boolean;
  refetchCourse: () => void;
}

export function LessonDetail({
  lessonId,
  title,
  videoUrl,
  isPublished,
  refetchCourse,
}: LessonDetailProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title || "");
  const [editedVideoUrl, setEditedVideoUrl] = useState<string>(videoUrl || "");
  const [editedIsPublished, setEditedIsPublished] = useState<boolean>(
    isPublished || false,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  const getEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`
      : url;
  };

  const handleSave = async () => {
    if (!editedTitle) {
      toast.error("Title is required");
      return;
    }

    try {
      const updatedLesson = await updateLesson({
        variables: {
          id: lessonId,
          input: {
            title: editedTitle,
            videoUrl: editedVideoUrl,
            isPublished: editedIsPublished,
          },
        },
      });

      await refetchCourse();
      setIsEditing(false);
      if (updatedLesson.data) {
        toast.success("Lesson updated successfully!");
      }
    } catch {
      toast.error("Failed to update lesson");
    }
  };

  const handleDelete = async () => {
    try {
      const deletedLesson = await deleteLesson({
        variables: {
          id: lessonId,
        },
      });

      await refetchCourse();
      if (deletedLesson.data) {
        toast.success("Lesson deleted successfully!");
      }
    } catch (error) {
      toast.error(`Failed to delete lesson, ${error}`);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={`gap-2 px-2 py-1 ${
                isPublished
                  ? "bg-green-200 text-green-800 hover:bg-green-300"
                  : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
              }`}
            >
              {isPublished ? (
                <CircleCheck className="h-4 w-4 text-green-700" />
              ) : (
                <CircleDot className="h-4 w-4 text-yellow-700" />
              )}
              <span className="font-semibold">
                {isPublished ? "Published" : "Unpublished"}
              </span>
            </Badge>
          </CardContent>
        </Card>

        {videoUrl && (
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="mt-2 aspect-video w-full rounded-lg"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}

        {isEditing && (
          <div className="mt-4">
            <Label className="block font-semibold">Title</Label>
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mt-2"
            />

            <Label className="mt-4 block font-medium">Video URL</Label>
            <Input
              type="text"
              value={editedVideoUrl}
              onChange={(e) => setEditedVideoUrl(e.target.value)}
              className="mt-2"
            />

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                checked={editedIsPublished}
                onChange={(e) => setEditedIsPublished(e.target.checked)}
                className="mr-2"
              />
              <span>Is Published</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isEditing ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation(); // Prevents propagation if part of an accordion
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? (
              <>
                Cancel
                <CircleX className="ml-2" />
              </>
            ) : (
              <>
                Edit Lesson
                <FilePenLine className="ml-2" />
              </>
            )}
          </Button>

          {isEditing && (
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 bg-green-100 font-semibold text-green-500 hover:bg-green-200 hover:text-green-600"
              onClick={handleSave}
            >
              Save
            </Button>
          )}

          <ConfirmDeleteDialog
            buttonLabel="Delete Lesson"
            label="Lesson title"
            name={title || ""}
            onConfirm={handleDelete}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </div>
      </div>
    </>
  );
}
