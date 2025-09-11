import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

interface ServiceAnalyticCardProps {
  title: string;
  value: number;
  variant?: "up" | "down";
  increaseValue?: number;
}

const AnalyticCard = ({
  title,
  value,
  variant,
  increaseValue,
}: ServiceAnalyticCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";

  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";

  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full bg-muted/40">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-bold text-gray-800 dark:text-gray-100 overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <span
              className={cn(increaseValueColor, "truncate text-base font-bold")}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticCard;
