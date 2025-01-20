import { BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CourseInfo({ course }: { course: any }) {
  const {
    title,
    description,
    _id,
    price,
    duration,
    createdBy,
    status,
    categories,
    tags,
    enrollmentId,
    sectionId,
  } = course;

  const totalSections = sectionId?.length || 0;
  const totalLessons = sectionId?.reduce(
    (total: number, section: any) => total + (section?.lessonId?.length || 0),
    0,
  );
  const totalEnrollments = enrollmentId?.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Title: </span>
            {title}
          </div>
          <div>
            <span className="font-medium">Description: </span>
            {description}
          </div>
          <div>
            <span className="font-medium">Course ID: </span>
            {_id}
          </div>
          <div>
            <span className="font-medium">Price: </span>₮{price || "0"}
          </div>
          <div>
            <span className="font-medium">Duration: </span>
            {duration || "N/A"}
          </div>
          <div>
            <span className="font-medium">Created By: </span>
            {createdBy || "Unknown"}
          </div>
        </div>
      </div>

      <div>
        <span className="font-medium">Status: </span>
        <Badge>{status || "Unknown"}</Badge>
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Categories</h2>
        {categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category: any, index: number) => (
              <Badge key={index} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="italic text-gray-500">No categories available</span>
        )}
      </div>

      {/* Tags */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Tags</h2>
        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: any, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="italic text-gray-500">No tags available</span>
        )}
      </div>

      {/* Enrollments */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">
          Enrollments
        </h2>
        {enrollmentId?.length ? (
          <div className="space-y-4">
            {enrollmentId.map((enrollment: any, index: number) => (
              <div key={index} className="p-3">
                {enrollment?.userId ? (
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Email: </span>
                      {enrollment.userId.email}
                    </p>
                  </div>
                ) : (
                  <p className="italic text-gray-500">
                    User information not available
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="italic text-gray-500">No enrollments available</span>
        )}
      </div>

      {/* Cards: total section, lessons, enrollment */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total section */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Section</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSections || (
                <span className="italic text-gray-500">No sections</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Lessons */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">
              Total Enrollments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
