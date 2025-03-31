import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Course,
  useGetEnrollmentByUserAndCourseQuery,
  useMarkLessonAsCompletedMutation,
  useUndoLessonCompletionMutation,
} from "@/generated/graphql";
import { ArrowRight, CheckCircle, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export const Enrolled = ({ course }: { course: Course }) => {
  const [selectedLesson, setSelectedLesson] = useState(
    course.sectionId?.[0]?.lessonId?.[0] || null,
  );
  const [isLessonActionLoading, setLessonActionLoading] = useState(false);

  const [markLessonAsCompleted] = useMarkLessonAsCompletedMutation();
  const [undoLessonCompletion] = useUndoLessonCompletionMutation();

  const { data: session } = useSession();
  const userId = session?.user?._id;

  const { data: enrollmentData, refetch: enrollmentRefetch } =
    useGetEnrollmentByUserAndCourseQuery({
      variables: {
        userId: userId || "",
        courseId: course?._id || "",
      },
      skip: !userId || !course?._id,
    });

  const enrollment = enrollmentData?.getEnrollmentByUserAndCourse;
  const completedLessons = enrollment?.completedLessons || [];

  if (!enrollment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Энэ хэрэглэгч энэ курст бүртгэлгүй байна.</p>
      </div>
    );
  }

  const handleMarkLessonAsCompleted = async (lessonId: string) => {
    if (!enrollment?._id || !lessonId) return;
    setLessonActionLoading(true);
    try {
      const response = await markLessonAsCompleted({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
          },
        },
      });
      if (response.data?.markLessonAsCompleted) {
        toast.success("Lesson marked as completed");
        await enrollmentRefetch();
      }
    } catch {
      toast.error("Failed to mark lesson as completed");
    } finally {
      setLessonActionLoading(false);
    }
  };

  const handleUndoLessonCompletion = async (lessonId: string) => {
    if (!enrollment?._id || !lessonId) return;
    setLessonActionLoading(true);
    try {
      const response = await undoLessonCompletion({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
          },
        },
      });
      if (response.data?.undoLessonCompletion) {
        toast.success("Lesson undone");
        await enrollmentRefetch();
      }
    } catch {
      toast.error("Failed to undo lesson completion");
    } finally {
      setLessonActionLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const getNextLesson = () => {
    if (!selectedLesson) return null;
    let foundCurrent = false;
    for (const section of course.sectionId || []) {
      for (const lesson of section?.lessonId || []) {
        if (foundCurrent) {
          return lesson;
        }
        if (lesson?._id === selectedLesson._id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  // Youtube embed болгож хувиргах тусдаа функц
  function getEmbedUrl(url: string) {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`
      : url;
  }

  const nextLesson = getNextLesson();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{course.title}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Course Content - Left Side */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                {course.sectionId?.map((section) => (
                  <Collapsible
                    key={section?._id}
                    className="mx-2 border-b px-4 py-2"
                    defaultOpen={section?.order === 1}
                  >
                    <CollapsibleTrigger className="hover:text-primary flex w-full cursor-pointer items-center justify-between py-2 font-medium">
                      <span>{section?.title}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-1 p-2">
                        {section?.lessonId?.map((lesson) => (
                          <li key={lesson?._id}>
                            <button
                              onClick={() => handleLessonClick(lesson)}
                              className={`group flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                selectedLesson?._id === lesson?._id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="flex-1 truncate">
                                {lesson?.title}
                              </span>
                              {completedLessons.includes(lesson?._id || "") && (
                                <CheckCircle className="text-primary ml-2 h-4 w-4 flex-shrink-0" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Detail - Right Side */}
        <div className="lg:col-span-2">
          {selectedLesson && (
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedLesson.title}</CardTitle>
                  </div>
                  {completedLessons.includes(selectedLesson._id) && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {selectedLesson.videoUrl && (
                  <div className="mb-6">
                    <iframe
                      src={getEmbedUrl(selectedLesson.videoUrl || "")}
                      className="aspect-video w-full rounded-lg"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                )}
                {selectedLesson.content && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                  />
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                <Button
                  variant={
                    completedLessons.includes(selectedLesson._id)
                      ? "outline"
                      : "default"
                  }
                  className="w-full sm:w-auto"
                  onClick={() =>
                    completedLessons.includes(selectedLesson._id)
                      ? handleUndoLessonCompletion(selectedLesson._id)
                      : handleMarkLessonAsCompleted(selectedLesson._id)
                  }
                  disabled={isLessonActionLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {completedLessons.includes(selectedLesson._id)
                    ? "Undo Completion"
                    : "Mark as Complete"}
                </Button>

                {nextLesson && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleLessonClick(nextLesson)}
                  >
                    Next Lesson
                    <ArrowRight />
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
