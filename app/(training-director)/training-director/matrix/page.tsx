"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Target,
  Plus,
  Settings,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function TrainingDirectorMatrixPage() {
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
      label: "Document Matrices",
      value: 15,
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "All active",
    },
    {
      label: "Total Trainees",
      value: 254,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+18 this month",
    },
    {
      label: "Completion Rate",
      value: "89%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+4% vs last quarter",
    },
  ];

  const activeMatrices = [
    {
      id: 1,
      program: "Commercial Pilot License (CPL)",
      code: "CPL-2025",
      documents: 15,
      trainees: 85,
      instructors: 12,
      status: "active",
    },
    {
      id: 2,
      program: "Instrument Rating (IR)",
      code: "IR-2025",
      documents: 12,
      trainees: 62,
      instructors: 8,
      status: "active",
    },
    {
      id: 3,
      program: "Flight Instructor Certification",
      code: "FIC-2025",
      documents: 20,
      trainees: 28,
      instructors: 5,
      status: "active",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Training Program Matrices</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage training program requirements and document matrices
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create New Matrix
        </Button>
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
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
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
        {/* Left Column - Active Matrices */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Active Training Matrices</CardTitle>
                  <CardDescription className="text-base mt-1.5">
                    Currently running program document requirements
                  </CardDescription>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 text-white h-9 px-4">
                  {activeMatrices.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeMatrices.map((matrix) => (
                <div
                  key={matrix.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{matrix.program}</p>
                        <p className="text-sm text-muted-foreground font-mono">{matrix.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{matrix.documents} documents</span>
                      <span>•</span>
                      <span>{matrix.trainees} trainees</span>
                      <span>•</span>
                      <span>{matrix.instructors} instructors</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <FileCheck className="w-5 h-5" />
                View All Matrices
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Target className="w-5 h-5" />
                Training Programs
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Users className="w-5 h-5" />
                Instructor Management
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <LayoutDashboard className="w-5 h-5" />
                Reports & Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg font-bold">Program Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">12 active training programs</p>
                <p className="text-muted-foreground">
                  All matrices are configured and ready for trainee submissions.
                </p>
              </div>
              <Button className="w-full">View Programs</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
