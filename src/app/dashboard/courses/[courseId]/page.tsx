"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCourseByIdQuery } from "@/generated/graphql";
import { CircleCheck, Loader, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import * as LucideIcons from "lucide-react"; // Бүх icon-уудыг импортлох
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { data: session } = useSession();

  const { data, loading, error } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  const loggedInUserId = session?.user.id;
  console.log("User Id: ", loggedInUserId);
  const userEnrolled = data?.getCourseById?.enrollmentId?.some(
    (enrollment) => enrollment?.userId?._id === loggedInUserId,
  );
  console.log("User Enrolled: ", userEnrolled);

  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Enrollment conditional page   */}
      {/* If the user is enrolled in the course, do not show this course introduction page */}
      {/* If the user is not enrolled in the course, show course introduction page instead. */}

      {loading && (
        <p className="flex h-screen items-center justify-center gap-2 text-center">
          Уншиж байна... <Loader className="h-5 w-5 animate-spin" />
        </p>
      )}

      {error && <p>Error fetching course: {error.message}</p>}

      {data && (
        <>
          <section className="m-4 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/90 py-20 text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                {data?.getCourseById?.title}
              </h1>
              <p className="mb-8 text-xl">{data?.getCourseById?.description}</p>
              <Button
                size="lg"
                onClick={handleScrollToPayment}
                className="rounded-full bg-yellow-400 font-bold text-primary hover:bg-yellow-300"
              >
                Сургалтанд бүртгүүлэх
              </Button>
            </div>
          </section>

          <section className="p-5 lg:p-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Course Overview
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data?.getCourseById?.whatYouWillLearn?.map(
                        (item, index) => (
                          <li className="flex items-center" key={index}>
                            <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Details */}
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li>
                        <strong>Total Lessons:</strong>{" "}
                        {data?.getCourseById?.sectionId
                          ? data.getCourseById.sectionId.reduce(
                              (total, section) =>
                                total + (section?.lessonId?.length || 0),
                              0,
                            )
                          : 0}
                      </li>

                      {/* Categories */}
                      <li>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <strong>Categories:</strong>
                          {data?.getCourseById?.categories?.length ? (
                            data.getCourseById.categories.map(
                              (category, index) => (
                                <Badge key={index} variant="secondary">
                                  {category}
                                </Badge>
                              ),
                            )
                          ) : (
                            <Badge variant="secondary">
                              No categories listed
                            </Badge>
                          )}
                        </div>
                      </li>

                      {/* Tags */}
                      <li>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <strong>Tags:</strong>
                          {data?.getCourseById?.tags?.length ? (
                            data.getCourseById.tags.map((tag, index) => (
                              <Badge variant="secondary" key={index}>
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary">No tags available</Badge>
                          )}
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Our Course */}
          <section className="bg-gray-100 py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Why Choose Our Course
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                {data?.getCourseById?.whyChooseOurCourse?.map((item, index) => {
                  // `item.icon`-г зөв индексжүүлэх
                  const Icon =
                    item?.icon &&
                    (LucideIcons as Record<string, any>)[item.icon]
                      ? (LucideIcons as Record<string, any>)[item.icon]
                      : LucideIcons.Star;

                  return (
                    <Card
                      key={index}
                      className="flex flex-col rounded-2xl p-2 shadow-none"
                    >
                      <CardHeader>
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-200">
                          <Icon className="h-10 w-10 text-yellow-600" />
                        </div>
                        <CardTitle className="text-center">
                          {item?.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        {item?.description}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="payment" className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Та хичээлээ үзэхэд бэлэн үү?
              </h2>
              <div className="mx-auto max-w-md">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Full Course Access
                    </CardTitle>
                    <CardDescription>
                      {data?.getCourseById?.pricingDetails?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      ₮{data?.getCourseById?.pricingDetails?.price}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {data?.getCourseById?.pricingDetails?.details?.map(
                        (detail, index) => (
                          <li className="flex items-center" key={index}>
                            <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                            {detail}
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size={"lg"}
                      className="w-full rounded-full bg-yellow-400 font-bold text-primary hover:bg-yellow-300"
                    >
                      Сургалтанд бүртгүүлэх
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
