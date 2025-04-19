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

export function LessonTypeSelector({ selected, onSelect, error }: Props) {
  return (
    <fieldset>
      <legend className="mb-1 font-medium">Lesson Type</legend>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {lessonTypeOptions.map(
          ({ value, label, description, Icon, colorClass }) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              onClick={() => onSelect(value)}
              className={cn(
                "flex h-auto justify-start gap-3 px-4 py-3 text-left transition-all",
                selected === value
                  ? `border-${colorClass}-300 bg-${colorClass}-100 hover:bg-${colorClass}-200`
                  : "hover:bg-muted",
                `focus:ring-1 focus:ring-${colorClass}-500 focus:ring-offset-1`,
              )}
            >
              <Icon className={`h-5 w-5 text-center text-${colorClass}-500`} />
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-muted-foreground text-xs">
                  {description}
                </div>
              </div>
            </Button>
          ),
        )}
      </div>
    </fieldset>
  );
}
