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
import { CircleCheck } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { GetCourseByIdQuery } from "@/generated/graphql";
import { PaymentDialog } from "./PaymentDialog";

type CourseById = NonNullable<GetCourseByIdQuery["getCourseById"]>;

type ExtendedCourse = CourseById & {
  whyChooseOurCourse?: Array<{
    icon?: keyof typeof LucideIcons;
    title?: string;
    description?: string;
  }>;
};

interface NotEnrolledUserViewProps {
  user: any;
  course: ExtendedCourse; // → course проп нь заавал энэ төрлийнх байна
  onScrollToPayment: () => void;
}

export function NotEnrolledUserView({
  user,
  course,
  onScrollToPayment,
}: NotEnrolledUserViewProps) {
  return (
    <>
      {/* Курсийн танилцуулга хэсэг */}
      <section className="m-4 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/90 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {course?.title}
          </h1>
          <p className="mb-8 text-xl">{course?.description}</p>
          <Button
            size="lg"
            onClick={onScrollToPayment}
            className="rounded-full bg-yellow-400 font-bold text-primary hover:bg-yellow-300"
          >
            Сургалтанд бүртгүүлэх
          </Button>
        </div>
      </section>

      {/* Хичээлийн тойм */}
      <section className="p-5 lg:p-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Хичээлийн тойм
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Та юу сурах вэ */}
            <Card className="rounded-xl">
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

            {/* Хичээлийн мэдээлэл */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Хичээлийн мэдээлэл</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <strong>Нийт хичээлүүд:</strong>{" "}
                    {course?.sectionId
                      ? course.sectionId.reduce(
                          (total, section) =>
                            total + (section?.lessonId?.length || 0),
                          0,
                        )
                      : 0}
                  </li>
                  {/* Categories */}
                  <li>
                    <strong>Ангилал: </strong>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {course?.categories?.length ? (
                        course.categories.map((category, index) => (
                          <Badge
                            key={index}
                            className="bg-yellow-200 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-600"
                          >
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          Ангилал байхгүй
                        </div>
                      )}
                    </div>
                  </li>
                  {/* Tags */}
                  <li>
                    <strong>Түлхүүр үгс: </strong>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {course?.tags?.length ? (
                        course.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-yellow-200 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-600"
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

      {/* Яагаад манай сургалтыг сонгох вэ */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Яагаад манай сургалтыг сонгох вэ
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {course?.whyChooseOurCourse?.map((item, index) => {
              // item.icon-д тохирох Lucide icon-г динамикаар сонгох
              const IconComponent: LucideIcon | undefined = item?.icon
                ? (LucideIcons[
                    item.icon as keyof typeof LucideIcons
                  ] as LucideIcon)
                : LucideIcons.Star;

              return (
                <Card
                  key={index}
                  className="flex flex-col rounded-2xl p-2 shadow-none"
                >
                  <CardHeader>
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-200">
                      {IconComponent && (
                        <IconComponent className="h-10 w-10 text-yellow-600" />
                      )}
                    </div>
                    <CardTitle className="text-center">{item?.title}</CardTitle>
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

      {/* Төлбөрийн мэдээлэл */}
      <section id="payment" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Та хичээлээ үзэхэд бэлэн үү?
          </h2>
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Full Course Access</CardTitle>
                <CardDescription>
                  {course?.pricingDetails?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  ₮{course?.pricingDetails?.price}
                </p>
                <ul className="mt-4 space-y-2">
                  {course?.pricingDetails?.details?.map((detail, index) => (
                    <li className="flex items-center" key={index}>
                      <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <PaymentDialog user={user} course={course} />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
