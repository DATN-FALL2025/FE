"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Building2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeadMatrixPage() {
  // Departments
  const departments = [
    { id: "1", code: "GO", name: "Ground Operations", description: "Ground handling and operations" },
    { id: "2", code: "CC", name: "Cabin Crew", description: "Flight attendant services" },
    { id: "3", code: "TAM", name: "Technical Aircraft Maintenance", description: "Aircraft maintenance and engineering" },
    { id: "4", code: "FC", name: "Flight Crew", description: "Pilots and flight officers" },
  ];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Document Matrix Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Review and approve document requirements for training positions by department
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Department Selection */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="w-5 h-5" />
              <span>Select Department</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a department to review its position-certificate matrix
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {departments.map((dept) => {
                const isSelected = selectedDepartmentId === dept.id;
                const colorMap: Record<string, string> = {
                  GO: "bg-blue-500",
                  CC: "bg-purple-500",
                  TAM: "bg-orange-500",
                  FC: "bg-red-500",
                };

                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartmentId(dept.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all hover:border-primary",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    )}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
                        colorMap[dept.code] || "bg-gray-500"
                      )}
                    >
                      {dept.code}
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Code: {dept.code}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix View */}
      {selectedDepartmentId ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {departments.find(d => d.id === selectedDepartmentId)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Document matrix review interface will be displayed here.<br />
                  Integration with API pending.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg bg-muted/20">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Department Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Please select a department above to view and review its<br />
                  position-certificate requirement matrix.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
