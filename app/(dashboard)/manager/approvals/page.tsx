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
  AlertCircle,
} from "lucide-react";

export default function ManagerApprovalsPage() {
  const submissions = [
    {
      id: "1",
      studentName: "Tôn Thiện Hoàng Hiệp",
      studentCode: "SE161662",
      documentType: "TOEIC Certificate",
      program: "Pilot Training",
      submittedAt: new Date("2024-10-08T10:30:00"),
      status: "pending",
      priority: "high",
      fileSize: "1.2 MB",
      fileName: "toeic_SE161662.pdf",
    },
    {
      id: "2",
      studentName: "Trần Duy Khanh",
      studentCode: "SE173443",
      documentType: "Medical Certificate",
      program: "Pilot Training",
      submittedAt: new Date("2024-10-08T09:15:00"),
      status: "pending",
      priority: "medium",
      fileSize: "2.4 MB",
      fileName: "medical_SE173443.pdf",
    },
    {
      id: "3",
      studentName: "Huỳnh Văn Tường",
      studentCode: "SE160853",
      documentType: "ID Card",
      program: "Cabin Crew",
      submittedAt: new Date("2024-10-07T14:20:00"),
      status: "approved",
      priority: "low",
      fileSize: "0.8 MB",
      fileName: "id_SE160853.pdf",
      reviewedAt: new Date("2024-10-07T15:00:00"),
      reviewedBy: "Manager",
    },
    {
      id: "4",
      studentName: "Nguyễn Thanh Hải",
      studentCode: "SE160636",
      documentType: "3x4 Photo",
      program: "Aircraft Maintenance",
      submittedAt: new Date("2024-10-07T11:30:00"),
      status: "rejected",
      priority: "low",
      fileSize: "0.5 MB",
      fileName: "photo_SE160636.jpg",
      reviewedAt: new Date("2024-10-07T12:00:00"),
      reviewedBy: "Manager",
      rejectionReason: "Photo background must be white, current photo has blue background",
    },
  ];

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const approvedSubmissions = submissions.filter(s => s.status === "approved");
  const rejectedSubmissions = submissions.filter(s => s.status === "rejected");

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
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

  const renderSubmissionCard = (submission: typeof submissions[0]) => (
    <Card key={submission.id} className="border-0 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{submission.studentName}</p>
                {getStatusBadge(submission.status)}
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {submission.studentCode}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {getTimeAgo(submission.submittedAt)}
            </span>
          </div>

          {submission.priority && submission.status === "pending" && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              {getPriorityBadge(submission.priority)}
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">{submission.documentType}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{submission.fileName}</span>
              <span>{submission.fileSize}</span>
            </div>
            <p className="text-sm text-muted-foreground">Program: {submission.program}</p>
          </div>

          {submission.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Rejection Reason:</span> {submission.rejectionReason}
              </p>
            </div>
          )}

          {submission.reviewedBy && (
            <p className="text-sm text-muted-foreground">
              Reviewed by {submission.reviewedBy} • {getTimeAgo(submission.reviewedAt!)}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {submission.status === "pending" && (
              <>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Document Approvals</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Review and approve student document submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Review", value: pendingSubmissions.length, color: "text-yellow-600" },
          { label: "Approved", value: approvedSubmissions.length, color: "text-green-600" },
          { label: "Rejected", value: rejectedSubmissions.length, color: "text-red-600" },
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
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rejectedSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

