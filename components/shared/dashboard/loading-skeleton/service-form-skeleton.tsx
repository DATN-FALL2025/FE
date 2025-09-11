"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceFormSkeleton = () => {
  return (
    <div>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div>
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div>
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
          <div>
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4 mt-4">
        <Skeleton className="h-10 w-24" />
        <button
          type="submit"
          className="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md h-10 w-32"
        >
          Tạo dịch vụ
        </button>
      </div>
    </div>
  );
};

export default ServiceFormSkeleton;
