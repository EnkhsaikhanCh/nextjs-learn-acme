import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateLessonMutation } from "@/generated/graphql";

export function AddLessonForm({
  sectionId,
  refetchCourse,
}: {
  sectionId: string;
  refetchCourse: () => void;
}) {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [createLesson] = useCreateLessonMutation();

  const handleCreateLesson = async (e: FormEvent) => {
    e.preventDefault();
    if (!sectionId) {
      toast.error("Section ID is missing!");
      return;
    }
    setIsCreating(true);

    try {
      await createLesson({
        variables: {
          input: {
            sectionId,
            title,
          },
        },
      });
      setTitle("");
      toast.success("Lesson created successfully!");
      refetchCourse();
    } catch (err: any) {
      toast.error(err.message || "Error creating lesson");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateLesson} className="mb-4 flex gap-2">
      <Input
        placeholder="Lesson title"
        className="w-[300px]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" disabled={isCreating}>
        {isCreating ? (
          <>
            Creating lesson...
            <Loader className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Add Lesson"
        )}
      </Button>
    </form>
  );
}
