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
  indicatorColor?: string; // e.g. "blue", "green", "red"
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
  const colorClass = `bg-${indicatorColor}-500`;

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
          indicatorClassName={colorClass}
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
