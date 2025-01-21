interface LessonDetailProps {
  title?: string;
  content?: string;
  videoUrl?: string;
}

export function LessonDetail({ title, content, videoUrl }: LessonDetailProps) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-gray-700">{content}</p>

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
