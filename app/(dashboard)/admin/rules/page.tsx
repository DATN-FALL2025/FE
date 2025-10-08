"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Settings,
} from "lucide-react";

export default function RulesPage() {
  const rules = [
    {
      id: "1",
      name: "TOEIC Minimum Score",
      description: "Minimum TOEIC score requirement for pilot training programs",
      category: "requirement",
      value: "600",
      isActive: true,
      appliesTo: ["Pilot Training"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Medical Certificate Validity",
      description: "Maximum validity period for medical certificates",
      category: "validation",
      value: "6 months",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "Photo Specifications",
      description: "Standard photo requirements (3x4 cm, white background)",
      category: "validation",
      value: "3x4 cm, white bg",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-01-15",
    },
    {
      id: "4",
      name: "Guardian Consent Age",
      description: "Age threshold requiring guardian consent",
      category: "requirement",
      value: "< 18 years",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-01-15",
    },
    {
      id: "5",
      name: "File Size Limit - PDF",
      description: "Maximum file size for PDF documents",
      category: "validation",
      value: "5 MB",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-01-15",
    },
    {
      id: "6",
      name: "File Size Limit - Images",
      description: "Maximum file size for image files (JPG/PNG)",
      category: "validation",
      value: "1 MB",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-01-15",
    },
    {
      id: "7",
      name: "Document Resubmission Limit",
      description: "Maximum number of times a rejected document can be resubmitted",
      category: "workflow",
      value: "3 times",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-02-01",
    },
    {
      id: "8",
      name: "Auto-Rejection on Invalid Format",
      description: "Automatically reject documents with invalid file formats",
      category: "workflow",
      value: "Enabled",
      isActive: true,
      appliesTo: ["All Programs"],
      createdAt: "2024-02-01",
    },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "validation":
        return <Badge className="bg-blue-500">Validation</Badge>;
      case "requirement":
        return <Badge className="bg-purple-500">Requirement</Badge>;
      case "workflow":
        return <Badge className="bg-green-500">Workflow</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "validation":
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      case "requirement":
        return <AlertCircle className="w-5 h-5 text-purple-600" />;
      case "workflow":
        return <Settings className="w-5 h-5 text-green-600" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const validationRules = rules.filter(r => r.category === "validation");
  const requirementRules = rules.filter(r => r.category === "requirement");
  const workflowRules = rules.filter(r => r.category === "workflow");

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rule Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Configure validation rules and requirements
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Rules", value: rules.length, color: "text-blue-600" },
          { label: "Validation", value: validationRules.length, color: "text-purple-600" },
          { label: "Requirements", value: requirementRules.length, color: "text-green-600" },
          { label: "Workflow", value: workflowRules.length, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Validation Rules */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          Validation Rules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {validationRules.map((rule) => (
            <Card key={rule.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      {getCategoryBadge(rule.category)}
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                  <Switch checked={rule.isActive} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold mt-1">{rule.value}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Applies to: {rule.appliesTo.join(", ")}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Requirement Rules */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-purple-600" />
          Requirement Rules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requirementRules.map((rule) => (
            <Card key={rule.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      {getCategoryBadge(rule.category)}
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                  <Switch checked={rule.isActive} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold mt-1">{rule.value}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Applies to: {rule.appliesTo.join(", ")}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Rules */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-green-600" />
          Workflow Rules
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflowRules.map((rule) => (
            <Card key={rule.id} className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      {getCategoryBadge(rule.category)}
                    </div>
                    <CardDescription>{rule.description}</CardDescription>
                  </div>
                  <Switch checked={rule.isActive} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold mt-1">{rule.value}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Applies to: {rule.appliesTo.join(", ")}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

