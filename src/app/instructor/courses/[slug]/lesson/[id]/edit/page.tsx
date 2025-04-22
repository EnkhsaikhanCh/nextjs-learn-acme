"use client";

import { useEffect, useState } from "react";
import {
  useCreateMuxUploadUrlMutation,
  useGetLessonV2ByIdQuery,
  useUpdateLessonV2Mutation,
} from "@/generated/graphql";
import { useParams } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeft, Loader, Lock, LockOpen, Upload } from "lucide-react";
import { LessonType } from "@/generated/graphql";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getLessonTypeColor, getLessonTypeIcon } from "@/utils/lesson";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const { slug, id } = useParams();

  const { data, loading, error, refetch } = useGetLessonV2ByIdQuery({
    variables: { id: id as string },
  });
  const [createUpload] = useCreateMuxUploadUrlMutation();
  const [updateLessonV2] = useUpdateLessonV2Mutation();

  const lesson = data?.getLessonV2ById;

  // Local state for toggles
  const [isPublished, setIsPublished] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isupdating, setIsUpdating] = useState<boolean>(false);

  // Secure token state
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      if (
        lesson?.type === LessonType.Video &&
        "muxPlaybackId" in lesson &&
        lesson.muxPlaybackId
      ) {
        try {
          setTokenLoading(true);
          const res = await fetch("/api/mux/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playbackId: lesson.muxPlaybackId }),
          });

          if (!res.ok) {
            throw new Error("Failed to fetch token");
          }

          const json = await res.json();
          setToken(json.token);
          refetch();
        } catch {
          toast.error(
            "Failed to fetch secure video token. Please try again later.",
          );
        } finally {
          setTokenLoading(false);
        }
      }
    };

    fetchToken();
    refetch();
  }, [lesson, refetch]);

  useEffect(() => {
    if (lesson) {
      setIsFree(lesson.isFree ?? false);
      setIsPublished(lesson.isPublished ?? false);
    }
  }, [lesson]);

  const handleUpdateLesson = async () => {
    try {
      setIsUpdating(true);
      const data = await updateLessonV2({
        variables: {
          id: lesson?._id as string,
          input: {
            title: lesson?.title,
            isPublished,
            isFree,
          },
        },
      });
      if (data.errors) {
        throw new Error("Failed to update lesson");
      }
      await refetch();
      toast.success("Lesson updated successfully");
    } catch {
      toast.error("Failed to update lesson");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading lesson…</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <p>Failed to load lesson.</p>
        <ArrowLeft className="h-4 w-4" />
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="flex overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href={`/instructor/courses/${slug}?tab=content`}>
              <Button variant={"outline"} size={"sm"}>
                <ArrowLeft /> Back to Course
              </Button>
            </Link>

            <h1 className="mt-6 text-2xl font-bold"></h1>

            <div className="space-y-6">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">{lesson?.title}</h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1.5",
                        getLessonTypeColor(lesson?.type),
                      )}
                    >
                      {getLessonTypeIcon(lesson?.type)}
                      {lesson?.type}
                    </Badge>

                    {lesson?.isPublished ? (
                      <Badge
                        variant={"outline"}
                        className="border border-green-400 bg-green-200 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
                      >
                        PUBLISHED
                      </Badge>
                    ) : (
                      <Badge
                        variant={"outline"}
                        className="border border-gray-400 bg-gray-200 text-gray-700 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200"
                      >
                        DRAFT
                      </Badge>
                    )}

                    {lesson?.isFree ? (
                      <Badge
                        variant={"outline"}
                        className="gap-1.5 border-orange-400 bg-orange-200 text-orange-900 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400"
                      >
                        <LockOpen className="h-3 w-3 text-orange-700" /> FREE
                      </Badge>
                    ) : (
                      <Badge
                        variant={"outline"}
                        className="gap-1.5 border-green-400 bg-green-200 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
                      >
                        <Lock className="h-3 w-3 text-green-700" />
                        Enrolled students only
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Visibility & Access</CardTitle>
                    <CardDescription>
                      Control who can see and access your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div className="bg-accent flex items-center justify-between rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="access"
                            checked={isFree}
                            onCheckedChange={setIsFree}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                          />
                          <div>
                            <Label htmlFor="access" className="font-medium">
                              Free Preview
                            </Label>
                            <p className="text-xs text-gray-500">
                              Allow non-enrolled users to preview selected
                              lessons
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-accent flex items-center justify-between rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="publish"
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                          />
                          <div>
                            <Label htmlFor="publish" className="font-medium">
                              Publish
                            </Label>
                            <p className="text-xs text-gray-500">
                              Publish this lesson to make it available to
                              students.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t px-6 py-4">
                    <Button onClick={handleUpdateLesson} disabled={isupdating}>
                      {isupdating && (
                        <Loader className="h-4 w-4 animate-spin" />
                      )}
                      {isupdating ? "Saving..." : "Save changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Video */}
            {lesson?.type === LessonType.Video && "muxPlaybackId" in lesson && (
              <Card className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <CardHeader>
                    <CardTitle>Lesson video</CardTitle>
                  </CardHeader>

                  {lesson.muxPlaybackId && lesson.status === "ready" && (
                    <CardHeader className="flex flex-1 items-end">
                      <MuxUploader
                        noDrop
                        noProgress
                        noRetry
                        noStatus
                        className="hidden bg-orange-300"
                        id="my-uploader"
                        endpoint={async () => {
                          const { data } = await createUpload();
                          const { uploadId, uploadUrl, passthrough } =
                            data?.createMuxUploadUrl ?? {};

                          if (!uploadUrl || !uploadId || !passthrough) {
                            throw new Error(
                              "Upload URL or passthrough missing",
                            );
                          }

                          localStorage.setItem("uploadId", uploadId);
                          localStorage.setItem("passthrough", passthrough);

                          return uploadUrl;
                        }}
                        onSuccess={async () => {
                          toast.success(
                            "Upload complete! Mux is processing...",
                          );

                          const uploadId = localStorage.getItem("uploadId");
                          const passthrough =
                            localStorage.getItem("passthrough");

                          if (!uploadId || !passthrough) {
                            return toast.error(
                              "Upload ID or passthrough missing",
                            );
                          }

                          await updateLessonV2({
                            variables: {
                              id: lesson._id,
                              input: {
                                muxUploadId: uploadId,
                                passthrough: passthrough,
                              },
                            },
                          });

                          toast.success("Lesson updated with upload metadata");
                        }}
                      ></MuxUploader>

                      <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>

                      <MuxUploaderProgress
                        type="bar"
                        muxUploader="my-uploader"
                        className="w-full [--progress-bar-fill-color:#047857]"
                      ></MuxUploaderProgress>

                      <MuxUploaderFileSelect muxUploader="my-uploader">
                        <Button size="sm" variant={"outline"}>
                          <Upload className="h-3.5 w-3.5" />
                          Change Video
                        </Button>
                      </MuxUploaderFileSelect>
                    </CardHeader>
                  )}
                </div>

                <CardContent>
                  <div
                    className={cn(
                      "bg-muted flex aspect-video min-h-48 grow items-center justify-center rounded-md",
                    )}
                  >
                    {lesson.muxPlaybackId &&
                      lesson.status === "ready" &&
                      (token ? (
                        <MuxPlayer
                          playbackId={lesson.muxPlaybackId}
                          tokens={{ playback: token }}
                          style={{ aspectRatio: "16/9" }}
                          autoPlay={false}
                          accentColor="#ac39f2"
                          className="aspect-[16/9] overflow-hidden rounded-md"
                        />
                      ) : tokenLoading ? (
                        <div className="text-muted-foreground text-sm">
                          <Loader className="animate-spin" />
                        </div>
                      ) : (
                        <div className="text-sm text-red-500">
                          Failed to load video.
                        </div>
                      ))}

                    {lesson.status === "preparing" && (
                      <div className="text-background">
                        <h4 className="text-xl font-semibold">Processing...</h4>
                        <p className="mt-3 text-sm">
                          This might take a few minutes!
                        </p>
                        <p className="text-sm">
                          Make sure to save changes before leaving this page.
                        </p>
                      </div>
                    )}

                    {!lesson.muxPlaybackId && lesson.status !== "preparing" && (
                      <div className="bg-muted flex aspect-video min-h-48 grow items-center justify-center rounded-md">
                        <MuxUploaderDrop
                          overlay
                          overlayText="Drop to upload"
                          muxUploader="my-uploader"
                          className="h-full w-full rounded-md border-2 border-dashed [--overlay-background-color:#047857]"
                        >
                          <MuxUploader
                            noDrop
                            noProgress
                            noRetry
                            noStatus
                            id="my-uploader"
                            className="hidden"
                            endpoint={async () => {
                              const { data } = await createUpload();
                              const { uploadId, uploadUrl, passthrough } =
                                data?.createMuxUploadUrl ?? {};

                              if (!uploadUrl || !uploadId || !passthrough) {
                                throw new Error(
                                  "Upload URL or passthrough missing",
                                );
                              }

                              localStorage.setItem("uploadId", uploadId);
                              localStorage.setItem("passthrough", passthrough);

                              return uploadUrl;
                            }}
                            onSuccess={async () => {
                              toast.success(
                                "Upload complete! Mux is processing...",
                              );

                              const uploadId = localStorage.getItem("uploadId");
                              const passthrough =
                                localStorage.getItem("passthrough");

                              if (!uploadId || !passthrough) {
                                return toast.error(
                                  "Upload ID or passthrough missing",
                                );
                              }

                              await updateLessonV2({
                                variables: {
                                  id: lesson._id,
                                  input: {
                                    muxUploadId: uploadId,
                                    passthrough: passthrough,
                                  },
                                },
                              });

                              toast.success(
                                "Lesson updated with upload metadata",
                              );
                            }}
                          ></MuxUploader>
                          <h1 slot="heading">
                            Drop a video file here to upload
                          </h1>
                          <span
                            slot="separator"
                            className="text-muted-foreground mt-2 text-sm italic"
                          >
                            — or —
                          </span>
                          <div>
                            <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>
                          </div>
                          <MuxUploaderFileSelect
                            muxUploader="my-uploader"
                            className="mt-4"
                          >
                            <Button variant={"outline"}>
                              <Upload />
                              <span className="sm:whitespace-nowrap">
                                Select a file
                              </span>
                            </Button>
                          </MuxUploaderFileSelect>
                        </MuxUploaderDrop>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
