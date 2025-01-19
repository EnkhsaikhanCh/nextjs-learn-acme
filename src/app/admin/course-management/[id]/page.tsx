"use client";

import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

export default function Page() {
  const { id } = useParams();

  const { data, loading, error } = useGetCourseByIdQuery({
    variables: { id: id as string },
    skip: !id,
  });

  if (!id) {
    return <div>No ID provided in the URL</div>;
  }

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin" /> Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading Course</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return <div>No data found</div>;
  }

  const sectionCount = data?.getCourseById?.sectionId?.length ?? 0;

  return (
    <div className="flex w-[700px] flex-col gap-2">
      <h1 className="rounded-md border-2 border-yellow-600 bg-yellow-100 px-3 py-2 text-yellow-800">
        <span className="font-bold">Title:</span> {data?.getCourseById?.title}
      </h1>
      <p className="flex flex-col">
        <span className="font-bold">Description:</span>{" "}
        {data?.getCourseById?.description}
      </p>
      <div>
        <span className="font-bold">Course DB ID:</span>{" "}
        {data?.getCourseById?._id}
      </div>
      <p>
        <span className="font-bold">Price:</span> ₮{data?.getCourseById?.price}
      </p>
      <div>
        <span className="font-bold">Total Section:</span>{" "}
        {sectionCount > 0 ? (
          <>{sectionCount}</>
        ) : (
          <span className="italic text-gray-500">No section available</span>
        )}
      </div>
      <p>
        <span className="font-bold">Duration:</span>{" "}
        {data?.getCourseById?.duration}
      </p>
      <p>
        <span className="font-bold">Created By:</span>{" "}
        {data?.getCourseById?.createdBy}
      </p>
      <p>
        <span className="font-bold">Total Enrollments:</span>{" "}
        {data?.getCourseById?.enrollmentId?.length}
      </p>
      <div>
        <span className="font-bold">Status:</span>{" "}
        <Badge>{data?.getCourseById?.status}</Badge>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">Categories:</span>
        {data?.getCourseById?.categories?.length ? (
          data.getCourseById.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category}
            </Badge>
          ))
        ) : (
          <span className="italic text-gray-500">No categories available</span>
        )}
      </div>

      <div className="flex gap-2">
        <span className="font-bold">Tags:</span>
        {data?.getCourseById?.tags?.length ? (
          data.getCourseById.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="italic text-gray-500">No tags available</span>
        )}
      </div>

      <p>
        <span className="font-bold">Total Enrollments:</span>{" "}
        {data?.getCourseById?.enrollmentId?.length ?? 0}
      </p>

      <div>
        {data?.getCourseById?.enrollmentId?.map((enrollment, index) => (
          <div key={index} className="mb-3 rounded-md border">
            <div className="rounded-t-md bg-gray-200 p-1 text-gray-700">
              <span className="font-bold">Enrollment ID:</span>{" "}
              {enrollment?._id}
            </div>
            {enrollment?.userId ? (
              <div className="p-2">
                <p>
                  <span className="font-bold">User ID:</span>{" "}
                  {enrollment.userId._id}
                </p>
                <p>
                  <span className="font-bold">Email:</span>{" "}
                  {enrollment.userId.email}
                </p>
              </div>
            ) : (
              <p className="p-2 italic text-gray-500">
                User information not available or user deleted
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
