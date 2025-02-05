import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateLessonMutation } from "@/generated/graphql";
import { sanitizeInput } from "@/utils/sanitize";
import { motion } from "framer-motion";

export function AddLessonForm({
  sectionId,
  refetchCourse,
}: {
  sectionId: string;
  refetchCourse: () => void;
}) {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const [createLesson] = useCreateLessonMutation();

  const handleCreateLesson = async (e: FormEvent) => {
    e.preventDefault();
    if (!sectionId) {
      toast.error("Section ID is missing!");
      return;
    }

    if (!title) {
      setError("Lesson title is required!");
      setShowAnimation(false);

      setTimeout(() => {
        setShowAnimation(true);
        setTimeout(() => setError(""), 1000);
      }, 3000);

      setIsCreating(false);
      return;
    }

    const sanitizeTitle = sanitizeInput(title);

    setIsCreating(true);

    try {
      await createLesson({
        variables: {
          input: {
            sectionId,
            title: sanitizeTitle,
          },
        },
      });
      setTitle("");
      toast.success("Lesson created successfully!");
      refetchCourse();
    } catch (error) {
      const message = (error as Error).message;
      toast.error(message || "Error creating lesson");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateLesson} className="my-4 ml-2 flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Lesson title"
          className=""
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              showAnimation
                ? { opacity: 0, scale: 0.8, rotate: -10 }
                : { opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: showAnimation ? 0.5 : 0.3,
            }}
            style={{
              color: "red",
              marginTop: "5px",
              fontWeight: "bold",
              background: "#ffe6e6",
              padding: "5px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {error}
          </motion.div>
        )}
      </div>

      <Button type="submit" disabled={isCreating} className="font-semibold">
        {isCreating ? (
          <>
            Creating lesson...
            <Loader className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Add Lesson
            <CirclePlus />
          </>
        )}
      </Button>
    </form>
  );
}
