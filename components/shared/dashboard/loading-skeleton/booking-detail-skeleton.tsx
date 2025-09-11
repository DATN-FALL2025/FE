import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/shared/custom-ui/shell";

const ReviewerBookingDetailPageSkeleton = () => {
  return (
    <div className="p-6">
      <Shell>
        <Card className="animate-pulse">
          <CardHeader className="space-y-4">
            <CardTitle>
              <Skeleton className="h-6 w-48 bg-muted dark:bg-muted/40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
              </div>
              <div>
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
              </div>
            </div>
            <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
              </div>
              <div>
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
                <Skeleton className="h-10 w-full bg-muted dark:bg-muted/40 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-20 w-full bg-muted dark:bg-muted/40" />
              <div className="flex items-center justify-end gap-4">
                <Skeleton className="h-10 w-24 bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-24 bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-24 bg-muted dark:bg-muted/40" />
                <Skeleton className="h-10 w-24 bg-muted dark:bg-muted/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Shell>
    </div>
  );
};

export default ReviewerBookingDetailPageSkeleton;