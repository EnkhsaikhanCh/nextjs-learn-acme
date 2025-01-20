import { useState } from "react";
import { SectionItem } from "./SectionItem";

export function SectionList({
  sections,
  refetchCourse,
}: {
  sections: any[];
  refetchCourse: () => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-xl font-bold">Sections</h2>
      {sections.map((section, index) => (
        <SectionItem
          key={section?._id || index}
          section={section}
          refetchCourse={refetchCourse}
        />
      ))}
      {sections.length === 0 && (
        <p className="italic text-gray-500">No sections yet</p>
      )}
    </div>
  );
}
