"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function AcademicStaffDashboardPage() {
  const stats = [
    {
      label: "Total Students",
      value: 342,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12 this month",
    },
    {
      label: "Active Courses",
      value: 18,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "2 starting soon",
    },
    {
      label: "Avg Performance",
      value: "87%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3% vs last term",
    },
    {
      label: "Graduation Rate",
      value: "92%",
      icon: GraduationCap,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+5% this year",
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      courseName: "Aviation Safety Management",
      courseCode: "ASM301",
      date: "Nov 15, 2025",
      time: "09:00 AM",
      room: "Building A - Room 301",
      students: 28,
      status: "scheduled",
    },
    {
      id: 2,
      courseName: "Flight Operations & Procedures",
      courseCode: "FOP401",
      date: "Nov 15, 2025",
      time: "02:00 PM",
      room: "Building B - Room 205",
      students: 32,
      status: "scheduled",
    },
    {
      id: 3,
      courseName: "Aircraft Systems & Maintenance",
      courseCode: "ASM201",
      date: "Nov 16, 2025",
      time: "10:30 AM",
      room: "Building A - Room 102",
      students: 25,
      status: "scheduled",
    },
  ];

  const programProgress = [
    { name: "Pilot Training", enrolled: 245, graduated: 189, percentage: 77.1 },
    { name: "Cabin Crew", enrolled: 198, graduated: 156, percentage: 78.8 },
    { name: "Aircraft Maintenance", enrolled: 156, graduated: 132, percentage: 84.6 },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Academic Staff Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage courses, student performance, and academic programs
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
        {/* Left Column - Upcoming Classes */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Upcoming Classes</CardTitle>
                  <CardDescription className="text-base mt-1.5">
                    Your scheduled classes for this week
                  </CardDescription>
                </div>
                <Button size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{classItem.courseName}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {classItem.courseCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {classItem.date}
                      </span>
                      <span>•</span>
                      <span>{classItem.time}</span>
                      <span>•</span>
                      <span>{classItem.room}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {classItem.students} students enrolled
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Start Class
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
                Student graduation rates by program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {programProgress.map((program, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{program.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {program.graduated} / {program.enrolled} graduated
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
