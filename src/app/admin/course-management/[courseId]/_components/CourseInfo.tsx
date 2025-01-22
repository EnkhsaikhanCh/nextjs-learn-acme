import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Course {
  title?: string | null;
  description?: string | null;
  price?: number | null;
  status?: string | null;
  categories?: (string | null)[] | null;
  tags?: (string | null)[] | null;
}

interface CourseInfoProps {
  course: Course;
}

export function CourseInfo({ course }: CourseInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <Card className="bg-zinc-800 text-white shadow-none">
        <CardHeader className="text-2xl font-bold text-white">
          {course.title || "Untitled Course"}
        </CardHeader>
        <CardContent className="-mt-3 flex flex-col gap-3">
          <div className="text-sm font-semibold">
            {course.description || "No description available"}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-1">
        <Card
          className={`flex h-[45px] items-center justify-center border-2 font-semibold ${
            course.status === "archived"
              ? "border-yellow-500 bg-yellow-300"
              : course.status === "active"
                ? "bg-green-500"
                : "bg-zinc-800"
          }`}
        >
          <CardHeader className="text-center text-lg">
            {course.status || "Unknown"}
          </CardHeader>
        </Card>
        <Card className="flex h-[45px] items-center justify-center bg-zinc-800 font-semibold text-white shadow-none">
          <CardHeader className="text-center text-lg">
            ₮{course.price || "0"}
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
