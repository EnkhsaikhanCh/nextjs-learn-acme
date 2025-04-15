import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/generated/graphql";
import { CircleCheck } from "lucide-react";

// CourseOverviewSection.tsx
interface Props {
  course: Course;
}

export const CourseOverviewSection = ({ course }: Props) => {
  const totalLessons = course?.sectionId?.reduce(
    (total, section) => total + (section?.lessonId?.length || 0),
    0,
  );

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">Хичээлийн тойм</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-sidebar rounded-xl">
            <CardHeader>
              <CardTitle>Та юу сурах вэ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course?.whatYouWillLearn?.map((item, index) => (
                  <li className="flex items-center" key={index}>
                    <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-sidebar rounded-xl">
            <CardHeader>
              <CardTitle>Хичээлийн мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li>
                  <strong>Нийт хичээлүүд:</strong> {totalLessons}
                </li>
                <li>
                  <strong>Ангилал:</strong>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {course.category?.length ? (
                      <Badge className="bg-yellow-200 text-yellow-600">
                        {course.category}
                      </Badge>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Ангилал байхгүй
                      </div>
                    )}
                  </div>
                </li>
                <li>
                  <strong>Түлхүүр үгс:</strong>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {course.tags?.length ? (
                      course.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-yellow-200 text-yellow-600"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        Түлхүүр үг байхгүй
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
