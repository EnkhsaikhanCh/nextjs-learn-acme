import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {course.title || "Untitled Course"}
          </h1>
          <div>
            <span className="font-medium">Description: </span>
            {course.description || "No description available"}
          </div>
          <div>
            <span className="font-medium">Price: </span>₮{course.price || "0"}
          </div>
        </div>
      </div>

      <div>
        <span className="font-medium">Status: </span>
        <Badge>{course.status || "Unknown"}</Badge>
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Categories</h2>
        {course.categories && course.categories.length ? (
          <div className="flex flex-wrap gap-2">
            {course.categories
              .filter((category): category is string => category !== null)
              .map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
          </div>
        ) : (
          <span className="italic text-gray-500">No categories available</span>
        )}
      </div>
    </div>
  );
}
