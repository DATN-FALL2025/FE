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
  User,
  Search,
  Eye,
  Mail,
  Phone,
  Award,
  BookOpen,
} from "lucide-react";

export default function TrainingDirectorInstructorsPage() {
  const instructors = [
    {
      id: "1",
      name: "Captain John Smith",
      email: "john.smith@idmawa.edu.vn",
      phone: "+84 123 456 789",
      specialization: "Flight Training",
      certifications: ["CPL", "IR", "MEP", "Instructor"],
      activeStudents: 12,
      totalHours: 245,
      rating: 4.8,
      status: "active",
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@idmawa.edu.vn",
      phone: "+84 123 456 790",
      specialization: "Ground School",
      certifications: ["PhD Aviation", "Instructor"],
      activeStudents: 28,
      totalHours: 186,
      rating: 4.9,
      status: "active",
    },
    {
      id: "3",
      name: "Captain Mike Chen",
      email: "mike.chen@idmawa.edu.vn",
      phone: "+84 123 456 791",
      specialization: "Simulator Training",
      certifications: ["ATPL", "Type Rating", "Instructor"],
      activeStudents: 8,
      totalHours: 312,
      rating: 4.7,
      status: "active",
    },
    {
      id: "4",
      name: "First Officer Emma Wilson",
      email: "emma.wilson@idmawa.edu.vn",
      phone: "+84 123 456 792",
      specialization: "Flight Training",
      certifications: ["CPL", "IR", "Instructor"],
      activeStudents: 6,
      totalHours: 128,
      rating: 4.6,
      status: "on-leave",
    },
  ];

  const getSpecializationBadge = (specialization: string) => {
    const colors: Record<string, string> = {
      "Flight Training": "bg-blue-500",
      "Ground School": "bg-green-500",
      "Simulator Training": "bg-purple-500",
      "Maintenance Training": "bg-orange-500",
    };
    return <Badge className={colors[specialization] || "bg-gray-500"}>{specialization}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-yellow-500">On Leave</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Instructor Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage instructors, assignments, and performance
          </p>
        </div>
        <Button className="gap-2">
          <User className="w-4 h-4" />
          Add Instructor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Instructors", value: instructors.length, color: "text-blue-600" },
          { label: "Active", value: instructors.filter(i => i.status === "active").length, color: "text-green-600" },
          { label: "Avg Rating", value: "4.8/5.0", color: "text-yellow-600" },
          { label: "Total Hours", value: instructors.reduce((sum, i) => sum + i.totalHours, 0), color: "text-purple-600" },
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
              <CardTitle className="text-xl font-bold">All Instructors</CardTitle>
              <CardDescription className="text-base mt-1.5">
                {instructors.length} instructors registered
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search instructors..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="flight">Flight Training</SelectItem>
                  <SelectItem value="ground">Ground School</SelectItem>
                  <SelectItem value="simulator">Simulator Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-blue-50 p-3 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{instructor.name}</h3>
                            {getStatusBadge(instructor.status)}
                          </div>
                          {getSpecializationBadge(instructor.specialization)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">{instructor.rating}/5.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div className="truncate">
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium truncate">{instructor.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{instructor.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Active Students</p>
                          <p className="font-medium">{instructor.activeStudents}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {instructor.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Total Training Hours: <span className="font-semibold text-foreground">{instructor.totalHours}h</span>
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Assign
                        </Button>
                      </div>
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
