import { Section } from "@/generated/graphql";
import { SectionItem } from "./SectionItem";

export function SectionList({
  sections,
  refetchCourse,
  onLessonSelect,
}: {
  sections: Section[];
  refetchCourse: () => void;
  onLessonSelect: (lessonId: string) => void;
}) {
  return (
    <div className="mt-6">
      <div>
        <h2 className="mb-2 text-xl font-bold">Sections</h2>
        {sections.map((section, index) => (
          <SectionItem
            key={section?._id || index}
            section={section}
            refetchCourse={refetchCourse}
            onLessonSelect={onLessonSelect}
          />
        ))}
      </div>
      {sections.length === 0 && (
        <p className="italic text-gray-500">No sections yet</p>
      )}
    </div>
  );
}
