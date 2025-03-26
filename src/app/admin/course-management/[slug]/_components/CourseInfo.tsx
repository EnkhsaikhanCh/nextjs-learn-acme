import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Course, CourseStatus } from "@/generated/graphql";
import { CircleCheck, CircleX, FilePenLine } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CourseInfoProps {
  course: Course;
  onEdit: (updatedFields: Partial<Course>) => void;
}

export function CourseInfo({ course, onEdit }: CourseInfoProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // State-д эхлэх утгыг course-оос авсан байна.
  const [editValues, setEditValues] = useState<Partial<Course>>(course);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!editValues.title || editValues.title.trim() === "") {
      setError("Title is required");
      return;
    }
    setError(null);
    onEdit(editValues);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Image
        src={course.thumbnail || "/code.jpg?height=100&width=200"}
        alt={course.title || "Course image"}
        width={1000}
        height={1000}
        className="h-[300px] w-full rounded-lg object-cover"
      />

      <Card>
        <CardHeader className="text-2xl font-bold">
          {isEditing ? (
            <Input
              type="text"
              value={editValues.title || ""}
              onChange={(e) =>
                setEditValues({ ...editValues, title: e.target.value })
              }
              className="w-full border-b-2"
            />
          ) : (
            course.title || "Untitled Course"
          )}
        </CardHeader>
        <CardContent className="-mt-3 flex flex-col gap-3">
          {isEditing ? (
            <Textarea
              value={editValues.description || ""}
              onChange={(e) =>
                setEditValues({ ...editValues, description: e.target.value })
              }
              className="w-full rounded bg-transparent p-2"
            />
          ) : (
            course.description || "No description available"
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-1">
        {isEditing ? (
          <Select
            value={editValues.status || ""}
            onValueChange={(value: string) =>
              setEditValues({ ...editValues, status: value as CourseStatus })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          // Харин харагдац горимд тухайн status-ыг card дотор харуулж байна.
          <Card
            className={`flex h-[45px] items-center justify-center border-2 font-semibold ${
              course.status === "ARCHIVED"
                ? "border-yellow-500 bg-yellow-300"
                : course.status === "PUBLISHED"
                  ? "border-green-500 bg-green-300"
                  : "border border-dashed border-zinc-800 bg-zinc-500 text-white"
            }`}
          >
            <CardHeader className="text-center text-lg">
              {course.status || "Unknown"}
            </CardHeader>
          </Card>
        )}

        <Card className="flex h-[45px] items-center justify-center bg-zinc-800 font-semibold text-white shadow-none">
          <CardHeader className="text-center text-lg">
            ₮{course.price?.amount || "0"}
          </CardHeader>
        </Card>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-1">
        <Button
          className="font-semibold"
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "destructive" : "outline"}
        >
          {isEditing ? (
            <p className="flex items-center gap-2">
              Cancel
              <CircleX />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              Edit
              <FilePenLine />
            </p>
          )}
        </Button>
        {isEditing && (
          <Button
            className="font-semibold"
            onClick={handleSave}
            variant="outline"
          >
            Save
            <CircleCheck />
          </Button>
        )}
      </div>
    </div>
  );
}
