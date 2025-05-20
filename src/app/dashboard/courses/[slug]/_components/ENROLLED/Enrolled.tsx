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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Course,
  LessonType,
  useGetEnrollmentByUserAndCourseQuery,
  useGetLessonV2byIdForStudentLazyQuery,
  useUpdateLessonCompletionStatusMutation,
} from "@/generated/graphql";
import { useUserStore } from "@/store/UserStoreState";
import MuxPlayer from "@mux/mux-player-react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  CircleCheck,
  Loader,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Enrolled = ({ course }: { course: Course }) => {
  const [isLessonActionLoading, setLessonActionLoading] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);

  const { user } = useUserStore();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const userId = user?._id;

  const [updateLessonCompletionStatus] =
    useUpdateLessonCompletionStatusMutation();

  const [
    fetchLessonById,
    { data: selectedLessonData, loading: selectedLessonLoading },
  ] = useGetLessonV2byIdForStudentLazyQuery();
  const selectedLesson = selectedLessonData?.getLessonV2byIdForStudent || null;

  const {
    data: enrollmentData,
    loading: enrollmentLoading,
    refetch: enrollmentRefetch,
  } = useGetEnrollmentByUserAndCourseQuery({
    variables: {
      userId: userId || "",
      courseId: course?._id || "",
    },
    skip: !userId || !course?._id,
  });

  const enrollment = enrollmentData?.getEnrollmentByUserAndCourse;
  const completedLessons = enrollment?.completedLessons || [];

  // Detect Mobile
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const fetchMuxToken = async (muxPlaybackId: string) => {
    try {
      setTokenLoading(true);

      const response = await fetch("/api/mux/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playbackId: muxPlaybackId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const json = await response.json();

      setToken(json.token);
    } catch {
      toast.error(
        "Failed to fetch secure video token. Please try again later.",
      );
    } finally {
      setTokenLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("lesson");

    if (lessonId) {
      fetchLessonById({ variables: { id: lessonId } }).then(({ data }) => {
        const loadedLesson = data?.getLessonV2byIdForStudent;
        if (
          loadedLesson?.type === LessonType.Video &&
          "muxPlaybackId" in loadedLesson &&
          loadedLesson.muxPlaybackId
        ) {
          fetchMuxToken(loadedLesson.muxPlaybackId);
        }
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLessonClick = async (lesson: any) => {
    try {
      setIsVideoLoading(true);

      const { data } = await fetchLessonById({ variables: { id: lesson._id } });
      const loadedLesson = data?.getLessonV2byIdForStudent;

      if (
        loadedLesson?.type === LessonType.Video &&
        "muxPlaybackId" in loadedLesson &&
        loadedLesson.muxPlaybackId
      ) {
        await fetchMuxToken(loadedLesson.muxPlaybackId);
      } else {
        setToken(null); // no video => clear token
      }

      const params = new URLSearchParams(window.location.search);
      params.set("lesson", lesson._id);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState(null, "", newUrl);

      if (isMobile) {
        setIsDrawerOpen(true);
      }
    } catch {
      toast.error("Failed to load lesson.");
    }
  };

  const handleToggleLessonCompletion = async (
    lessonId: string,
    completed: boolean,
  ) => {
    if (!enrollment?._id || !lessonId) {
      return;
    }

    setLessonActionLoading(true);

    try {
      const response = await updateLessonCompletionStatus({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
            completed,
          },
        },
      });

      if (response.data?.updateLessonCompletionStatus?.success) {
        toast.success(
          completed ? "Lesson marked as completed" : "Lesson unmarked",
        );
        await enrollmentRefetch();
      } else {
        toast.error(
          response.data?.updateLessonCompletionStatus?.message || "Failed",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLessonActionLoading(false);
    }
  };

  const getNextLesson = () => {
    if (!selectedLesson) {
      return null;
    }
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

  const nextLesson = getNextLesson();

  if (!enrollmentLoading && !enrollment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Энэ хэрэглэгч энэ курст бүртгэлгүй байна.</p>
      </div>
    );
  }

  const renderLessonDetail = () => {
    if (selectedLessonLoading || tokenLoading) {
      return (
        <Card className="text-muted-foreground flex h-full items-center justify-center gap-2 rounded-sm">
          <p>Loading lesson...</p>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Card>
      );
    }

    if (!selectedLesson) {
      return (
        <Card className="flex h-full flex-col items-center justify-center rounded-sm">
          <p className="text-muted-foreground text-sm">
            Select a lesson to start
          </p>
        </Card>
      );
    }

    return (
      <Card className="flex h-full flex-col rounded-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{selectedLesson.title}</CardTitle>
            </div>
            {completedLessons.includes(selectedLesson._id) && (
              <Badge
                variant="secondary"
                className="ml-2 border border-green-600 bg-green-100 text-green-600 transition-colors dark:border-green-400 dark:bg-green-900 dark:text-green-300"
              >
                <CircleCheck className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {selectedLesson.type === LessonType.Video &&
            "muxPlaybackId" in selectedLesson && (
              <>
                {selectedLesson.muxPlaybackId ? (
                  token ? (
                    <>
                      {isVideoLoading && (
                        <div className="flex aspect-[16/9] items-center justify-center rounded-md bg-gray-100 dark:bg-black">
                          <Loader className="h-6 w-6 animate-spin dark:text-white" />
                        </div>
                      )}
                      <MuxPlayer
                        key={selectedLesson._id + "-" + token}
                        playbackId={selectedLesson.muxPlaybackId as string}
                        tokens={{ playback: token }}
                        style={{
                          aspectRatio: "16/9",
                          display: isVideoLoading ? "none" : "block",
                        }}
                        autoPlay={false}
                        playsInline
                        accentColor="#ac39f2"
                        className="aspect-[16/9] overflow-hidden rounded-md"
                        onCanPlay={() => setIsVideoLoading(false)}
                      />
                    </>
                  ) : tokenLoading ? (
                    <div className="text-muted-foreground text-sm">
                      <Loader className="animate-spin" />
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">
                      Failed to load video.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-yellow-600">
                    Video not available.
                  </div>
                )}
              </>
            )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t py-3 sm:flex-row">
          <Button
            variant={
              completedLessons.includes(selectedLesson._id)
                ? "outline"
                : "default"
            }
            onClick={() =>
              handleToggleLessonCompletion(
                selectedLesson._id,
                !completedLessons.includes(selectedLesson._id),
              )
            }
            disabled={isLessonActionLoading}
            className="flex w-full items-center justify-center sm:w-auto"
          >
            {isLessonActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CircleCheck className="h-4 w-4" />
            )}
            {isLessonActionLoading
              ? "Processing..."
              : completedLessons.includes(selectedLesson._id)
                ? "Undo Completion"
                : "Mark as Complete"}
          </Button>

          {nextLesson && (
            <Button
              variant="outline"
              onClick={() => handleLessonClick(nextLesson)}
              className="w-full sm:w-auto"
            >
              Next Lesson
              <ArrowRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{course.title}</h1>

      {isMobile ? (
        <>
          {/* -- Mobile: Table of Contents -- */}
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
                    <CollapsibleTrigger className="group hover:text-primary flex w-full items-center justify-between py-2 font-medium">
                      <span>{section?.title}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-1 p-2">
                        {section?.lessonId?.map((lesson) => (
                          <li key={lesson?._id}>
                            <button
                              onClick={() => handleLessonClick(lesson)}
                              className={`group flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                selectedLesson?._id === lesson?._id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="flex-1 truncate">
                                {lesson?.title}
                              </span>
                              {completedLessons.includes(
                                lesson?._id ?? null,
                              ) && (
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

          {/* -- Mobile: Drawer with lesson detail -- */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerContent className="dark:bg-card fixed top-0 left-0 w-full bg-white opacity-100 transition-all duration-300">
              <DrawerHeader>
                <DrawerTitle>Selected Lesson</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="outline" className="mt-2">
                    Close <ArrowDown className="ml-1" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              <div className="h-[calc(100vh-200px)] p-4">
                {renderLessonDetail()}
              </div>

              <DrawerFooter>
                <Button variant="link" onClick={() => setIsDrawerOpen(false)}>
                  Back to Contents
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        /* -- Desktop: 2-column grid with contents + detail -- */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="rounded-sm">
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
                      <CollapsibleTrigger className="group hover:text-primary lg:text0ms=f flex w-full items-center justify-between py-2 text-sm font-medium lg:text-base">
                        <span>{section?.title}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="space-y-1 p-2">
                          {section?.lessonId?.map((lesson) => (
                            <li key={lesson?._id}>
                              <button
                                onClick={() => handleLessonClick(lesson)}
                                className={`group flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                  selectedLesson?._id === lesson?._id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <span className="flex-1 truncate">
                                  {lesson?.title}
                                </span>
                                {completedLessons.includes(
                                  lesson?._id ?? null,
                                ) && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-300" />
                                  </div>
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

          <div className="lg:col-span-2">{renderLessonDetail()}</div>
        </div>
      )}
    </div>
  );
};
