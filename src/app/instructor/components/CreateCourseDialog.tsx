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
import { useCreateCourseMutation } from "@/generated/graphql";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const CreateCourseDialog = ({ refetch }: { refetch: () => void }) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseCreating, setCourseCreating] = useState(false);

  const [createCourse] = useCreateCourseMutation();

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      toast.warning("Course title is required");
      return;
    }

    setCourseCreating(true);

    try {
      await createCourse({
        variables: {
          input: {
            title: courseTitle.trim(),
          },
        },
      });

      toast.success("Course created successfully");
      setCourseTitle("");
      setIsDialogOpen(false);
      refetch();
    } catch {
      toast.error("Failed to create course");
    } finally {
      setCourseCreating(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="self-center" size={"sm"}>
            <Plus />
            New Course
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateCourse}>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. JavaScript for Beginners"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={courseCreating}>
                {courseCreating ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
