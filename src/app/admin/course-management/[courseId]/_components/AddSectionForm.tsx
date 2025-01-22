import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateSectionMutation } from "@/generated/graphql";
import { motion } from "framer-motion";
import { sanitizeInput } from "@/utils/sanitize";

export function AddSectionForm({
  courseId,
  refetchCourse,
}: {
  courseId: string;
  refetchCourse: () => void;
}) {
  const [title, setTitle] = useState("");
  const [sectionIsCreating, setSectionIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const [createSection] = useCreateSectionMutation();

  const handleCreateSection = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast.error("Course ID is missing!");
      return;
    }

    if (!title) {
      setError("Section title is required!");
      setShowAnimation(false); // Reset any previous animation

      // Show the error and clear it after 3 seconds
      setTimeout(() => {
        setShowAnimation(true); // Trigger post-error animation
        setTimeout(() => setError(""), 1000); // Fully remove the error after animation
      }, 3000);

      return;
    }

    const sanitizedTitle = sanitizeInput(title);

    setSectionIsCreating(true);

    try {
      await createSection({
        variables: {
          input: {
            courseId,
            title: sanitizedTitle,
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
      <div className="flex-1">
        <Input
          placeholder="Section title"
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
