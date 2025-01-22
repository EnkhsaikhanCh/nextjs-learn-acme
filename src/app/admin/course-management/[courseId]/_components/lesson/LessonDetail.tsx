import { Badge } from "@/components/ui/badge";

interface LessonDetailProps {
  title?: string;
  content?: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export function LessonDetail({
  title,
  content,
  videoUrl,
  isPublished,
}: LessonDetailProps) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-gray-700">{content}</p>
      <Badge
        className={`${
          isPublished
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }`}
      >
        {isPublished ? "Published" : "Unpublished"}
      </Badge>

      {videoUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Video</h3>
          <iframe
            src={videoUrl}
            className="mt-2 aspect-video w-full"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
