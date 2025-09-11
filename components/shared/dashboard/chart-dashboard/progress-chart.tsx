import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, YAxis, XAxis, LabelList } from "recharts";

interface ProgressChartProps {
    currentYearData: any,
    previousYearData: any,
}

const ProgressChart = ({ currentYearData, previousYearData }: ProgressChartProps) => {
  return (
    <Card className="max-w-xs">
      <CardHeader>
        <CardTitle>Progress</CardTitle>
        <CardDescription>
          Youre averaging more steps a day this year than last year.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <YearlyProgress year={currentYearData.year} steps={currentYearData.steps} />
        <YearlyProgress year={previousYearData.year} steps={previousYearData.steps} isMuted />
      </CardContent>
    </Card>
  );
};

interface YearlyProgressProps {
    year: any,
    steps: any,
    isMuted?: any,
}

const YearlyProgress = ({ year, steps, isMuted = false }: YearlyProgressProps) => {
  return (
    <div className="grid auto-rows-min gap-2">
      <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
        {steps.toLocaleString()}
        <span className="text-sm font-normal text-muted-foreground">
          steps/day
        </span>
      </div>
      <ChartContainer
        config={{
          steps: {
            label: "Steps",
            color: isMuted ? "hsl(var(--muted))" : "hsl(var(--chart-1))",
          },
        }}
        className="aspect-auto h-[32px] w-full"
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
          data={[{ date: year, steps: steps }]}
        >
          <Bar
            dataKey="steps"
            fill="var(--color-steps)"
            radius={4}
            barSize={32}
          >
            <LabelList
              position="insideLeft"
              dataKey="date"
              offset={8}
              fontSize={12}
              fill={isMuted ? "hsl(var(--muted-foreground))" : "white"}
            />
          </Bar>
          <YAxis dataKey="date" type="category" tickCount={1} hide />
          <XAxis dataKey="steps" type="number" hide />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ProgressChart;