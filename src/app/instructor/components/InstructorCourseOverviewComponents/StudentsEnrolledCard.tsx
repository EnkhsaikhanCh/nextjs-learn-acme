import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users } from "lucide-react";

export const StudentsEnrolledCard = ({
  totalEnrollment,
}: {
  totalEnrollment: number;
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full bg-blue-50 p-1">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total number of students enrolled in this course</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{totalEnrollment}</div>
        </div>
        <div className="mt-3 h-8">
          <div className="flex h-full items-end justify-between gap-1">
            {[35, 45, 40, 50, 60, 55, 65, 70, 75, 80].map((value, i) => (
              <div
                key={i}
                className="w-full rounded-sm bg-blue-100 transition-all hover:bg-blue-200"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
