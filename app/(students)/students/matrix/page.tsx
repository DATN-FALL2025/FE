"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define matrix data structure
interface MatrixRow {
  position: string;
  qualifications: string;
  degree: string;
  certificate: string;
}

// Department data
const departments = [
  { value: "all", label: "Tất cả khoa" },
  { value: "cntt", label: "Khoa Công Nghệ Thông Tin" },
  { value: "kinh-te", label: "Khoa Kinh Tế" },
  { value: "ngoai-ngu", label: "Khoa Ngoại Ngữ" },
];

// Position data
const positions = [
  { value: "all", label: "Tất cả vị trí" },
  { value: "giang-vien", label: "Giảng viên" },
  { value: "tro-giang", label: "Trợ giảng" },
  { value: "nghien-cuu-vien", label: "Nghiên cứu viên" },
];

// Matrix data for each department
const matrixData: Record<string, MatrixRow[]> = {
  cntt: [
    {
      position: "Giảng viên",
      qualifications: "Số năm kinh nghiệm: 5 năm\nTrình độ học vấn: Thạc sĩ",
      degree: "Loại bằng cấp: Thạc sĩ Khoa học máy tính\nChuyên ngành: Trí tuệ nhân tạo",
      certificate: "—",
    },
    {
      position: "Trợ giảng",
      qualifications: "Số năm kinh nghiệm: 2 năm\nTrình độ học vấn: Cử nhân",
      degree: "—",
      certificate: "—",
    },
    {
      position: "Nghiên cứu viên",
      qualifications: "—",
      degree: "—",
      certificate: "—",
    },
  ],
  "kinh-te": [
    {
      position: "Giảng viên",
      qualifications: "Số năm kinh nghiệm: 5 năm\nTrình độ học vấn: Tiến sĩ",
      degree: "Loại bằng cấp: Tiến sĩ Kinh tế\nChuyên ngành: Quản trị kinh doanh",
      certificate: "Chứng chỉ CPA",
    },
    {
      position: "Trợ giảng",
      qualifications: "Số năm kinh nghiệm: 2 năm\nTrình độ học vấn: Thạc sĩ",
      degree: "—",
      certificate: "—",
    },
    {
      position: "Nghiên cứu viên",
      qualifications: "—",
      degree: "—",
      certificate: "—",
    },
  ],
  "ngoai-ngu": [
    {
      position: "Giảng viên",
      qualifications: "Số năm kinh nghiệm: 5 năm\nTrình độ học vấn: Thạc sĩ",
      degree: "Loại bằng cấp: Thạc sĩ Ngôn ngữ Anh\nChuyên ngành: Ngôn ngữ học ứng dụng",
      certificate: "IELTS 8.0, TESOL",
    },
    {
      position: "Trợ giảng",
      qualifications: "Số năm kinh nghiệm: 2 năm\nTrình độ học vấn: Cử nhân",
      degree: "—",
      certificate: "—",
    },
    {
      position: "Nghiên cứu viên",
      qualifications: "—",
      degree: "—",
      certificate: "—",
    },
  ],
};

export default function MatrixPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("cntt");
  const [selectedPosition, setSelectedPosition] = useState("all");

  // Get current data based on filters
  const getCurrentData = () => {
    const deptData = matrixData[selectedDepartment] || matrixData.cntt;

    if (selectedPosition === "all") {
      return deptData;
    }

    return deptData.filter(
      (row) => row.position.toLowerCase().replace(" ", "-") === selectedPosition
    );
  };

  const currentData = getCurrentData();
  const currentDepartmentName = departments.find(
    (d) => d.value === selectedDepartment
  )?.label || "Khoa Công Nghệ Thông Tin";

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Xem Ma Trận</h1>
        <p className="text-sm text-muted-foreground">
          Xem thông tin ma trận theo khoa và vị trí
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lọc theo Khoa</label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn khoa" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Position Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lọc theo Vị Trí</label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matrix Table */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-2">{currentDepartmentName}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Ma trận tiêu chí hồ sơ đầu vào
          </p>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold text-foreground">
                    Vị Trí / Tài Liệu
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Hồ sơ năng lực
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Bằng cấp chuyên môn
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Chứng chỉ nghề nghiệp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium bg-muted/30">
                      {row.position}
                    </TableCell>
                    <TableCell className="whitespace-pre-line text-sm">
                      {row.qualifications}
                    </TableCell>
                    <TableCell className="whitespace-pre-line text-sm">
                      {row.degree}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.certificate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
