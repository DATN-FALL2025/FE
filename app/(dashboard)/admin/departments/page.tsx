"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DepartmentsPage() {
  const departments = [
    {
      id: "1",
      name: "Pilot Training",
      code: "PT",
      description: "Commercial and Private Pilot License programs",
      headOfDepartment: "Capt. John Smith",
      totalPrograms: 5,
      totalStudents: 342,
      activeStudents: 328,
      completionRate: 95.9,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Cabin Crew Training",
      code: "CC",
      description: "Flight attendant and cabin service training",
      headOfDepartment: "Ms. Sarah Johnson",
      totalPrograms: 3,
      totalStudents: 289,
      activeStudents: 276,
      completionRate: 92.4,
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "Aircraft Maintenance",
      code: "AM",
      description: "Technical maintenance and engineering programs",
      headOfDepartment: "Eng. Michael Chen",
      totalPrograms: 4,
      totalStudents: 198,
      activeStudents: 189,
      completionRate: 88.7,
      color: "bg-orange-500",
    },
    {
      id: "4",
      name: "Ground Operations",
      code: "GO",
      description: "Airport operations and ground handling",
      headOfDepartment: "Mr. David Wilson",
      totalPrograms: 2,
      totalStudents: 156,
      activeStudents: 148,
      completionRate: 90.3,
      color: "bg-green-500",
    },
  ];

  const totalStats = {
    departments: departments.length,
    programs: departments.reduce((sum, d) => sum + d.totalPrograms, 0),
    students: departments.reduce((sum, d) => sum + d.totalStudents, 0),
    avgCompletion: (departments.reduce((sum, d) => sum + d.completionRate, 0) / departments.length).toFixed(1),
  };

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage academy departments and their programs
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add Department
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Departments", value: totalStats.departments, icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50" },
          { label: "Training Programs", value: totalStats.programs, icon: BookOpen, color: "text-green-600", bgColor: "bg-green-50" },
          { label: "Total Students", value: totalStats.students, icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
          { label: "Avg Completion", value: `${totalStats.avgCompletion}%`, icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
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

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${dept.color} p-3 rounded-lg`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{dept.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Code: {dept.code}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Department
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      View Students
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">{dept.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Programs</p>
                  <p className="text-2xl font-bold mt-1">{dept.totalPrograms}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold mt-1">{dept.totalStudents}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-sm font-bold text-primary">{dept.completionRate}%</p>
                </div>
                <Progress value={dept.completionRate} className="h-2 [&>div]:bg-primary" />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Head: {dept.headOfDepartment}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">View Details</Button>
                <Button className="flex-1">Manage Programs</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

