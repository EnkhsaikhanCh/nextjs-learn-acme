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
import { CircleCheck, CircleX, FilePenLine } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Course {
  _id?: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  duration?: number | null;
  createdBy?: string | null;
  categories?: (string | null)[] | null;
  tags?: (string | null)[] | null;
  status?: string | null;
  thumbnail?: string | null;
}

interface CourseInfoProps {
  course: Course; // Анх утгууд
  onEdit: (updatedFields: Partial<Course>) => void;
}

export function CourseInfo({ course, onEdit }: CourseInfoProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValues, setEditValues] = useState<Partial<Course>>(course);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!editValues.title || editValues.title.trim() === "") {
      setError("Title is required");
      return;
    }

    setError(null); // Clear any previous errors
    onEdit(editValues);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Image
        src={course.thumbnail || "/placeholder.svg?height=100&width=200"}
        alt={course.title || "Course image"}
        width={1000}
        height={1000}
        className="h-[300px] w-full rounded-lg object-cover"
      />
      <Card className="bg-zinc-800 text-white shadow-none">
        <CardHeader className="text-2xl font-bold text-white">
          {isEditing ? (
            <Input
              type="text"
              value={editValues.title || ""}
              onChange={(e) =>
                setEditValues({ ...editValues, title: e.target.value })
              }
              className="w-full border-b-2 border-white bg-transparent text-white"
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
                setEditValues({
                  ...editValues,
                  description: e.target.value,
                })
              }
              className="w-full rounded border border-gray-500 bg-transparent p-2 text-white"
            />
          ) : (
            course.description || "No description available"
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-1">
        <Card
          className={`flex h-[45px] items-center justify-center border-2 font-semibold ${
            course.status === "archived"
              ? "border-yellow-500 bg-yellow-300"
              : course.status === "active"
                ? "border-green-500 bg-green-300"
                : "bg-zinc-800"
          }`}
        >
          {isEditing ? (
            <Select
              onValueChange={(value) =>
                setEditValues({ ...editValues, status: value })
              }
              value={editValues.status || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <CardHeader className="text-center text-lg">
              {course.status || "Unknown"}
            </CardHeader>
          )}
        </Card>
        <Card className="flex h-[45px] items-center justify-center bg-zinc-800 font-semibold text-white shadow-none">
          {isEditing ? (
            <Input
              type="number"
              value={editValues.price || 0}
              onChange={(e) =>
                setEditValues({
                  ...editValues,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full bg-transparent text-center text-white"
              placeholder="Enter price"
            />
          ) : (
            <CardHeader className="text-center text-lg">
              ₮{course.price || "0"}
            </CardHeader>
          )}
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
