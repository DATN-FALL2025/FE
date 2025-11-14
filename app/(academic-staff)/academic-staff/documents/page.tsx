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
  FileText,
  Search,
  Eye,
  Download,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function AcademicStaffDocumentsPage() {
  const documents = [
    {
      id: "1",
      name: "Course Syllabus - Aviation Safety",
      category: "Course Materials",
      program: "Pilot Training",
      uploadedBy: "Dr. Nguyen Van A",
      uploadedAt: "2024-11-10",
      fileSize: "2.4 MB",
      status: "published",
    },
    {
      id: "2",
      name: "Exam Schedule - Fall 2025",
      category: "Academic Calendar",
      program: "All Programs",
      uploadedBy: "Academic Office",
      uploadedAt: "2024-11-08",
      fileSize: "1.2 MB",
      status: "published",
    },
    {
      id: "3",
      name: "Student Performance Report Q3",
      category: "Reports",
      program: "Cabin Crew",
      uploadedBy: "Dr. Tran Thi B",
      uploadedAt: "2024-11-05",
      fileSize: "3.8 MB",
      status: "draft",
    },
    {
      id: "4",
      name: "Curriculum Guidelines 2025",
      category: "Guidelines",
      program: "All Programs",
      uploadedBy: "Academic Committee",
      uploadedAt: "2024-11-01",
      fileSize: "5.2 MB",
      status: "published",
    },
  ];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Course Materials": "bg-blue-500",
      "Academic Calendar": "bg-green-500",
      "Reports": "bg-purple-500",
      "Guidelines": "bg-orange-500",
    };
    return <Badge className={colors[category] || "bg-gray-500"}>{category}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-500">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Academic Documents</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Course materials, syllabi, and academic resources
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Documents", value: documents.length, color: "text-blue-600" },
          { label: "Published", value: documents.filter(d => d.status === "published").length, color: "text-green-600" },
          { label: "Drafts", value: documents.filter(d => d.status === "draft").length, color: "text-yellow-600" },
          { label: "This Month", value: 3, color: "text-purple-600" },
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
              <CardTitle className="text-xl font-bold">All Documents</CardTitle>
              <CardDescription className="text-base mt-1.5">
                {documents.length} documents available
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search documents..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="course">Course Materials</SelectItem>
                  <SelectItem value="calendar">Academic Calendar</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="guidelines">Guidelines</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{doc.name}</h3>
                            {getStatusBadge(doc.status)}
                          </div>
                          {getCategoryBadge(doc.category)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-14">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {doc.program}
                        </span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>Uploaded by {doc.uploadedBy}</span>
                        <span>•</span>
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
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
