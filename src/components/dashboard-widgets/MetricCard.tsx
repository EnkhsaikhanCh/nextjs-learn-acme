"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  valueFormatter?: (value: number) => string;
  indicatorColor?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
}

export const MetricCard = ({
  title,
  description,
  currentValue,
  targetValue,
  valueFormatter = (v) => v.toString(),
  indicatorColor = "blue",
}: MetricCardProps) => {
  const percent = Math.min(100, (currentValue / targetValue) * 100);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
  };

  const indicatorClassName = colorMap[indicatorColor] || "bg-blue-500";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-1 text-sm font-semibold">
          {valueFormatter(currentValue)}
        </p>
        <Progress
          value={percent}
          className="h-2"
          indicatorClassName={indicatorClassName}
        />
        <div className="mt-1 flex justify-between text-sm font-semibold">
          <p className="text-foreground">{targetValue} target</p>
          <p className="text-muted-foreground">
            {percent.toFixed(1)}% complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
