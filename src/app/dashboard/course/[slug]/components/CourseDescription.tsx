import RichTextEditorTest from "@/components/rich-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/generated/graphql";

interface CourseDescriptionProps {
  course: Course;
}

export const CourseDescription = ({ course }: CourseDescriptionProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">About This Course</h2>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="audience">Who is this for</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <RichTextEditorTest
              value={course.description || ""}
              editable={false}
            />
          </TabsContent>

          <TabsContent value="requirements">
            <RichTextEditorTest
              value={course.requirements || ""}
              editable={false}
            />
          </TabsContent>

          <TabsContent value="audience">
            <RichTextEditorTest
              value={course.whoIsThisFor || ""}
              editable={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
