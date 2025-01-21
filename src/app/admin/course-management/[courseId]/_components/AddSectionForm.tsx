import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateSectionMutation } from "@/generated/graphql";

export function AddSectionForm({
  courseId,
  refetchCourse,
}: {
  courseId: string;
  refetchCourse: () => void;
}) {
  const [title, setTitle] = useState("");
  const [sectionIsCreating, setSectionIsCreating] = useState(false);

  const [createSection] = useCreateSectionMutation();

  const handleCreateSection = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast.error("Course ID is missing!");
      return;
    }

    setSectionIsCreating(true);

    try {
      await createSection({
        variables: {
          input: {
            courseId,
            title,
          },
        },
      });
      setTitle("");
      toast.success("Section created successfully!");
      refetchCourse();
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message || "Error creating section");
    } finally {
      setSectionIsCreating(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateSection}
      className="mb-12 mt-6 flex w-full gap-2"
    >
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
  );
}
