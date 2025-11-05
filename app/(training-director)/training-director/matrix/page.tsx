"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  Building2,
  AlertCircle,
} from "lucide-react";
import { DocumentMatrixGrid } from "@/features/document-matrix/components/document-matrix-grid";
import { Department, Position, CertificateType, MatrixRule } from "@/features/document-matrix/types";
import { cn } from "@/lib/utils";

export default function DocumentMatrixPage() {
  // Departments
  const departments: Department[] = [
    { id: "1", code: "GO", name: "Ground Operations", description: "Ground handling and operations" },
    { id: "2", code: "CC", name: "Cabin Crew", description: "Flight attendant services" },
    { id: "3", code: "TAM", name: "Technical Aircraft Maintenance", description: "Aircraft maintenance and engineering" },
    { id: "4", code: "FC", name: "Flight Crew", description: "Pilots and flight officers" },
  ];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  // Certificate Types (Documents) - Common across all departments
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([
    {
      id: "1",
      name: "CCDC",
      description: "Civil aviation crew declaration certificate",
      isRequired: false,
    },
    {
      id: "2",
      name: "Criminal record / Aviation security card",
      description: "Background check and security clearance",
      isRequired: true,
    },
    {
      id: "3",
      name: "High school / College / University diploma",
      description: "Educational qualification certificate",
      isRequired: true,
    },
    {
      id: "4",
      name: "Three 3x4 cm photos (wearing red vest/T-shirt)",
      description: "Identification photos in uniform",
      isRequired: true,
    },
    {
      id: "5",
      name: "Aircraft type difference training certificate (A319/A320/A330)",
      description: "CF56/V2500/LEAP-1A or equivalent certification",
      isRequired: false,
    },
    {
      id: "6",
      name: "TOEIC Certificate",
      description: "English proficiency certificate",
      isRequired: false,
    },
    {
      id: "7",
      name: "Medical Certificate",
      description: "Health examination certificate",
      isRequired: true,
    },
  ]);

  // Positions by Department
  const [allPositions, setAllPositions] = useState<Position[]>([
    // Ground Operations (GO)
    { id: "go1", code: "L1", name: "Ground Staff Level 1", level: 1, departmentId: "1", description: "Entry-level ground operations staff" },
    { id: "go2", code: "L2", name: "Ground Staff Level 2", level: 2, departmentId: "1", description: "Intermediate ground operations staff" },
    { id: "go3", code: "L3", name: "Ground Operations Supervisor", level: 3, departmentId: "1", description: "Supervisory role in ground operations" },
    { id: "go4", code: "L4", name: "Ground Operations Manager", level: 4, departmentId: "1", description: "Management role in ground operations" },

    // Cabin Crew (CC)
    { id: "cc1", code: "L1", name: "Junior Cabin Crew", level: 1, departmentId: "2", description: "Entry-level flight attendant" },
    { id: "cc2", code: "L2", name: "Senior Cabin Crew", level: 2, departmentId: "2", description: "Experienced flight attendant" },
    { id: "cc3", code: "L3", name: "Cabin Crew Supervisor", level: 3, departmentId: "2", description: "Lead flight attendant" },
    { id: "cc4", code: "L4", name: "Cabin Service Director", level: 4, departmentId: "2", description: "Senior cabin crew manager" },

    // Technical Aircraft Maintenance (TAM)
    { id: "tam1", code: "L1", name: "Junior Technician", level: 1, departmentId: "3", description: "Entry-level maintenance technician" },
    { id: "tam2", code: "L2", name: "Aircraft Technician", level: 2, departmentId: "3", description: "Qualified maintenance technician" },
    { id: "tam3", code: "L3", name: "Senior Technician", level: 3, departmentId: "3", description: "Experienced maintenance specialist" },
    { id: "tam4", code: "L4", name: "Maintenance Engineer", level: 4, departmentId: "3", description: "Licensed aircraft engineer" },

    // Flight Crew (FC)
    { id: "fc1", code: "L1", name: "Second Officer", level: 1, departmentId: "4", description: "Entry-level pilot" },
    { id: "fc2", code: "L2", name: "First Officer", level: 2, departmentId: "4", description: "Co-pilot" },
    { id: "fc3", code: "L3", name: "Captain", level: 3, departmentId: "4", description: "Aircraft commander" },
    { id: "fc4", code: "L4", name: "Senior Captain", level: 4, departmentId: "4", description: "Senior pilot and instructor" },
  ]);

  // Rules - Matrix configuration
  const [allRules, setAllRules] = useState<MatrixRule[]>([]);

  // Filter data by selected department
  const selectedDepartment = departments.find((d) => d.id === selectedDepartmentId);
  const positions = allPositions.filter((p) => p.departmentId === selectedDepartmentId);
  const rules = allRules.filter((r) => r.departmentId === selectedDepartmentId);

  const handleAddRule = (rule: Partial<MatrixRule>) => {
    if (!selectedDepartmentId) return;

    const newRule: MatrixRule = {
      id: Date.now().toString(),
      positionId: rule.positionId!,
      certificateTypeId: rule.certificateTypeId!,
      departmentId: selectedDepartmentId,
      status: rule.status || "required",
      notes: rule.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAllRules([...allRules, newRule]);
  };

  const handleEditRule = (rule: MatrixRule) => {
    setAllRules(allRules.map((r) => (r.id === rule.id ? rule : r)));
  };

  const handleDeleteRule = (ruleId: string) => {
    setAllRules(allRules.filter((r) => r.id !== ruleId));
  };

  const handleAddPosition = (position: Partial<Position>) => {
    if (!selectedDepartmentId) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      code: position.code!,
      name: position.name!,
      level: position.level || positions.length + 1,
      departmentId: selectedDepartmentId,
      description: position.description,
    };
    setAllPositions([...allPositions, newPosition]);
  };

  const handleAddCertificate = (certificate: Partial<CertificateType>) => {
    const newCertificate: CertificateType = {
      id: Date.now().toString(),
      name: certificate.name!,
      description: certificate.description,
      isRequired: certificate.isRequired,
    };
    setCertificateTypes([...certificateTypes, newCertificate]);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Document Matrix Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Configure document requirements for training positions by department
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
              Choose a department to manage its position-certificate matrix
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
        <DocumentMatrixGrid
          positions={positions}
          certificateTypes={certificateTypes}
          rules={rules}
          onAddRule={handleAddRule}
          onEditRule={handleEditRule}
          onDeleteRule={handleDeleteRule}
          onAddPosition={handleAddPosition}
          onAddCertificate={handleAddCertificate}
          readOnly={true}
          canEditStructure={true}
        />
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
                  Please select a department above to view and manage its<br />
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
