"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Building2,
  AlertCircle,
} from "lucide-react";
import { DocumentMatrixGrid } from "@/features/document-matrix/components/document-matrix-grid";
import { Department, Position, CertificateType, MatrixRule } from "@/features/document-matrix/types";

export default function HeadDocumentMatrixPage() {
  // Mock: Head of Department for Ground Operations (GO)
  const userDepartment: Department = {
    id: "1",
    code: "GO",
    name: "Ground Operations",
    description: "Ground handling and operations",
  };

  // Certificate Types (Documents) - Same as training director
  const certificateTypes: CertificateType[] = [
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
  ];

  // Positions for user's department (Ground Operations)
  const positions: Position[] = [
    { id: "go1", code: "L1", name: "Ground Staff Level 1", level: 1, departmentId: "1", description: "Entry-level ground operations staff" },
    { id: "go2", code: "L2", name: "Ground Staff Level 2", level: 2, departmentId: "1", description: "Intermediate ground operations staff" },
    { id: "go3", code: "L3", name: "Ground Operations Supervisor", level: 3, departmentId: "1", description: "Supervisory role in ground operations" },
    { id: "go4", code: "L4", name: "Ground Operations Manager", level: 4, departmentId: "1", description: "Management role in ground operations" },
  ];

  // Rules for department
  const [rules, setRules] = useState<MatrixRule[]>([]);

  const handleAddRule = (rule: Partial<MatrixRule>) => {
    const newRule: MatrixRule = {
      id: Date.now().toString(),
      positionId: rule.positionId!,
      certificateTypeId: rule.certificateTypeId!,
      departmentId: userDepartment.id,
      status: rule.status || "required",
      notes: rule.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRules([...rules, newRule]);
  };

  const handleEditRule = (rule: MatrixRule) => {
    setRules(rules.map((r) => (r.id === rule.id ? rule : r)));
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Document Matrix - {userDepartment.name}</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage document requirements for your department positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Department Info Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="outline" className="font-mono font-semibold">
                  {userDepartment.code}
                </Badge>
                <p className="font-semibold text-blue-900">{userDepartment.name}</p>
              </div>
              <p className="text-sm text-blue-700">
                {userDepartment.description}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                You can edit rules for positions in your department. Contact Training Director to add/remove positions or certificates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix View */}
      <DocumentMatrixGrid
        positions={positions}
        certificateTypes={certificateTypes}
        rules={rules}
        onAddRule={handleAddRule}
        onEditRule={handleEditRule}
        onDeleteRule={handleDeleteRule}
        readOnly={false}
        canEditStructure={false}
      />
    </div>
  );
}
