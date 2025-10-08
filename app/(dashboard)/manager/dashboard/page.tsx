"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";

export default function InputDocumentManagerDashboardPage() {
  const stats = [
    {
      label: "Pending Reviews",
      value: 156,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      urgent: true,
    },
    {
      label: "Approved Today",
      value: 42,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8 vs yesterday",
    },
    {
      label: "Rejected Today",
      value: 8,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-2 vs yesterday",
    },
    {
      label: "Approval Rate",
      value: "94%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+1.5% this week",
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      studentName: "Tôn Thiện Hoàng Hiệp",
      studentCode: "SE161662",
      documentType: "TOEIC Certificate",
      program: "Pilot Training",
      submittedAt: "10 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Trần Duy Khanh",
      studentCode: "SE173443",
      documentType: "Medical Certificate",
      program: "Pilot Training",
      submittedAt: "25 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      studentName: "Huỳnh Văn Tường",
      studentCode: "SE160853",
      documentType: "3x4 Photo",
      program: "Cabin Crew",
      submittedAt: "1 hour ago",
      status: "pending",
    },
  ];

  const programProgress = [
    { name: "Pilot Training", completed: 245, total: 342, percentage: 71.6 },
    { name: "Cabin Crew", completed: 198, total: 289, percentage: 68.5 },
    { name: "Aircraft Maintenance", completed: 156, total: 198, percentage: 78.8 },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Document Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Review and approve student document submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      {stat.change && (
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      )}
                      {stat.urgent && (
                        <p className="text-xs text-orange-600 font-medium">Requires attention</p>
                      )}
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Recent Submissions */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Recent Submissions</CardTitle>
                  <CardDescription className="text-base mt-1.5">
                    Latest document submissions for review
                  </CardDescription>
                </div>
                <Button size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{submission.studentName}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {submission.studentCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{submission.documentType}</span>
                      <span>•</span>
                      <span>{submission.program}</span>
                      <span>•</span>
                      <span>{submission.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Program Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Program Progress</CardTitle>
              <CardDescription className="text-base mt-1.5">
                Student completion by program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {programProgress.map((program, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{program.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {program.completed} / {program.total} students
                      </p>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {program.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={program.percentage}
                    className="h-2 [&>div]:bg-blue-500"
                  />
                  {index < programProgress.length - 1 && <div className="border-b pt-2" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

