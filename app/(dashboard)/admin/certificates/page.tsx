"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function CertificatesPage() {
  const certificates = [
    {
      id: "1",
      name: "TOEIC Certificate",
      code: "TOEIC",
      issuingOrganization: "ETS (Educational Testing Service)",
      validityPeriod: "2 years",
      isRequired: true,
      minScore: 600,
      category: "Language Proficiency",
      applicableTo: ["Pilot Training"],
      isActive: true,
    },
    {
      id: "2",
      name: "IELTS Certificate",
      code: "IELTS",
      issuingOrganization: "British Council / IDP",
      validityPeriod: "2 years",
      isRequired: false,
      minScore: 6.0,
      category: "Language Proficiency",
      applicableTo: ["Pilot Training", "Cabin Crew"],
      isActive: true,
    },
    {
      id: "3",
      name: "Aviation Medical Certificate (Class 1)",
      code: "AMC-1",
      issuingOrganization: "Certified Aviation Medical Examiner",
      validityPeriod: "6 months",
      isRequired: true,
      category: "Medical",
      applicableTo: ["Pilot Training"],
      isActive: true,
    },
    {
      id: "4",
      name: "Aviation Medical Certificate (Class 2)",
      code: "AMC-2",
      issuingOrganization: "Certified Aviation Medical Examiner",
      validityPeriod: "12 months",
      isRequired: true,
      category: "Medical",
      applicableTo: ["Cabin Crew"],
      isActive: true,
    },
    {
      id: "5",
      name: "High School Diploma",
      code: "HSD",
      issuingOrganization: "Ministry of Education",
      validityPeriod: "Permanent",
      isRequired: true,
      category: "Academic",
      applicableTo: ["All Programs"],
      isActive: true,
    },
    {
      id: "6",
      name: "University Degree",
      code: "UNI",
      issuingOrganization: "Accredited University",
      validityPeriod: "Permanent",
      isRequired: false,
      category: "Academic",
      applicableTo: ["Pilot Training"],
      isActive: true,
    },
    {
      id: "7",
      name: "Professional License",
      code: "PRO-LIC",
      issuingOrganization: "Civil Aviation Authority",
      validityPeriod: "5 years",
      isRequired: false,
      category: "Professional",
      applicableTo: ["Aircraft Maintenance"],
      isActive: true,
    },
    {
      id: "8",
      name: "Security Clearance",
      code: "SEC-CLR",
      issuingOrganization: "National Security Agency",
      validityPeriod: "3 years",
      isRequired: true,
      category: "Security",
      applicableTo: ["All Programs"],
      isActive: true,
    },
  ];

  const categories = [...new Set(certificates.map(c => c.category))];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Language Proficiency":
        return "bg-blue-500";
      case "Medical":
        return "bg-red-500";
      case "Academic":
        return "bg-green-500";
      case "Professional":
        return "bg-purple-500";
      case "Security":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getValidityIcon = (validity: string) => {
    if (validity === "Permanent") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (validity.includes("month")) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-orange-600" />;
  };

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage certificate types and requirements
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add Certificate Type
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Certificates", value: certificates.length, color: "text-blue-600" },
          { label: "Required", value: certificates.filter(c => c.isRequired).length, color: "text-red-600" },
          { label: "Optional", value: certificates.filter(c => !c.isRequired).length, color: "text-green-600" },
          { label: "Categories", value: categories.length, color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificates by Category */}
      {categories.map((category) => {
        const categoryCerts = certificates.filter(c => c.category === category);
        return (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className={`w-6 h-6 ${getCategoryColor(category)} text-white rounded p-1`} />
              {category}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryCerts.map((cert) => (
                <Card key={cert.id} className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          {cert.isRequired ? (
                            <Badge className="bg-red-500">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                          <Badge variant="secondary" className="font-mono text-xs">
                            {cert.code}
                          </Badge>
                        </div>
                        <CardDescription>{cert.issuingOrganization}</CardDescription>
                      </div>
                      <Switch checked={cert.isActive} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {getValidityIcon(cert.validityPeriod)}
                          <p className="text-xs text-muted-foreground">Validity Period</p>
                        </div>
                        <p className="font-semibold">{cert.validityPeriod}</p>
                      </div>
                      {cert.minScore && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Minimum Score</p>
                          <p className="font-semibold">{cert.minScore}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">Applicable To</p>
                      <div className="flex flex-wrap gap-1">
                        {cert.applicableTo.map((program, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                      </div>
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
        );
      })}
    </div>
  );
}

