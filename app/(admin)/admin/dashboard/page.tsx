"use client";

import { useAdminData } from "@/features/admin/hooks/use-admin-data";
import { StatsOverview } from "@/features/admin/components/dashboard/stats-overview";
import { PendingApprovals } from "@/features/admin/components/dashboard/pending-approvals";
import { DepartmentOverview } from "@/features/admin/components/dashboard/department-overview";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { stats, recentSubmissions, departments, loading } = useAdminData();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-base">
          System overview and management console
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Pending Approvals */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <PendingApprovals submissions={recentSubmissions} />
        </div>

        {/* Right Column - Department Overview */}
        <div className="lg:col-span-2">
          <DepartmentOverview departments={departments} />
        </div>
      </div>
    </div>
  );
}

