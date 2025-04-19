// lessonTypeConfig.ts
import { Play, FileText, File, FileQuestion, FilePenLine } from "lucide-react";
import { LessonType } from "@/generated/graphql";

export interface LessonTypeOption {
  value: LessonType;
  label: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const lessonTypeOptions: LessonTypeOption[] = [
  {
    value: LessonType.Video,
    label: "Video",
    description: "Upload or embed a video",
    Icon: Play,
  },
  {
    value: LessonType.Text,
    label: "Text",
    description: "Write plain or rich text",
    Icon: FileText,
  },
  {
    value: LessonType.File,
    label: "File",
    description: "Attach downloadable files",
    Icon: File,
  },
  {
    value: LessonType.Quiz,
    label: "Quiz",
    description: "Add multiple choice questions",
    Icon: FileQuestion,
  },
  {
    value: LessonType.Assignment,
    label: "Assignment",
    description: "Give long-form tasks or prompts",
    Icon: FilePenLine,
  },
];
