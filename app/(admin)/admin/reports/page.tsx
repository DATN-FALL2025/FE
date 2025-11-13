"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  FileCheck,
  Calendar,
  Filter,
} from "lucide-react";

export default function ReportsPage() {
  const reportTemplates = [
    {
      id: "1",
      name: "Student Submission Report",
      description: "Overview of student document submission status",
      category: "Submissions",
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      lastGenerated: "2024-10-08",
    },
    {
      id: "2",
      name: "Approval Rate Analysis",
      description: "Document approval and rejection statistics",
      category: "Analytics",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      lastGenerated: "2024-10-07",
    },
    {
      id: "3",
      name: "Department Performance",
      description: "Compliance and completion rates by department",
      category: "Departments",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      lastGenerated: "2024-10-06",
    },
    {
      id: "4",
      name: "User Activity Report",
      description: "System usage and user activity statistics",
      category: "Users",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      lastGenerated: "2024-10-08",
    },
    {
      id: "5",
      name: "Deadline Compliance",
      description: "Track students meeting submission deadlines",
      category: "Compliance",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-50",
      lastGenerated: "2024-10-05",
    },
    {
      id: "6",
      name: "Document Type Analysis",
      description: "Breakdown by document type and approval status",
      category: "Analytics",
      icon: FileText,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      lastGenerated: "2024-10-07",
    },
  ];

  const recentReports = [
    {
      id: "1",
      name: "Monthly Submission Report - September 2024",
      generatedBy: "Admin",
      generatedAt: "2024-10-01 14:30",
      size: "2.4 MB",
      format: "PDF",
    },
    {
      id: "2",
      name: "Approval Rate Analysis - Q3 2024",
      generatedBy: "Admin",
      generatedAt: "2024-10-01 10:15",
      size: "1.8 MB",
      format: "Excel",
    },
    {
      id: "3",
      name: "Department Performance - September 2024",
      generatedBy: "Head of Dept",
      generatedAt: "2024-09-30 16:45",
      size: "3.1 MB",
      format: "PDF",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Generate and download system reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Report Templates", value: reportTemplates.length, color: "text-blue-600" },
          { label: "Generated Today", value: 3, color: "text-green-600" },
          { label: "This Month", value: 42, color: "text-purple-600" },
          { label: "Total Reports", value: 256, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`${template.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${template.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1.5">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Last: {template.lastGenerated}
                    </span>
                  </div>
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

      {/* Recent Reports */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Generated Reports</CardTitle>
                <CardDescription className="text-base mt-1.5">
                  Recently generated reports ready for download
                </CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="pdf">PDF Only</SelectItem>
                  <SelectItem value="excel">Excel Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{report.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>By {report.generatedBy}</span>
                        <span>•</span>
                        <span>{report.generatedAt}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{report.format}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

