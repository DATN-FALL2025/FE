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

export default function AcademicStaffApprovalsPage() {
  const submissions = [
    {
      id: "1",
      studentName: "Tôn Thiện Hoàng Hiệp",
      studentCode: "SE161662",
      requestType: "Course Exemption",
      course: "Aviation Mathematics",
      submittedAt: new Date("2024-11-14T10:30:00"),
      status: "pending",
      priority: "high",
      reason: "Equivalent course completed at previous institution",
    },
    {
      id: "2",
      studentName: "Trần Duy Khanh",
      studentCode: "SE173443",
      requestType: "Grade Appeal",
      course: "Flight Operations",
      submittedAt: new Date("2024-11-14T09:15:00"),
      status: "pending",
      priority: "medium",
      reason: "Request for re-evaluation of final exam",
    },
    {
      id: "3",
      studentName: "Huỳnh Văn Tường",
      studentCode: "SE160853",
      requestType: "Course Registration",
      course: "Advanced Navigation",
      submittedAt: new Date("2024-11-13T14:20:00"),
      status: "approved",
      priority: "low",
      reviewedAt: new Date("2024-11-13T15:00:00"),
      reviewedBy: "Academic Staff",
    },
    {
      id: "4",
      studentName: "Nguyễn Thanh Hải",
      studentCode: "SE160636",
      requestType: "Schedule Change",
      course: "Aircraft Systems",
      submittedAt: new Date("2024-11-13T11:30:00"),
      status: "rejected",
      priority: "low",
      reviewedAt: new Date("2024-11-13T12:00:00"),
      reviewedBy: "Academic Staff",
      rejectionReason: "Course already at full capacity, no available slots",
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
              <p className="text-sm font-medium">{submission.requestType}</p>
            </div>
            <p className="text-sm text-muted-foreground">Course: {submission.course}</p>
            <p className="text-sm text-muted-foreground">Reason: {submission.reason}</p>
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
        <h1 className="text-4xl font-bold tracking-tight">Student Request Approvals</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Review and approve student academic requests
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
