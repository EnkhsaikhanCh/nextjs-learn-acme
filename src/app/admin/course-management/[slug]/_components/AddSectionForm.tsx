"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import { useCreateSectionMutation } from "@/generated/graphql";
import { AnimatePresence, motion } from "framer-motion";
import { sanitizeInput } from "@/utils/sanitize";

interface AddSectionFormProps {
  courseId: string;
  refetchCourse: () => void;
}

export function AddSectionForm({
  courseId,
  refetchCourse,
}: AddSectionFormProps) {
  const [title, setTitle] = useState("");
  const [sectionIsCreating, setSectionIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createSection] = useCreateSectionMutation();

  const handleCreateSection = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!courseId) {
      toast.error("Course ID is missing!");
      return;
    }

    if (!title.trim()) {
      setError("Section title is required!");
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
      setError(null);
      toast.success("Section created successfully!");
      refetchCourse();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error creating section";
      toast.error(message);
    } finally {
      setSectionIsCreating(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateSection}
      className="mt-6 mb-12 flex w-full gap-2"
    >
      <div className="flex-1">
        <Input
          placeholder="Section title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) {
              setError(null);
            }
          }}
        />
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 font-semibold text-red-500"
              role="alert"
            >
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
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
