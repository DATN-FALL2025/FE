"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, BookOpen } from "lucide-react";
import { Department } from "../../types";

interface DepartmentOverviewProps {
  departments: Department[];
}

export const DepartmentOverview = ({ departments }: DepartmentOverviewProps) => {
  const totalStudents = departments.reduce((sum, dept) => sum + dept.totalStudents, 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Department Overview</CardTitle>
        <CardDescription className="text-base mt-1.5">
          Academy departments and student distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {departments.map((dept, index) => {
          const studentPercentage = (dept.totalStudents / totalStudents) * 100;
          
          return (
            <div key={dept.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">{dept.code}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">
                  {dept.totalStudents} students
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {dept.totalPrograms} programs
                  </span>
                  <span className="font-medium">
                    {studentPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={studentPercentage} className="h-2 [&>div]:bg-blue-500" />
              </div>

              {index < departments.length - 1 && (
                <div className="border-b pt-3" />
              )}
            </div>
          );
        })}

        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Total Students</span>
            </div>
            <span className="text-2xl font-bold text-primary">{totalStudents}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

