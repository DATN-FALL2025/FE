"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, AlertCircle, MoreVertical } from "lucide-react";
import { Position, CertificateType, MatrixRule } from "../types";
import { cn } from "@/lib/utils";

interface DocumentMatrixGridProps {
  positions: Position[];
  certificateTypes: CertificateType[];
  rules: MatrixRule[];
  onAddRule: (rule: Partial<MatrixRule>) => void;
  onEditRule: (rule: MatrixRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onAddPosition?: (position: Partial<Position>) => void;
  onAddCertificate?: (certificate: Partial<CertificateType>) => void;
  readOnly?: boolean;
  canEditStructure?: boolean;
}

export const DocumentMatrixGrid = ({
  positions,
  certificateTypes,
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onAddPosition,
  onAddCertificate,
  readOnly = false,
  canEditStructure = false,
}: DocumentMatrixGridProps) => {
  const [selectedCell, setSelectedCell] = useState<{
    positionId: string;
    certificateTypeId: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddPositionDialogOpen, setIsAddPositionDialogOpen] = useState(false);
  const [isAddCertificateDialogOpen, setIsAddCertificateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MatrixRule | null>(null);
  const [formData, setFormData] = useState<{
    status: "required" | "optional" | "not_required";
    notes: string;
  }>({
    status: "required",
    notes: "",
  });

  const [newPosition, setNewPosition] = useState({
    code: "",
    name: "",
    level: positions.length + 1,
    description: "",
  });

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    description: "",
    isRequired: false,
  });

  const getRuleForCell = (positionId: string, certificateTypeId: string) => {
    return rules.find(
      (rule) => rule.positionId === positionId && rule.certificateTypeId === certificateTypeId
    );
  };

  const handleOpenDialog = (positionId: string, certificateTypeId: string) => {
    if (readOnly) return;

    const existingRule = getRuleForCell(positionId, certificateTypeId);
    setSelectedCell({ positionId, certificateTypeId });

    if (existingRule) {
      setEditingRule(existingRule);
      setFormData({
        status: existingRule.status,
        notes: existingRule.notes || "",
      });
    } else {
      setEditingRule(null);
      setFormData({
        status: "required",
        notes: "",
      });
    }

    setIsDialogOpen(true);
  };

  const handleSaveRule = () => {
    if (!selectedCell) return;

    if (editingRule) {
      onEditRule({
        ...editingRule,
        status: formData.status,
        notes: formData.notes,
        updatedAt: new Date(),
      });
    } else {
      onAddRule({
        positionId: selectedCell.positionId,
        certificateTypeId: selectedCell.certificateTypeId,
        status: formData.status,
        notes: formData.notes,
      });
    }

    setIsDialogOpen(false);
    setSelectedCell(null);
    setEditingRule(null);
  };

  const handleDeleteRule = () => {
    if (editingRule) {
      onDeleteRule(editingRule.id);
      setIsDialogOpen(false);
      setSelectedCell(null);
      setEditingRule(null);
    }
  };

  const handleAddPosition = () => {
    if (onAddPosition && newPosition.code && newPosition.name) {
      onAddPosition(newPosition);
      setNewPosition({
        code: "",
        name: "",
        level: positions.length + 2,
        description: "",
      });
      setIsAddPositionDialogOpen(false);
    }
  };

  const handleAddCertificate = () => {
    if (onAddCertificate && newCertificate.name) {
      onAddCertificate(newCertificate);
      setNewCertificate({
        name: "",
        description: "",
        isRequired: false,
      });
      setIsAddCertificateDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "required":
        return <Badge className="bg-green-600 hover:bg-green-700">Required</Badge>;
      case "optional":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Optional</Badge>;
      case "not_required":
        return <Badge variant="outline">Not Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Document Matrix Configuration</CardTitle>
          <CardDescription className="text-base mt-1.5">
            Configure required documents for each position level
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <thead className="bg-muted/50">
                  <tr>
                    <th className="sticky left-0 z-20 bg-muted/50 p-4 text-left text-sm font-semibold w-[280px] border border-border h-[120px]">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Position / Certificate</span>
                      </div>
                    </th>
                    {certificateTypes.map((cert) => (
                      <th
                        key={cert.id}
                        className="p-4 text-center text-sm font-semibold w-[180px] border border-border h-[120px]"
                      >
                        <div className="space-y-2 flex flex-col items-center justify-center h-full">
                          <div className="font-semibold text-xs leading-tight line-clamp-2 px-2">{cert.name}</div>
                          {cert.isRequired && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </th>
                    ))}
                    {canEditStructure && onAddCertificate && (
                      <th className="p-4 text-center w-[80px] border border-border h-[120px] bg-muted/50">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsAddCertificateDialogOpen(true)}
                          className="h-10 w-10"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-background">
                  {positions.map((position) => (
                    <tr key={position.id} className="hover:bg-muted/10 transition-colors h-[110px]">
                      <td className="sticky left-0 z-10 bg-background p-4 font-medium border border-border w-[280px] h-[110px]">
                        <div className="flex items-start justify-between gap-3 h-full">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded flex-shrink-0">
                                {position.code}
                              </span>
                              <span className="font-semibold text-sm break-words leading-tight">{position.name}</span>
                            </div>
                            {position.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {position.description}
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </td>
                      {certificateTypes.map((cert) => {
                        const rule = getRuleForCell(position.id, cert.id);
                        return (
                          <td
                            key={`${position.id}-${cert.id}`}
                            className="p-4 text-center border border-border w-[180px] h-[110px]"
                          >
                            {rule ? (
                              <button
                                onClick={() => handleOpenDialog(position.id, cert.id)}
                                disabled={readOnly}
                                className={cn(
                                  "w-full rounded p-2 transition-all hover:bg-muted/50 h-full flex flex-col items-center justify-center gap-2",
                                  readOnly && "cursor-default"
                                )}
                              >
                                {getStatusBadge(rule.status)}
                                {rule.notes && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 px-2">
                                    {rule.notes}
                                  </p>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenDialog(position.id, cert.id)}
                                disabled={readOnly}
                                className={cn(
                                  "w-full rounded border-2 border-dashed border-muted-foreground/30 p-2 transition-all hover:border-primary hover:bg-primary/5 h-full flex flex-col items-center justify-center gap-2",
                                  readOnly && "cursor-default opacity-50"
                                )}
                              >
                                <Plus className="w-5 h-5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Add Rule</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                      {canEditStructure && onAddCertificate && (
                        <td className="p-4 border border-border w-[80px] h-[110px]"></td>
                      )}
                    </tr>
                  ))}
                  {canEditStructure && onAddPosition && (
                    <tr className="bg-muted/20 h-[80px]">
                      <td className="sticky left-0 z-10 bg-muted/20 p-4 border border-border w-[280px] h-[80px]">
                        <Button
                          variant="ghost"
                          onClick={() => setIsAddPositionDialogOpen(true)}
                          className="gap-2 text-muted-foreground hover:text-foreground h-full"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Add Row</span>
                        </Button>
                      </td>
                      {certificateTypes.map((cert) => (
                        <td key={`add-${cert.id}`} className="p-4 border border-border w-[180px] h-[80px] bg-muted/20"></td>
                      ))}
                      {canEditStructure && onAddCertificate && (
                        <td className="p-4 border border-border w-[80px] h-[80px] bg-muted/20"></td>
                      )}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Rule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Rule" : "Add Rule"}
            </DialogTitle>
            <DialogDescription>
              Configure the document requirement for this position and certificate combination.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Requirement Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span>Required</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="optional">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Optional</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="not_required">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span>Not Required</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any additional notes or requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            {formData.status === "required" && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900">Required Document</p>
                  <p className="text-green-700 mt-1">
                    Trainees must submit this document to complete their application.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {editingRule && (
              <Button
                variant="destructive"
                onClick={handleDeleteRule}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Rule
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? "Update Rule" : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Position Dialog */}
      <Dialog open={isAddPositionDialogOpen} onOpenChange={setIsAddPositionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Position</DialogTitle>
            <DialogDescription>
              Add a new position level to the matrix
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Position Code</Label>
              <Input
                placeholder="e.g., L5, L6"
                value={newPosition.code}
                onChange={(e) => setNewPosition({ ...newPosition, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Position Name</Label>
              <Input
                placeholder="e.g., Senior Manager"
                value={newPosition.name}
                onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                type="number"
                value={newPosition.level}
                onChange={(e) => setNewPosition({ ...newPosition, level: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Brief description of this position"
                value={newPosition.description}
                onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPositionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPosition}>Add Position</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Certificate Dialog */}
      <Dialog open={isAddCertificateDialogOpen} onOpenChange={setIsAddCertificateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Certificate</DialogTitle>
            <DialogDescription>
              Add a new certificate type to the matrix
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Certificate Name</Label>
              <Input
                placeholder="e.g., TOEIC Certificate"
                value={newCertificate.name}
                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Brief description of this certificate"
                value={newCertificate.description}
                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={newCertificate.isRequired}
                onChange={(e) => setNewCertificate({ ...newCertificate, isRequired: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="isRequired" className="cursor-pointer">
                Mark as required for all positions
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCertificateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCertificate}>Add Certificate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
