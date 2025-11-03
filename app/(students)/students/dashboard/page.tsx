"use client";

import { useStudentData } from "@/features/students/hooks/use-student-data";
import { ProgressOverview } from "@/features/students/components/dashboard/progress-overview";
import { StudentInfoCard } from "@/features/students/components/dashboard/student-info-card";
import { RecentActivity } from "@/features/students/components/dashboard/recent-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentDashboardPage() {
  const { student, documents, progress, loading } = useStudentData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!student || !progress) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Failed to load student data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Welcome back, {student.fullName.split(" ").slice(-1)[0]}! Track your document submission progress.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Progress & Activity */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <ProgressOverview progress={progress} />
          <RecentActivity documents={documents} />
        </div>

        {/* Right Column - Student Info */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
          <StudentInfoCard student={student} />
        </div>
      </div>
    </div>
  );
}

