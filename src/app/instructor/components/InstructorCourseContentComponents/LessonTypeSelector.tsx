import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldError } from "react-hook-form";
import { LessonTypeOption, lessonTypeOptions } from "@/config/lessonTypeConfig";
import { LessonType } from "@/generated/graphql";

interface Props {
  selected: LessonType | null;
  onSelect: (t: LessonTypeOption["value"]) => void;
  error?: FieldError;
}

function getColorClasses(type: LessonType) {
  switch (type) {
    case LessonType.Video:
      return {
        border: "border-blue-300 dark:border-blue-500/30",
        bg: "bg-blue-100 dark:bg-blue-950",
        hover: "hover:bg-blue-200 dark:hover:bg-blue-900",
        ring: "focus:ring-blue-500",
        text: "text-blue-500",
      };
    case LessonType.Text:
      return {
        border: "border-emerald-300 dark:border-emerald-500/30",
        bg: "bg-emerald-100 dark:bg-emerald-950",
        hover: "hover:bg-emerald-200 dark:hover:bg-emerald-900",
        ring: "focus:ring-emerald-500",
        text: "text-emerald-500",
      };
    case LessonType.File:
      return {
        border: "border-purple-300 dark:border-purple-500/30",
        bg: "bg-purple-100 dark:bg-purple-950",
        hover: "hover:bg-purple-200 dark:hover:bg-purple-900",
        ring: "focus:ring-purple-500",
        text: "text-purple-500",
      };
    case LessonType.Quiz:
      return {
        border: "border-amber-300 dark:border-amber-500/30",
        bg: "bg-amber-100 dark:bg-amber-950",
        hover: "hover:bg-amber-200 dark:hover:bg-amber-900",
        ring: "focus:ring-amber-500",
        text: "text-amber-500",
      };
    case LessonType.Assignment:
      return {
        border: "border-gray-300 dark:border-gray-600",
        bg: "bg-gray-100 dark:bg-gray-900",
        hover: "hover:bg-gray-200 dark:hover:bg-gray-800",
        ring: "focus:ring-gray-500",
        text: "text-gray-500",
      };
    default:
      return {
        border: "border-gray-300 dark:border-gray-600",
        bg: "bg-gray-100 dark:bg-gray-900",
        hover: "hover:bg-gray-200 dark:hover:bg-gray-800",
        ring: "focus:ring-gray-500",
        text: "text-gray-500",
      };
  }
}

export function LessonTypeSelector({ selected, onSelect, error }: Props) {
  return (
    <fieldset>
      <legend className="mb-1 font-medium">Lesson Type</legend>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {lessonTypeOptions.map(({ value, label, description, Icon }) => {
          const colors = getColorClasses(value);
          const isSelected = selected === value;

          return (
            <Button
              key={value}
              type="button"
              variant="outline"
              onClick={() => onSelect(value)}
              className={cn(
                "flex h-auto justify-start gap-3 px-4 py-3 text-left transition-all",
                isSelected
                  ? `${colors.border} ${colors.bg} ${colors.hover}`
                  : "hover:bg-muted",
                `${colors.ring} focus:ring-1 focus:ring-offset-1`,
              )}
            >
              <Icon className={`h-5 w-5 text-center ${colors.text}`} />
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-muted-foreground text-xs">
                  {description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}
