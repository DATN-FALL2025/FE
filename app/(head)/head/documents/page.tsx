"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  FileText,
} from "lucide-react";

export default function HeadDocumentsPage() {
  const submissions = [
    {
      id: "1",
      studentName: "Tôn Thiện Hoàng Hiệp",
      studentCode: "SE161662",
      documentType: "TOEIC Certificate",
      submittedAt: new Date("2024-10-08T10:30:00"),
      status: "pending",
      fileSize: "1.2 MB",
      fileName: "toeic_SE161662.pdf",
    },
    {
      id: "2",
      studentName: "Trần Duy Khanh",
      studentCode: "SE173443",
      documentType: "Medical Certificate",
      submittedAt: new Date("2024-10-08T09:15:00"),
      status: "approved",
      fileSize: "2.4 MB",
      fileName: "medical_SE173443.pdf",
    },
  ];

  const pendingDocs = submissions.filter(s => s.status === "pending");
  const approvedDocs = submissions.filter(s => s.status === "approved");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Document Reviews</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Review department student submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Review", value: pendingDocs.length, color: "text-yellow-600" },
          { label: "Approved", value: approvedDocs.length, color: "text-green-600" },
          { label: "Total This Week", value: submissions.length, color: "text-blue-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingDocs.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedDocs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingDocs.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{doc.studentName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{doc.studentCode}</p>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      <p className="text-sm font-medium">{doc.documentType}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.fileSize}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedDocs.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{doc.studentName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{doc.studentCode}</p>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" />
                      <p className="text-sm font-medium">{doc.documentType}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

