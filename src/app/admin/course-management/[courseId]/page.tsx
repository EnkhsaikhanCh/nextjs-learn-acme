"use client";

import { useParams } from "next/navigation";
import {
  useCreateSectionMutation,
  useGetCourseByIdQuery,
} from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Page() {
  const [title, setTitle] = useState<string>("");
  const [sectionIsCreating, setSectionIsCreating] = useState<boolean>(false);

  const { courseId } = useParams();

  const [createSection] = useCreateSectionMutation();

  const { data, loading, error, refetch } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  if (!courseId) {
    return <div>No ID provided in the URL</div>;
  }

  if (loading || error || !data) {
    return (
      <div>
        {loading && (
          <div className="mt-2 flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" /> Loading...
          </div>
        )}
        {error && (
          <div>
            <h2>Error Loading Course</h2>
            <p>{error.message}</p>
          </div>
        )}
        {!data && <div>No data found</div>}
      </div>
    );
  }

  const sectionCount = data?.getCourseById?.sectionId?.length || 0;

  const handleCreateSection = async (event: React.FormEvent) => {
    event.preventDefault();
    setSectionIsCreating(true);

    try {
      await createSection({
        variables: {
          input: {
            courseId: courseId as string,
            title: title,
          },
        },
      });

      await refetch();
      toast.success("Section created successfully!");
      setTitle("");
    } catch (error) {
      console.error(error);

      const message = (error as Error).message;
      toast.error(message);
    } finally {
      setSectionIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Title:</span>{" "}
              {data?.getCourseById?.title}
            </div>
            <div>
              <span className="font-medium">Description:</span>{" "}
              {data?.getCourseById?.description}
            </div>
            <div>
              <span className="font-medium">Course ID:</span>{" "}
              {data?.getCourseById?._id}
            </div>
            <div>
              <span className="font-medium">Price:</span> ₮
              {data?.getCourseById?.price || "0"}
            </div>
            <div>
              <span className="font-medium">Duration:</span>{" "}
              {data?.getCourseById?.duration || "N/A"}
            </div>
            <div>
              <span className="font-medium">Created By:</span>{" "}
              {data?.getCourseById?.createdBy || "Unknown"}
            </div>
          </div>
        </div>

        <div>
          <span className="font-medium">Status:</span>{" "}
          <Badge>{data?.getCourseById?.status || "Unknown"}</Badge>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Categories
          </h2>
          {data?.getCourseById?.categories?.length ? (
            <div className="flex flex-wrap gap-2">
              {data.getCourseById.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="italic text-gray-500">
              No categories available
            </span>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Tags</h2>
          {data?.getCourseById?.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {data.getCourseById.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="italic text-gray-500">No tags available</span>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Enrollments
          </h2>
          {data?.getCourseById?.enrollmentId?.length ? (
            <div className="space-y-4">
              {data.getCourseById.enrollmentId.map((enrollment, index) => (
                <div key={index} className="p-3">
                  {enrollment?.userId ? (
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {enrollment.userId.email}
                      </p>
                    </div>
                  ) : (
                    <p className="italic text-gray-500">
                      User information not available
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="italic text-gray-500">
              No enrollments available
            </span>
          )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total section */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Section</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sectionCount > 0 ? (
                sectionCount
              ) : (
                <span className="italic text-gray-500">
                  No sections available
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Lesson */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.getCourseById?.sectionId?.reduce(
                (total, section) => total + (section?.lessonId?.length || 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">
              Total Enrollments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.getCourseById?.enrollmentId?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section */}
      <div>
        <div className="mb-3 text-xl font-bold">Sections</div>
        {data?.getCourseById?.sectionId?.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-4 border-b border-gray-200 pb-4"
          >
            <div className="flex items-center gap-3 rounded-md border bg-gray-50 p-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {section?.title}
              </h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-100 font-semibold text-gray-800">
                {section?.lessonId?.length || 0}
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {section?.lessonId?.map((lesson, lessonIndex) => (
                <div key={lessonIndex}>
                  <Link
                    href="#"
                    className="block cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-100"
                  >
                    <span className="text-base text-gray-700">
                      {lesson?.title}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Section button */}
        <form onSubmit={handleCreateSection} className="flex w-[500px] gap-2">
          <Input
            placeholder="Section title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" disabled={sectionIsCreating}>
            {sectionIsCreating ? (
              <>
                Creating section...
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Add Section"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
