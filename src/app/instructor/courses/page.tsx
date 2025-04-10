"use client";

import { CreateCourseDialog } from "../components/CreateCourseDialog";

export default function Page() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <h1 className="text-slate-12 text-[28px] leading-[34px] font-bold tracking-[-0.416px]">
          Courses
        </h1>
        <CreateCourseDialog />
      </section>

      {/* Empty state */}
      <div className="mx-auto w-full max-w-full px-6 md:max-w-5xl">
        <div className="mb-4 grid grid-cols-2 flex-col gap-3 sm:gap-2">
          {/* Search input and filters here */}
        </div>
        <div>
          <div className="flex flex-row space-x-8">
            <div className="border-slate-6 relative flex h-80 grow items-center justify-center rounded-lg border">
              <div className="mx-auto flex max-w-md flex-col space-y-8 text-center">
                <div className="flex flex-col space-y-2">
                  <h2 className="text-slate-12 text-xl font-bold tracking-[-0.16px]">
                    No courses added yet
                  </h2>
                  <span className="text-slate-11 text-sm font-normal">
                    Start by creating your first course to publish or schedule
                    it later.
                  </span>
                </div>
                <CreateCourseDialog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
