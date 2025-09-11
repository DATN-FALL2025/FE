import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, Rectangle } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ActiveEnergyChart {
  energyData: any;
}

const ActiveEnergyChart = ({ energyData }: ActiveEnergyChart) => {
  return (
    <Card className="max-w-xs">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Active Energy</CardTitle>
        <CardDescription>
          Youre burning an average of 754 calories per day. Good job!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
          1,254
          <span className="text-sm font-normal text-muted-foreground">
            kcal/day
          </span>
        </div>
        <ChartContainer
          config={{
            steps: {
              label: "Steps",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={energyData}
          >
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActiveEnergyChart;
