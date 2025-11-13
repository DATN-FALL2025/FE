"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function StudentDocumentsPage() {
  const [selectedPosition, setSelectedPosition] = useState("driver");
  const [loading, setLoading] = useState(false);

  // Document list based on screenshot
  const documents = [
    { id: 1, name: "Sơ yếu lý lịch", required: true },
    { id: 2, name: "Giấy khám sức khỏe", required: true },
    { id: 3, name: "Bằng lái xe B2", required: true },
    { id: 4, name: "Giấy xác nhận an toàn giao thông", required: true },
    { id: 5, name: "Giấy chứng nhận nghề", required: false },
  ];

  const handleFileUpload = (docId: number) => {
    console.log("Uploading file for document:", docId);
    // Handle file upload logic
  };

  const handleUploadAll = () => {
    console.log("Upload all documents");
    // Handle upload all logic
  };

  const handleUpdateAll = () => {
    console.log("Update all documents");
    // Handle update all logic
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Học Viên</h1>
        <p className="text-sm text-muted-foreground">
          Nộp và quản lý hồ sơ đăng ký của bạn
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Position Selection */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">Vị Trí Đăng Ký</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Chọn vị trí bạn muốn ứng tuyển
            </p>

            {/* Position Dropdown */}
            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium">
                Vị trí <span className="text-red-500">*</span>
              </label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Lái xe tải</SelectItem>
                  <SelectItem value="office">Nhân viên văn phòng</SelectItem>
                  <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Statistics */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tài liệu bắt buộc</span>
                <span className="font-bold">4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đã tải lên</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Document Upload */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">Tải Lên Tài Liệu</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tải lên tất cả tài liệu cần thiết cho vị trí đã chọn
            </p>

            {/* Document List */}
            <div className="space-y-3 mb-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {doc.name}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleUploadAll}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Hồ Sơ Tổng
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleUpdateAll}
              >
                Update Hồ Sơ Tổng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

