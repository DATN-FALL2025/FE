import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

const ReviewerBookingPageSkeleton = () => {
  return (
    <div className="2xl:flex-1 w-full">
      <Tabs defaultValue="offline" className="w-full">
        <TabsList>
          <TabsTrigger value="offline">
            <Skeleton className="h-6 w-40" />
          </TabsTrigger>
          <TabsTrigger value="online">
            <Skeleton className="h-6 w-40" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offline">
          <Shell>
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          </Shell>
        </TabsContent>
        <TabsContent value="online">
          <Shell>
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          </Shell>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewerBookingPageSkeleton;
