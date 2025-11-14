"use client";

import { useStudentData } from "@/features/trainees/hooks/use-student-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Edit,
  Save,
} from "lucide-react";
import { useState } from "react";

export default function StudentProfilePage() {
  const { student, loading } = useStudentData();
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px]" />
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your personal information and settings
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Profile Picture & Quick Info */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary/10">
                <AvatarImage src={student.avatar} alt={student.fullName} />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {getInitials(student.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{student.fullName}</h2>
                <p className="text-lg text-muted-foreground font-mono mt-1">
                  {student.studentCode}
                </p>
              </div>

              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                {student.trainingRole}
              </Badge>

              {isEditing && (
                <Button variant="outline" className="w-full">
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Enrollment</span>
                <Badge variant="outline">
                  {student.enrollmentDate.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={student.fullName}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCode">Student Code</Label>
                  <Input
                    id="studentCode"
                    value={student.studentCode}
                    disabled
                    className="bg-muted font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={student.email}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={student.phone}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Your program and course details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="program"
                      value={student.program}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingRole">Training Role</Label>
                  <Input
                    id="trainingRole"
                    value={student.trainingRole}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="courseName"
                      value={student.courseName}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    value={student.courseCode}
                    disabled
                    className="bg-muted font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="enrollmentDate"
                      value={student.enrollmentDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

