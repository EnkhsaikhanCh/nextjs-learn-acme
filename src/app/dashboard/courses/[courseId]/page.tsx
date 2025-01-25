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
import { CircleCheck, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
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

      <section className="bg-gradient-to-b from-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {data?.getCourseById?.title}
          </h1>
          <p className="mb-8 text-xl">{data?.getCourseById?.description}</p>
          <Button
            size="lg"
            onClick={handleScrollToPayment}
            className="bg-white font-semibold text-primary hover:bg-white/90"
          >
            Сургалтанд бүртгүүлэх
          </Button>
        </div>
      </section>

      {loading && (
        <p className="flex h-screen items-center justify-center gap-2 text-center">
          Уншиж байна... <Loader className="h-5 w-5 animate-spin" />
        </p>
      )}

      {error && <p>Error fetching course: {error.message}</p>}

      {data && (
        <>
          <section className="p-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Course Overview
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                <Card>
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
                <Card>
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
                              <Badge key={index} className="">
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
                {data?.getCourseById?.whyChooseOurCourse?.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{item?.title}</CardTitle>
                    </CardHeader>
                    <CardContent>{item?.description}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="payment" className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">Pricing</h2>
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
                    <Button className="w-full font-semibold">
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
