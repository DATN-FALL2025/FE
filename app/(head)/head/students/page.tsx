"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";

export default function HeadStudentsPage() {
  const students = [
    {
      id: "1",
      name: "Tôn Thiện Hoàng Hiệp",
      studentCode: "SE161662",
      email: "hieptthse161662@fpt.edu.vn",
      phone: "+84 123 456 789",
      program: "Pilot Training - Commercial License",
      enrollmentDate: "2024-09-01",
      status: "active",
      completionRate: 85,
      submittedDocuments: 10,
      totalDocuments: 12,
    },
    {
      id: "2",
      name: "Trần Duy Khanh",
      studentCode: "SE173443",
      email: "khanhtdse173443@fpt.edu.vn",
      phone: "+84 987 654 321",
      program: "Pilot Training - Private License",
      enrollmentDate: "2024-09-01",
      status: "active",
      completionRate: 75,
      submittedDocuments: 9,
      totalDocuments: 12,
    },
    {
      id: "3",
      name: "Nguyễn Thanh Hải",
      studentCode: "SE160636",
      email: "hainthse160636@fpt.edu.vn",
      phone: "+84 555 666 777",
      program: "Pilot Training - Commercial License",
      enrollmentDate: "2024-09-05",
      status: "active",
      completionRate: 92,
      submittedDocuments: 11,
      totalDocuments: 12,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Department Students</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Pilot Training Department
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: students.length, color: "text-blue-600" },
          { label: "Active", value: students.filter(s => s.status === "active").length, color: "text-green-600" },
          { label: "Avg Completion", value: "84%", color: "text-purple-600" },
          { label: "Pending Approvals", value: 5, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">All Students</CardTitle>
              <CardDescription className="text-base mt-1.5">
                {students.length} students in your department
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="commercial">Commercial License</SelectItem>
                  <SelectItem value="private">Private License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/avatars/${student.id}.jpg`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            {getStatusBadge(student.status)}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            {student.studentCode}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{student.program}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{student.phone}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Enrolled: {student.enrollmentDate}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Document Submission Progress</span>
                        <span className="text-muted-foreground">
                          {student.submittedDocuments}/{student.totalDocuments} submitted
                        </span>
                      </div>
                      <Progress value={student.completionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {student.completionRate}% complete
                      </p>
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

