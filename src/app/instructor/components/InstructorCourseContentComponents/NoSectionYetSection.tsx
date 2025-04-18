import { GalleryVerticalEnd, Plus } from "lucide-react";
import { CreateSectionDialog } from "./CreateSectionDialog";
import { useParams } from "next/navigation";
import { useCourseSections } from "../../feature/useCourseSections";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const NoSectionYetSection = () => {
  const { slug } = useParams();

  const { courseId, refetch } = useCourseSections(slug as string);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed py-12 text-center">
      <div className="bg-accent mb-4 flex h-13 w-13 items-center justify-center rounded-full border">
        <GalleryVerticalEnd className="text-gray-500 dark:text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        No section yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Start building your course by adding sections to organize your content
      </p>

      <CreateSectionDialog
        courseId={courseId!}
        onCreated={() => {
          refetch();
          toast.success("Section successfully created");
        }}
        trigger={
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Section
          </Button>
        }
      />
    </div>
  );
};
