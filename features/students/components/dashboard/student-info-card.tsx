"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { StudentInfo } from "../../types";

interface StudentInfoCardProps {
  student: StudentInfo;
}

export const StudentInfoCard = ({ student }: StudentInfoCardProps) => {
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
        <CardTitle className="text-xl font-bold">Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src={student.avatar} alt={student.fullName} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {getInitials(student.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-2xl font-bold">{student.fullName}</h3>
            <p className="text-lg text-muted-foreground font-mono">
              {student.studentCode}
            </p>
            <Badge className={getRoleBadgeColor(student.trainingRole)}>
              {student.trainingRole}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm break-all">{student.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">{student.phone}</span>
          </div>
        </div>

        {/* Course Information */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Program</p>
              <p className="text-sm font-medium">{student.program}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Course</p>
              <p className="text-sm font-medium">{student.courseName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Code: {student.courseCode}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Enrollment Date</p>
              <p className="text-sm font-medium">
                {student.enrollmentDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

