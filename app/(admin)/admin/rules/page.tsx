"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  FileText,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function RulesPage() {
  const documents = [
    {
      id: "1",
      name: "Safety Procedures Manual",
      type: "Manual",
      department: "Ground Operations",
      departmentCode: "GO",
      ruleCount: 5,
    },
    {
      id: "2",
      name: "Emergency Response Guide",
      type: "Guide",
      department: "Cabin Crew",
      departmentCode: "CC",
      ruleCount: 3,
    },
    {
      id: "3",
      name: "Maintenance Checklist",
      type: "Checklist",
      department: "Technical and Maintenance",
      departmentCode: "TAM",
      ruleCount: 7,
    },
    {
      id: "4",
      name: "Flight Operations Handbook",
      type: "Handbook",
      department: "Flight Crew",
      departmentCode: "FC",
      ruleCount: 4,
    },
  ];

  const rulesByDocument: Record<string, any[]> = {
    "1": [
      { id: "1", position: "Ground Operations Level 1", positionCode: "GO-L1", status: "Required", department: "GO" },
      { id: "2", position: "Ground Operations Level 2", positionCode: "GO-L2", status: "Required", department: "GO" },
      { id: "3", position: "Ground Operations Level 3", positionCode: "GO-L3", status: "Optional", department: "GO" },
      { id: "4", position: "Ground Operations Level 4", positionCode: "GO-L4", status: "Optional", department: "GO" },
      { id: "5", position: "Cabin Crew Level 1", positionCode: "CC-L1", status: "Optional", department: "CC" },
    ],
    "2": [
      { id: "6", position: "Cabin Crew Level 1", positionCode: "CC-L1", status: "Required", department: "CC" },
      { id: "7", position: "Cabin Crew Level 2", positionCode: "CC-L2", status: "Required", department: "CC" },
      { id: "8", position: "Cabin Crew Level 3", positionCode: "CC-L3", status: "Optional", department: "CC" },
    ],
    "3": [
      { id: "9", position: "Technical and Maintenance Level 1", positionCode: "TAM-L1", status: "Required", department: "TAM" },
      { id: "10", position: "Technical and Maintenance Level 2", positionCode: "TAM-L2", status: "Required", department: "TAM" },
      { id: "11", position: "Technical and Maintenance Level 3", positionCode: "TAM-L3", status: "Required", department: "TAM" },
      { id: "12", position: "Technical and Maintenance Level 4", positionCode: "TAM-L4", status: "Optional", department: "TAM" },
      { id: "13", position: "Flight Crew Level 1", positionCode: "FC-L1", status: "Optional", department: "FC" },
      { id: "14", position: "Ground Operations Level 1", positionCode: "GO-L1", status: "Optional", department: "GO" },
      { id: "15", position: "Cabin Crew Level 1", positionCode: "CC-L1", status: "Optional", department: "CC" },
    ],
    "4": [
      { id: "16", position: "Flight Crew Level 1", positionCode: "FC-L1", status: "Required", department: "FC" },
      { id: "17", position: "Flight Crew Level 2", positionCode: "FC-L2", status: "Required", department: "FC" },
      { id: "18", position: "Flight Crew Level 3", positionCode: "FC-L3", status: "Required", department: "FC" },
      { id: "19", position: "Flight Crew Level 4", positionCode: "FC-L4", status: "Optional", department: "FC" },
    ],
  };

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId);
  const rules = selectedDocumentId ? rulesByDocument[selectedDocumentId] || [] : [];

  const totalRules = Object.values(rulesByDocument).reduce((sum, rules) => sum + rules.length, 0);

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rule Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Configure document access rules for positions
          </p>
        </div>
        {selectedDocumentId && (
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Rule
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRules}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With rules configured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(rulesByDocument).reduce(
                (sum, rules) => sum + rules.filter((r) => r.status === "Required").length,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mandatory access rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Step 1: Select Document */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select a Document</CardTitle>
          <CardDescription>Choose a document to configure its access rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isSelected = selectedDocumentId === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocumentId(doc.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:border-primary text-left",
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-background"
                  )}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.department} • {doc.ruleCount} rules
                    </p>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Configure Rules */}
      {selectedDocumentId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step 2: Configure Rules for &quot;{selectedDocument?.name}&quot;</CardTitle>
                <CardDescription className="mt-1">
                  Define which positions require or can optionally access this document
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {rules.length} rules
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Position Code</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Access Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No rules configured for this document
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.position}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.positionCode}</Badge>
                      </TableCell>
                      <TableCell>{rule.department}</TableCell>
                      <TableCell>
                        <Badge className={rule.status === "Required" ? "bg-green-600" : "bg-blue-600"}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Rule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {rule.status === "Required" ? "Change to Optional" : "Change to Required"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Rule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {!selectedDocumentId && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">How to manage rules:</p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Select a document from the list above</li>
                  <li>View existing rules for that document</li>
                  <li>Add new rules or modify existing ones</li>
                  <li>Set whether the document is Required or Optional for each position</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
