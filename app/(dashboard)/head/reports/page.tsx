"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  FileCheck,
} from "lucide-react";

export default function HeadReportsPage() {
  const reports = [
    {
      id: "1",
      name: "Department Student Report",
      description: "Student enrollment and progress in Pilot Training",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      lastGenerated: "2024-10-08",
    },
    {
      id: "2",
      name: "Document Submission Status",
      description: "Department-wide document submission analytics",
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      lastGenerated: "2024-10-07",
    },
    {
      id: "3",
      name: "Completion Rate Analysis",
      description: "Student completion rates and trends",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      lastGenerated: "2024-10-06",
    },
    {
      id: "4",
      name: "Monthly Performance",
      description: "Department performance metrics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      lastGenerated: "2024-10-05",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Department Reports</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Generate and download department reports
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Available Reports", value: reports.length, color: "text-blue-600" },
          { label: "Generated Today", value: 2, color: "text-green-600" },
          { label: "This Month", value: 18, color: "text-purple-600" },
          { label: "Total", value: 124, color: "text-orange-600" },
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

