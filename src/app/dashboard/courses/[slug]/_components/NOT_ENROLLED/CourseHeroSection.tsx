import { Button } from "@/components/ui/button";

// CourseHeroSection.tsx
export const CourseHeroSection = ({
  title,
  description,
  onEnrollClick,
}: {
  title: string;
  description: string;
  onEnrollClick: () => void;
}) => (
  <section className="text-accent m-4 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/90 py-20 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 dark:text-white">
    <div className="container mx-auto px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold md:text-5xl dark:text-white">
        {title}
      </h1>
      <p className="mb-8 text-xl dark:text-gray-200">{description}</p>
      <Button
        size="lg"
        onClick={onEnrollClick}
        className="cursor-pointer rounded-full bg-yellow-400 font-bold text-black hover:bg-yellow-500 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600"
      >
        Сургалтанд бүртгүүлэх
      </Button>
    </div>
  </section>
);
