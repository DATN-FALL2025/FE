"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Users,
  Award,
  TrendingUp,
  Download,
  Filter,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function TrainingDirectorDashboardPage() {
  const stats = [
    {
      label: "Active Programs",
      value: 12,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 this quarter",
    },
    {
      label: "Total Instructors",
      value: 45,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "3 new this month",
    },
    {
      label: "Training Hours",
      value: "2,845",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+12% vs last month",
    },
    {
      label: "Completion Rate",
      value: "89%",
      icon: Award,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+4% this quarter",
    },
  ];

  const activePrograms = [
    {
      id: 1,
      programName: "Commercial Pilot License (CPL)",
      programCode: "CPL-2025",
      students: 85,
      instructors: 12,
      startDate: "Jan 2025",
      endDate: "Dec 2025",
      progress: 45,
      status: "in-progress",
    },
    {
      id: 2,
      programName: "Instrument Rating (IR)",
      programCode: "IR-2025",
      students: 62,
      instructors: 8,
      startDate: "Feb 2025",
      endDate: "Aug 2025",
      progress: 68,
      status: "in-progress",
    },
    {
      id: 3,
      programName: "Flight Instructor Certification",
      programCode: "FIC-2025",
      students: 28,
      instructors: 5,
      startDate: "Mar 2025",
      endDate: "Sep 2025",
      progress: 35,
      status: "in-progress",
    },
  ];

  const instructorPerformance = [
    { name: "Flight Training", instructors: 18, avgRating: 4.7, totalHours: 1245 },
    { name: "Ground School", instructors: 15, avgRating: 4.5, totalHours: 856 },
    { name: "Simulator Training", instructors: 12, avgRating: 4.8, totalHours: 744 },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Training Director Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Oversee training programs, instructors, and performance metrics
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
        {/* Left Column - Active Programs */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Active Training Programs</CardTitle>
                  <CardDescription className="text-base mt-1.5">
                    Currently running programs and their progress
                  </CardDescription>
                </div>
                <Button size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePrograms.map((program) => (
                <div
                  key={program.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{program.programName}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {program.programCode}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500">In Progress</Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{program.students} students</span>
                    <span>•</span>
                    <span>{program.instructors} instructors</span>
                    <span>•</span>
                    <span>{program.startDate} - {program.endDate}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2 [&>div]:bg-blue-500" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 flex-1">
                      Manage Program
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Instructor Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Instructor Performance</CardTitle>
              <CardDescription className="text-base mt-1.5">
                Performance metrics by training category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {instructorPerformance.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.instructors} instructors
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg Rating</span>
                      <span className="font-semibold text-yellow-600">
                        ⭐ {category.avgRating}/5.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Hours</span>
                      <span className="font-semibold">{category.totalHours}h</span>
                    </div>
                  </div>
                  {index < instructorPerformance.length - 1 && <div className="border-b pt-2" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
