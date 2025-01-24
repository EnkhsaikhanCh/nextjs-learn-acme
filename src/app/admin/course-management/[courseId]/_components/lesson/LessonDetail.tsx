import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateLessonMutation } from "@/generated/graphql";
import { CircleX, FilePenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LessonDetailProps {
  lessonId: string;
  title?: string;
  content?: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export function LessonDetail({
  lessonId,
  title,
  content,
  videoUrl,
  isPublished,
}: LessonDetailProps) {
  const [updateLesson, { loading }] = useUpdateLessonMutation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title || "");
  const [editedContent, setEditedContent] = useState<string>(content || "");
  const [editedVideoUrl, setEditedVideoUrl] = useState<string>(videoUrl || "");
  const [editedIsPublished, setEditedIsPublished] = useState<boolean>(
    isPublished || false,
  );

  const getEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
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
            content: editedContent,
            videoUrl: editedVideoUrl,
            isPublished: editedIsPublished,
          },
        },
      });

      setIsEditing(false);
      if (updatedLesson.data) {
        toast.success("Lesson updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lesson");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            className={`${
              isPublished
                ? "bg-green-200 text-green-800 hover:bg-green-300"
                : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
            }`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </Badge>
        </CardContent>
      </Card>

      {videoUrl && (
        <div className="">
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="mt-2 aspect-video w-full rounded-lg"
            allowFullScreen
          />
        </div>
      )}

      {isEditing ? (
        <div className="mt-4">
          <Label className="block font-semibold">Title</Label>
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mt-2"
          />

          <Label className="mt-4 block font-medium text-gray-700">
            Video URL
          </Label>
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

          <div className="mt-4 flex gap-2">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => setIsEditing(false)}
            >
              Cancel
              <CircleX className="ml-2" />
            </Button>
            <Button size={"sm"} onClick={handleSave} disabled={loading}>
              Save
              {loading && <span className="loader ml-2" />}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => setIsEditing(true)}
          >
            Edit Lesson
            <FilePenLine className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
