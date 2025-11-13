"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CriteriaItem {
  id: string;
  position: string;
  hoSoNangLuc: boolean;
  bangCapChuyenMon: boolean;
  chungChiNgheNghiep: boolean;
  experienceYears: number;
  educationLevel: string;
}

export default function CriteriaManagementPage() {
  const [criteriaList, setCriteriaList] = useState<CriteriaItem[]>([
    {
      id: "1",
      position: "Giảng viên",
      hoSoNangLuc: true,
      bangCapChuyenMon: false,
      chungChiNgheNghiep: false,
      experienceYears: 2,
      educationLevel: "Thạc sĩ",
    },
    {
      id: "2",
      position: "Trợ giảng",
      hoSoNangLuc: false,
      bangCapChuyenMon: false,
      chungChiNgheNghiep: false,
      experienceYears: 1,
      educationLevel: "Cử nhân",
    },
    {
      id: "3",
      position: "Nghiên cứu viên",
      hoSoNangLuc: false,
      bangCapChuyenMon: false,
      chungChiNgheNghiep: false,
      experienceYears: 3,
      educationLevel: "Tiến sĩ",
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaItem | null>(null);

  const [formData, setFormData] = useState({
    experienceYears: 0,
    educationLevel: "",
  });

  const handleCheckboxChange = (id: string, field: keyof CriteriaItem) => {
    setCriteriaList(
      criteriaList.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  const openEditDialog = (criteria: CriteriaItem) => {
    setSelectedCriteria(criteria);
    setFormData({
      experienceYears: criteria.experienceYears,
      educationLevel: criteria.educationLevel,
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (criteria: CriteriaItem) => {
    setSelectedCriteria(criteria);
    setIsViewOpen(true);
  };

  const handleSave = () => {
    if (selectedCriteria) {
      setCriteriaList(
        criteriaList.map((item) =>
          item.id === selectedCriteria.id
            ? {
                ...item,
                experienceYears: formData.experienceYears,
                educationLevel: formData.educationLevel,
              }
            : item
        )
      );
      setIsEditOpen(false);
      setSelectedCriteria(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản Lý Tiêu Chí - Trưởng Khoa</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Khoa Công Nghệ Thông Tin - Chọn và cấu hình tiêu chí cho từng vị trí trong ma trận
        </p>
      </div>

      {/* Criteria Matrix Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Ma Trận Tiêu Chí - Khoa Công Nghệ Thông Tin</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tick vào các ô để chọn và nhập tiêu chí cụ thể
              </p>
            </div>

            {/* Criteria Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sm min-w-[150px]">
                      Vị Trí /<br />Tài Liệu
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-sm min-w-[180px]">
                      Hỗ sơ năng lực
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-sm min-w-[180px]">
                      Bằng cấp chuyên môn
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-sm min-w-[180px]">
                      Chứng chỉ nghề nghiệp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {criteriaList.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium">{item.position}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <Checkbox
                            checked={item.hoSoNangLuc}
                            onCheckedChange={() => handleCheckboxChange(item.id, "hoSoNangLuc")}
                          />
                          {item.hoSoNangLuc && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(item)}
                                className="h-7 px-2 text-xs"
                              >
                                Xem
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openEditDialog(item)}
                                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              >
                                Sửa
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <Checkbox
                            checked={item.bangCapChuyenMon}
                            onCheckedChange={() => handleCheckboxChange(item.id, "bangCapChuyenMon")}
                          />
                          {item.bangCapChuyenMon && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(item)}
                                className="h-7 px-2 text-xs"
                              >
                                Xem
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openEditDialog(item)}
                                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              >
                                Sửa
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <Checkbox
                            checked={item.chungChiNgheNghiep}
                            onCheckedChange={() => handleCheckboxChange(item.id, "chungChiNgheNghiep")}
                          />
                          {item.chungChiNgheNghiep && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(item)}
                                className="h-7 px-2 text-xs"
                              >
                                Xem
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openEditDialog(item)}
                                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              >
                                Sửa
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info text */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Đã lưu tiêu chí</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Sửa Tiêu Chí</DialogTitle>
            <DialogDescription>
              Hỗ sơ năng lực - {selectedCriteria?.position}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Số năm kinh nghiệm tối thiểu</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Trình độ học vấn</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                  <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                  <SelectItem value="Cử nhân">Cử nhân</SelectItem>
                  <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                  <SelectItem value="Tiến sĩ">Tiến sĩ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedCriteria(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Lưu Tiêu Chí
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Xem Tiêu Chí</DialogTitle>
            <DialogDescription>
              Hỗ sơ năng lực - {selectedCriteria?.position}
            </DialogDescription>
          </DialogHeader>
          {selectedCriteria && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Số năm kinh nghiệm tối thiểu</Label>
                <div className="text-lg font-medium">{selectedCriteria.experienceYears}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Trình độ học vấn</Label>
                <div className="text-lg font-medium">{selectedCriteria.educationLevel}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

