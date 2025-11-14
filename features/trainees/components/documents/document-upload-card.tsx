"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Document } from "../../types";
import { cn } from "@/lib/utils";

interface DocumentUploadCardProps {
  document: Document;
  onUpload?: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  onDownload?: () => void;
}

export const DocumentUploadCard = ({
  document,
  onUpload,
  onDelete,
  onDownload,
}: DocumentUploadCardProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toUpperCase();
    if (!fileExtension || !document.allowedFormats.includes(fileExtension)) {
      alert(
        `Invalid file format. Allowed formats: ${document.allowedFormats.join(", ")}`
      );
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > document.maxSize) {
      alert(
        `File size exceeds limit. Maximum size: ${document.maxSize}MB`
      );
      return;
    }

    // Simulate upload with progress
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      if (onUpload) {
        await onUpload(file);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      clearInterval(interval);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const getStatusConfig = () => {
    switch (document.status) {
      case "approved":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          badge: <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>,
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200",
          badge: <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>,
        };
      case "submitted":
      case "pending_review":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 border-yellow-200",
          badge: <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Review</Badge>,
        };
      default:
        return {
          icon: FileText,
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          badge: <Badge variant="outline">Not Submitted</Badge>,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const canUpload = document.status === "not_submitted" || document.status === "rejected";

  return (
    <Card className={cn("border-0 shadow-md transition-all hover:shadow-lg", statusConfig.bgColor)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{document.name}</CardTitle>
              {document.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">
              Formats: {document.allowedFormats.join(", ")} • Max: {document.maxSize}MB
              {document.validityPeriod && ` • Valid for: ${document.validityPeriod}`}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {statusConfig.badge}
            <StatusIcon className={cn("w-6 h-6", statusConfig.color)} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Conditional Rules */}
        {document.conditionalRules && document.conditionalRules.length > 0 && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-sm">
              <span className="font-semibold">Requirements:</span>{" "}
              {document.conditionalRules.join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {/* Rejection Reason */}
        {document.status === "rejected" && document.rejectionReason && (
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription className="text-sm">
              <span className="font-semibold">Rejection Reason:</span> {document.rejectionReason}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        {canUpload && (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-all",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-60"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={document.allowedFormats.map(f => `.${f.toLowerCase()}`).join(",")}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-medium mb-1">
                  {uploading ? "Uploading..." : "Drop file here or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {document.allowedFormats.join(", ")} (max {document.maxSize}MB)
                </p>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                </div>
              )}

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </Button>
            </div>
          </div>
        )}

        {/* File Info (When Uploaded) */}
        {document.fileName && (
          <div className="bg-background border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{document.fileName}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {document.fileSize && (
                    <span>{document.fileSize.toFixed(2)} MB</span>
                  )}
                  {document.uploadedAt && (
                    <span>
                      Uploaded: {document.uploadedAt.toLocaleDateString()}
                    </span>
                  )}
                  {document.reviewedAt && (
                    <span>
                      Reviewed: {document.reviewedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onDownload && (
                <Button size="sm" variant="outline" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              {document.status === "rejected" && onDelete && (
                <Button size="sm" variant="outline" onClick={onDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
              {document.status === "rejected" && (
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resubmit
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

