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
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export default function ManagerDocumentsPage() {
  const documents = [
    {
      id: "1",
      name: "TOEIC Certificate",
      category: "Language Proficiency",
      totalSubmissions: 145,
      approved: 128,
      rejected: 12,
      pending: 5,
      avgProcessingTime: "2.5 hours",
      status: "active",
    },
    {
      id: "2",
      name: "Medical Certificate",
      category: "Medical",
      totalSubmissions: 156,
      approved: 142,
      rejected: 8,
      pending: 6,
      avgProcessingTime: "1.8 hours",
      status: "active",
    },
    {
      id: "3",
      name: "High School Diploma",
      category: "Academic",
      totalSubmissions: 189,
      approved: 175,
      rejected: 10,
      pending: 4,
      avgProcessingTime: "3.2 hours",
      status: "active",
    },
    {
      id: "4",
      name: "3x4 Photo",
      category: "Identity",
      totalSubmissions: 198,
      approved: 165,
      rejected: 28,
      pending: 5,
      avgProcessingTime: "1.2 hours",
      status: "active",
    },
  ];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Language Proficiency": "bg-blue-500",
      "Medical": "bg-red-500",
      "Academic": "bg-green-500",
      "Identity": "bg-purple-500",
    };
    return <Badge className={colors[category] || "bg-gray-500"}>{category}</Badge>;
  };

  const getApprovalRate = (approved: number, total: number) => {
    return ((approved / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Overview of all document types and their approval statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Document Types", value: documents.length, color: "text-blue-600" },
          { label: "Total Submissions", value: documents.reduce((sum, d) => sum + d.totalSubmissions, 0), color: "text-green-600" },
          { label: "Approved", value: documents.reduce((sum, d) => sum + d.approved, 0), color: "text-purple-600" },
          { label: "Pending", value: documents.reduce((sum, d) => sum + d.pending, 0), color: "text-orange-600" },
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
              <CardTitle className="text-xl font-bold">All Document Types</CardTitle>
              <CardDescription className="text-base mt-1.5">
                {documents.length} document types configured
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
                  <SelectItem value="language">Language Proficiency</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="identity">Identity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="border shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{doc.name}</h3>
                        </div>
                        {getCategoryBadge(doc.category)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <p className="text-xs text-green-600 font-medium">Approved</p>
                        </div>
                        <p className="text-xl font-bold text-green-700">{doc.approved}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <p className="text-xs text-red-600 font-medium">Rejected</p>
                        </div>
                        <p className="text-xl font-bold text-red-700">{doc.rejected}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-yellow-600" />
                          <p className="text-xs text-yellow-600 font-medium">Pending</p>
                        </div>
                        <p className="text-xl font-bold text-yellow-700">{doc.pending}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Approval Rate</p>
                        <p className="text-sm font-bold text-primary">
                          {getApprovalRate(doc.approved, doc.totalSubmissions)}%
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                        <p className="text-sm font-semibold">{doc.avgProcessingTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export
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

