"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Search,
  Eye,
  Edit,
  Users,
  Calendar,
  Award,
} from "lucide-react";

export default function TrainingDirectorProgramsPage() {
  const programs = [
    {
      id: "1",
      name: "Commercial Pilot License (CPL)",
      code: "CPL-2025",
      category: "Flight Training",
      duration: "12 months",
      students: 85,
      instructors: 12,
      startDate: "2025-01-15",
      status: "active",
      completion: 45,
    },
    {
      id: "2",
      name: "Instrument Rating (IR)",
      code: "IR-2025",
      category: "Advanced Training",
      duration: "6 months",
      students: 62,
      instructors: 8,
      startDate: "2025-02-01",
      status: "active",
      completion: 68,
    },
    {
      id: "3",
      name: "Multi-Engine Rating",
      code: "MER-2025",
      category: "Advanced Training",
      duration: "3 months",
      students: 34,
      instructors: 6,
      startDate: "2025-03-01",
      status: "active",
      completion: 22,
    },
    {
      id: "4",
      name: "Private Pilot License (PPL)",
      code: "PPL-2024",
      category: "Basic Training",
      duration: "8 months",
      students: 45,
      instructors: 10,
      startDate: "2024-06-01",
      status: "completed",
      completion: 100,
    },
  ];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Flight Training": "bg-blue-500",
      "Advanced Training": "bg-purple-500",
      "Basic Training": "bg-green-500",
      "Ground School": "bg-orange-500",
    };
    return <Badge className={colors[category] || "bg-gray-500"}>{category}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "planning":
        return <Badge className="bg-yellow-500">Planning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Training Programs</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage all training programs and their progress
          </p>
        </div>
        <Button className="gap-2">
          <Target className="w-4 h-4" />
          Create Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Programs", value: programs.length, color: "text-blue-600" },
          { label: "Active", value: programs.filter(p => p.status === "active").length, color: "text-green-600" },
          { label: "Total Students", value: programs.reduce((sum, p) => sum + p.students, 0), color: "text-purple-600" },
          { label: "Total Instructors", value: programs.reduce((sum, p) => sum + p.instructors, 0), color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">All Programs</CardTitle>
              <CardDescription className="text-base mt-1.5">
                {programs.length} training programs
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search programs..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="flight">Flight Training</SelectItem>
                  <SelectItem value="advanced">Advanced Training</SelectItem>
                  <SelectItem value="basic">Basic Training</SelectItem>
                  <SelectItem value="ground">Ground School</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programs.map((program) => (
              <Card key={program.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            {getStatusBadge(program.status)}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mb-2">
                            {program.code}
                          </p>
                          {getCategoryBadge(program.category)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Students</p>
                          <p className="font-semibold">{program.students}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Instructors</p>
                          <p className="font-semibold">{program.instructors}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-semibold">{program.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Completion</p>
                          <p className="font-semibold">{program.completion}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Program
                      </Button>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 flex-1">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
