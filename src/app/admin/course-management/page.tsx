"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCourseMutation,
  useGetAllCourseQuery,
} from "@/generated/graphql";
import { CirclePlus, ExternalLink, Loader, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const { data, loading, error, refetch } = useGetAllCourseQuery();
  const [createCourse] = useCreateCourseMutation();

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createCourse({
        variables: {
          input: { title, description, price },
        },
      });

      toast.success("Aмжилттай хичээл үүслээ");
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setPrice(0);

      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Course Management</h1>
      {/* Create course dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
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
                <Label htmlFor="name" className="font-semibold">
                  Title
                </Label>
                <Input
                  id="name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Course title"
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Course description"
                />
              </div>
              <div>
                <Label htmlFor="price" className="font-semibold">
                  Price
                </Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  type="number"
                  placeholder="Enter price"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Loader className="animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="mr-3 text-lg">Loading courses...</p>
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex w-full items-center justify-center gap-2 rounded-md border border-red-400 bg-red-100 p-4 text-red-600">
          <TriangleAlert className="h-4 w-4" />
          <span>Алдаа: {error.message}</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.getAllCourse.map((course, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={"/placeholder.svg?height=100&width=200"}
                className="aspect-video w-full rounded-md object-cover"
                alt={course.title || "Course image"}
                width={200}
                height={100}
              />
            </CardContent>
            <CardFooter>
              <Link
                target="_blank"
                href={`/admin/course-management/${course._id}`}
                passHref
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Button>
                  Edit Course <ExternalLink />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
