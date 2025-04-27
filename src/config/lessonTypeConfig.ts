// lessonTypeConfig.ts
import { Play, FileText, File, FileQuestion, FilePenLine } from "lucide-react";
import { LessonType } from "@/generated/graphql";

export interface LessonTypeOption {
  value: LessonType;
  label: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isDiabled: boolean;
}

export const lessonTypeOptions: LessonTypeOption[] = [
  {
    value: LessonType.Video,
    label: "Video",
    description: "Upload or embed a video",
    Icon: Play,
    isDiabled: false,
  },
  {
    value: LessonType.Text,
    label: "Text",
    description: "Write plain or rich text",
    Icon: FileText,
    isDiabled: true,
  },
  {
    value: LessonType.File,
    label: "File",
    description: "Attach downloadable files",
    Icon: File,
    isDiabled: true,
  },
  {
    value: LessonType.Quiz,
    label: "Quiz",
    description: "Add multiple choice questions",
    Icon: FileQuestion,
    isDiabled: true,
  },
  {
    value: LessonType.Assignment,
    label: "Assignment",
    description: "Give long-form tasks or prompts",
    Icon: FilePenLine,
    isDiabled: true,
  },
];
