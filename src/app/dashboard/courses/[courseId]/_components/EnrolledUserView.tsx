"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetLessonByIdQuery } from "@/generated/graphql";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

export function EnrolledUserView({ courseData }: { courseData: any }) {
  const [selectedLesson, setSelectedLesson] = useState<{
    _id?: string;
    title?: string;
    isPublished?: boolean;
  } | null>(null);

  const { data, loading, error } = useGetLessonByIdQuery({
    variables: {
      getLessonByIdId: selectedLesson?._id || "",
    },
    skip: !selectedLesson?._id,
  });

  const getEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`
      : url;
  };

  if (!courseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Курсийн мэдээлэл олдсонгүй</p>
      </div>
    );
  }

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel: Sections and Lessons */}
        <ResizablePanel defaultSize={30} minSize={35} maxSize={45}>
          <Accordion type="multiple" className="p-4">
            <h2 className="mb-2 text-xl font-bold">Sections</h2>
            {courseData.sectionId?.map(
              (
                section: {
                  _id?: string;
                  title?: string;
                  lessonId?: Array<{
                    _id?: string;
                    title?: string;
                    isPublished?: boolean;
                  }>;
                },
                index: number,
              ) => (
                <AccordionItem
                  key={section._id || index}
                  value={`section-${index}`}
                >
                  <AccordionTrigger>
                    <div className="flex gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {section.title}
                      </h2>
                    </div>
                  </AccordionTrigger>

                  {/* Lessons */}
                  <AccordionContent>
                    <div className="mt-2 list-disc pl-4">
                      {section.lessonId?.map((lesson, lessonIndex) => (
                        <div
                          key={lesson._id || lessonIndex}
                          className="cursor-pointer hover:underline"
                        >
                          <Button
                            variant={"link"}
                            effect={"hoverUnderline"}
                            className="cursor-pointer text-base text-gray-700"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            {lesson.title}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle />

        {/* Right Panel: Selected Lesson */}
        <ResizablePanel defaultSize={70} minSize={50} className="bg-gray-50">
          <div className="p-4">
            {selectedLesson ? (
              loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Loading lesson details...</span>
                </div>
              ) : error ? (
                <p className="text-red-500">
                  Error loading lesson: {error.message}
                </p>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {data?.getLessonById?.title || selectedLesson.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  {data && (
                    <iframe
                      src={getEmbedUrl(data?.getLessonById?.videoUrl || "")}
                      className="mt-2 aspect-video w-full rounded-lg"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  )}
                </>
              )
            ) : (
              <p className="text-gray-500">No lesson selected</p>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
