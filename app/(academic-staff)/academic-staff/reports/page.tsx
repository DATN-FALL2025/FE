"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  GraduationCap,
  Users,
} from "lucide-react";

export default function AcademicStaffReportsPage() {
  const reports = [
    {
      id: "1",
      name: "Student Performance Analytics",
      description: "Detailed analysis of student grades and progress",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      lastGenerated: "2024-11-12",
    },
    {
      id: "2",
      name: "Course Completion Report",
      description: "Track course completion rates by program",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      lastGenerated: "2024-11-10",
    },
    {
      id: "3",
      name: "Enrollment Statistics",
      description: "Student enrollment trends and demographics",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      lastGenerated: "2024-11-08",
    },
    {
      id: "4",
      name: "Academic Performance Trends",
      description: "Long-term performance trends by semester",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      lastGenerated: "2024-11-05",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Academic Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Generate reports on student performance and academic progress
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Report Templates", value: reports.length, color: "text-blue-600" },
          { label: "Generated Today", value: 1, color: "text-green-600" },
          { label: "This Month", value: 18, color: "text-purple-600" },
          { label: "Total", value: 245, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className={`${report.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription className="mt-1.5">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Last generated: {report.lastGenerated}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
