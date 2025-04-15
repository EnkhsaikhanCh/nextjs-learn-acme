import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";

export const AverageRatingCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full bg-amber-50 p-1">
                <ThumbsUp className="h-4 w-4 text-amber-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average student rating out of 5 stars</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">4.8/5.0</div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={cn(
                "h-2 flex-1 rounded-sm transition-all",
                star <= 4 ? "bg-amber-400" : "bg-amber-200",
              )}
            ></div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-5 text-[10px] text-gray-500">
          <div>1★</div>
          <div>2★</div>
          <div>3★</div>
          <div>4★</div>
          <div>5★</div>
        </div>
      </CardContent>
    </Card>
  );
};
