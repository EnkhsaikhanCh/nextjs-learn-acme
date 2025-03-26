// src/app/admin/course-management
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateCourseMutation,
  useGetAllCourseQuery,
} from "@/generated/graphql";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/utils/sanitize";
import { CirclePlus, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  const { data, loading, error, refetch } = useGetAllCourseQuery();
  const [createCourse] = useCreateCourseMutation();

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    if (!title) {
      toast.error("Title is required");
      setIsCreating(false);
      return;
    }

    const sanitizedTitle = sanitizeInput(title);

    try {
      await createCourse({
        variables: {
          input: {
            title: sanitizedTitle,
          },
        },
      });

      toast.success("Aмжилттай хичээл үүслээ");
      setIsDialogOpen(false);
      setTitle("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="flex flex-col gap-3 p-4">
      {loading && (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <p className="mr-3 text-lg">Loading courses...</p>
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Алдаа гарлаа!</h1>
          <p className="text-lg text-gray-600">{error?.message}</p>
        </div>
      )}

      {data && (
        <>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => setIsDialogOpen(open)}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="md:w-[200px]"
              >
                <CirclePlus /> Create Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCourse}>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title" className="font-semibold">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Course title"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {data?.getAllCourse.map((course, index) => (
            <Link
              href={`/admin/course-management/${course.slug}`}
              key={index}
              className="md:w-[500px]"
            >
              <div className="group bg-accent/70 hover:bg-accent/100 text-accent-foreground flex px-4 py-2">
                <h1 className="underline-offset-3 group-hover:text-blue-600 group-hover:underline dark:group-hover:text-blue-500">
                  {course.title}
                </h1>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant={"secondary"}>{course.courseCode}</Badge>
                  <Badge
                    className={cn({
                      "bg-emerald-200 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-600 dark:bg-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-700 dark:hover:text-emerald-200":
                        course.status === "PUBLISHED",
                      "bg-gray-500 text-white hover:bg-gray-500 hover:text-white":
                        course.status === "ARCHIVED",
                      "hover:bg-yello-200 hvoer:bg-yellow-600 bg-yellow-200 text-yellow-600 dark:bg-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-700 dark:hover:text-yellow-200":
                        course.status === "DRAFT",
                    })}
                  >
                    {course.status}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </main>
  );
}
