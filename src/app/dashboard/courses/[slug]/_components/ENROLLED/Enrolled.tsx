import { Course } from "@/generated/graphql";

export const Enrolled = ({ course }: { course: Course }) => {
  return (
    <main className="m-4">
      <h1>{course.title}</h1>
    </main>
  );
};
