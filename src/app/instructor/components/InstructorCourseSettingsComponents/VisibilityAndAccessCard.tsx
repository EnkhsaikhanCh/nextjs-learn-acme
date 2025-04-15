import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const VisibilityAndAcessCard = () => {
  return (
    <Card className="border-blue-100 dark:border-blue-900">
      <CardHeader className="rounded-t-md border-b border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/30">
        <CardTitle className="text-blue-800 dark:text-blue-200">
          Visibility & Access
        </CardTitle>
        <CardDescription className="dark:text-blue-300">
          Control who can see and access your course
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="visibility-status"
              className="text-base font-medium dark:text-blue-100"
            >
              Publication Status
            </Label>
            <Select defaultValue="published">
              <SelectTrigger id="visibility-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Draft courses are only visible to you
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end border-t bg-gray-50/50 px-6 py-4 dark:border-blue-900 dark:bg-blue-900/30">
        <Button>Save All Changes</Button>
      </CardFooter>
    </Card>
  );
};
