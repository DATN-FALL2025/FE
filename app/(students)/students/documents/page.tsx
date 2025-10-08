"use client";

import { useState } from "react";
import { useStudentData } from "@/features/students/hooks/use-student-data";
import { DocumentUploadCard } from "@/features/students/components/documents/document-upload-card";
import { DocumentFilter, FilterState } from "@/features/students/components/documents/document-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle } from "lucide-react";
import { Document } from "@/features/students/types";

export default function StudentDocumentsPage() {
  const { documents, progress, loading } = useStudentData();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    required: "all",
  });

  const handleUpload = async (file: File) => {
    // Simulate upload
    console.log("Uploading file:", file.name);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Upload complete");
  };

  const handleDelete = async () => {
    console.log("Deleting file");
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleDownload = () => {
    console.log("Downloading file");
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    // Search filter
    if (
      filters.search &&
      !doc.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && doc.status !== filters.status) {
      return false;
    }

    // Required filter
    if (filters.required === "required" && !doc.required) {
      return false;
    }
    if (filters.required === "optional" && doc.required) {
      return false;
    }

    return true;
  });

  // Separate required and optional
  const requiredDocs = filteredDocuments.filter((doc) => doc.required);
  const optionalDocs = filteredDocuments.filter((doc) => !doc.required);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Upload and manage your admission documents
        </p>
      </div>

      {/* Progress Summary */}
      {progress && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Overall Progress
                  </p>
                  <p className="text-2xl font-bold mt-1 text-orange-500">
                    {progress.completionPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    Documents Status
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-green-500">
                      {progress.approvedDocuments} Approved
                    </Badge>
                    <Badge className="bg-yellow-500">
                      {progress.pendingDocuments} Pending
                    </Badge>
                    {progress.rejectedDocuments > 0 && (
                      <Badge className="bg-red-500">
                        {progress.rejectedDocuments} Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Progress value={progress.completionPercentage} className="h-2 [&>div]:bg-orange-500" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {progress.approvedDocuments} of {progress.totalDocuments} completed
                </span>
                <span className="font-medium">
                  {progress.daysRemaining} days remaining
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <DocumentFilter onFilterChange={setFilters} />
        </CardContent>
      </Card>

      {/* Documents Grid - Required */}
      {requiredDocs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Required Documents</h2>
            <Badge variant="destructive">{requiredDocs.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {requiredDocs.map((doc) => (
              <DocumentUploadCard
                key={doc.id}
                document={doc}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents Grid - Optional */}
      {optionalDocs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Optional Documents</h2>
            <Badge variant="outline">{optionalDocs.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {optionalDocs.map((doc) => (
              <DocumentUploadCard
                key={doc.id}
                document={doc}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredDocuments.length === 0 && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No documents match your filters. Try adjusting your search criteria.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

