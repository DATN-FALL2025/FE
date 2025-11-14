"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, FileText, AlertCircle } from "lucide-react";
import { SubmissionProgress } from "../../types";

interface ProgressOverviewProps {
  progress: SubmissionProgress;
}

export const ProgressOverview = ({ progress }: ProgressOverviewProps) => {
  const stats = [
    {
      label: "Total Documents",
      value: progress.totalDocuments,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Approved",
      value: progress.approvedDocuments,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Review",
      value: progress.pendingDocuments,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Rejected",
      value: progress.rejectedDocuments,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const getDeadlineStatus = () => {
    if (progress.daysRemaining <= 7) {
      return { 
        color: "bg-red-500 hover:bg-red-600", 
        text: "Urgent",
        variant: "destructive" as const 
      };
    } else if (progress.daysRemaining <= 14) {
      return { 
        color: "bg-yellow-500 hover:bg-yellow-600", 
        text: "Soon",
        variant: "default" as const
      };
    }
    return { 
      color: "bg-orange-500 hover:bg-orange-600", 
      text: "On Track",
      variant: "default" as const
    };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-2xl font-bold">Document Submission Progress</CardTitle>
              <CardDescription className="text-base mt-1.5 text-muted-foreground">
                Track your admission document completion status
              </CardDescription>
            </div>
            <Badge className={`${deadlineStatus.color} text-white h-9 px-5 text-sm font-medium`}>
              {deadlineStatus.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Overall Completion
              </span>
              <span className="text-2xl font-bold text-orange-500">
                {progress.completionPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={progress.completionPercentage} className="h-3 [&>div]:bg-orange-500" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {progress.approvedDocuments} of {progress.totalDocuments} documents approved
              </span>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">
                  {progress.daysRemaining} days remaining
                </span>
              </div>
            </div>
          </div>

          {/* Deadline Info */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submission Deadline</p>
                <p className="text-lg font-semibold mt-1">
                  {progress.deadline.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

