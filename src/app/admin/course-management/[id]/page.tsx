"use client";

import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/generated/graphql";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>{data?.getCourseById?.title}</h1>
      <p>{data?.getCourseById?.description}</p>
      <p>Price: {data?.getCourseById?.price}</p>
      <p>Duration: {data?.getCourseById?.duration}</p>
      <p>Created By: {data?.getCourseById?.createdBy}</p>
    </div>
  );
}
