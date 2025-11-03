"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { TraineeInfo } from "../../types";

interface TraineeInfoCardProps {
  trainee: TraineeInfo;
}

export const TraineeInfoCard = ({ trainee }: TraineeInfoCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Pilot":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "Cabin Crew":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case "Maintenance":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Trainee Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src={trainee.avatar} alt={trainee.fullName} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {getInitials(trainee.fullName)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-xl font-bold">{trainee.fullName}</h3>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              {trainee.traineeCode}
            </p>
          </div>

          <Badge className={getRoleBadgeColor(trainee.trainingRole)}>
            {trainee.trainingRole}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{trainee.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>{trainee.phone}</span>
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-start gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{trainee.program}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground text-xs">Course</p>
              <p className="font-medium">{trainee.courseName}</p>
              <p className="text-muted-foreground text-xs mt-1">
                Code: {trainee.courseCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Enrolled</p>
              <p className="font-medium">
                {trainee.enrollmentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
