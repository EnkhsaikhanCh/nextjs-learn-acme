import { Course, Section } from "@/generated/graphql";
import { stripHtml } from "./stripHtml";

export function calculateCourseCompletionPercent(
  course: Course,
  sections: Section[],
): number {
  const hasLessons = sections.some((s) => (s.lessonId?.length ?? 0) > 0);

  const checklist = [
    Boolean(course.title?.trim()),
    Boolean(course.subtitle?.trim()),
    Boolean(course.slug?.trim()),
    Boolean(stripHtml(course.description || "")),
    Boolean(stripHtml(course.whoIsThisFor || "")),
    Boolean(stripHtml(course.requirements || "")),
    Boolean(course.category?.trim()),
    Boolean(course.difficulty),
    Boolean(course.thumbnail?.publicId),
    sections.length > 0,
    hasLessons,
    typeof course.price?.amount === "number",
  ];

  const completedCount = checklist.filter(Boolean).length;
  return Math.round((completedCount / checklist.length) * 100);
}
