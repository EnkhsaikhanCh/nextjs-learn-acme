import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpRight } from "lucide-react";

export const TotalRevenuewCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full bg-purple-50 p-1">
                <ArrowUpRight className="h-4 w-4 text-purple-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total revenue generated from course sales</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">$24,960</div>
        </div>
        <div className="mt-3 h-8">
          <div className="flex h-full items-end justify-between gap-1">
            {[40, 35, 45, 60, 50, 65, 75, 70, 80, 85].map((value, i) => (
              <div
                key={i}
                className="w-full rounded-sm bg-purple-100 transition-all hover:bg-purple-200"
                style={{ height: `${value}%` }}
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
