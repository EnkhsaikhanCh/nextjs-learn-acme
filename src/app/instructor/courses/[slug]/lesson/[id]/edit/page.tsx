"use client";

import { useEffect, useState } from "react";
import {
  useCreateMuxUploadUrlMutation,
  useGetLessonV2ByIdQuery,
  useUpdateLessonV2Mutation,
} from "@/generated/graphql";
import { useParams } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeft, Loader, PlusCircle } from "lucide-react";
import { LessonType } from "@/generated/graphql";
import { toast } from "sonner";
import { LessonHeader } from "../components/lesson-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";

export default function Page() {
  const { slug, id } = useParams();

  const { data, loading, error, refetch } = useGetLessonV2ByIdQuery({
    variables: { id: id as string },
  });
  const [createUpload] = useCreateMuxUploadUrlMutation();
  const [updateLessonV2] = useUpdateLessonV2Mutation();

  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const lesson = data?.getLessonV2ById;

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
  }, [lesson]);

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
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 space-y-6 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
            <Link href={`/instructor/courses/${slug}?tab=content`}>
              <Button size={"sm"}>
                <ArrowLeft /> Back to Course
              </Button>
            </Link>

            <h1 className="mt-6 text-2xl font-bold"></h1>

            <LessonHeader
              title={lesson?.title}
              type={lesson?.type}
              status={lesson?.type}
              onUpdate={(update) => {
                // Handle lesson update logic here
                console.log("Update lesson:", update);
              }}
            />

            {lesson?.type === LessonType.Video && "muxPlaybackId" in lesson && (
              <div className="mt-4 space-y-4">
                {lesson.muxPlaybackId ? (
                  token ? (
                    <>
                      {lesson.muxPlaybackId && (
                        <div className="flex flex-1 items-center justify-end">
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

                              toast.success(
                                "Lesson updated with upload metadata",
                              );
                            }}
                          ></MuxUploader>

                          <div className="w-full bg-sky-200">
                            <MuxUploaderStatus muxUploader="my-uploader"></MuxUploaderStatus>

                            <MuxUploaderProgress
                              type="bar"
                              muxUploader="my-uploader"
                              className="w-full [--progress-bar-fill-color:#047857]"
                            ></MuxUploaderProgress>
                          </div>

                          <MuxUploaderFileSelect muxUploader="my-uploader">
                            <Button size="sm" className="h-7 gap-1">
                              <PlusCircle className="h-3.5 w-3.5" />
                              <span className="sm:whitespace-nowrap">
                                Change
                              </span>
                            </Button>
                          </MuxUploaderFileSelect>
                        </div>
                      )}
                      <MuxPlayer
                        playbackId={lesson.muxPlaybackId}
                        tokens={{ playback: token }}
                        style={{ aspectRatio: "16/9" }}
                        autoPlay={false}
                        accentColor="#ac39f2"
                        className="aspect-[16/9] overflow-hidden rounded-md"
                      />
                    </>
                  ) : tokenLoading ? (
                    <div className="text-muted-foreground text-sm">
                      Fetching secure video token…
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">
                      Failed to load video token.
                    </div>
                  )
                ) : (
                  <div className="bg-muted flex aspect-video min-h-48 grow items-center justify-center rounded-md">
                    <MuxUploaderDrop
                      overlay
                      overlayText="Drop to upload"
                      muxUploader="my-uploader"
                      className="h-full w-full rounded-md border border-dashed border-emerald-700 [--overlay-background-color:#047857]"
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

                          toast.success("Lesson updated with upload metadata");
                        }}
                      ></MuxUploader>
                      <h1 slot="heading">Drop a video file here to upload</h1>
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
                        <Button size="sm" className="h-7 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sm:whitespace-nowrap">
                            Select a file
                          </span>
                        </Button>
                      </MuxUploaderFileSelect>
                    </MuxUploaderDrop>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
