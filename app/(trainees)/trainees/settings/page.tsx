"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!hasUpperCase) {
      return "Mật khẩu phải có ít nhất 1 chữ hoa";
    }
    if (!hasLowerCase) {
      return "Mật khẩu phải có ít nhất 1 chữ thường";
    }
    if (!hasNumbers) {
      return "Mật khẩu phải có ít nhất 1 số";
    }
    if (!hasSpecialChar) {
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt";
    }
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleChangePassword = async () => {
    // Reset errors
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Check if same as current
    if (formData.currentPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);

    // If there are errors, stop
    if (Object.values(newErrors).some(err => err !== "")) {
      return;
    }

    try {
      setIsChangingPassword(true);

      // TODO: Call API to change password
      // const result = await changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Đổi mật khẩu thành công!");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 12.5;

    if (strength <= 25) return { strength, label: "Yếu", color: "bg-red-500" };
    if (strength <= 50) return { strength, label: "Trung bình", color: "bg-orange-500" };
    if (strength <= 75) return { strength, label: "Khá", color: "bg-yellow-500" };
    return { strength, label: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Cài Đặt Bảo Mật
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý mật khẩu và cài đặt bảo mật tài khoản của bạn
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Đổi Mật Khẩu
            </CardTitle>
            <CardDescription>
              Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh và bảo mật
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Security Tips */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Lưu ý bảo mật:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                  <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                Mật khẩu mới <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Độ mạnh mật khẩu:</span>
                    <span className={`font-semibold ${
                      passwordStrength.strength <= 25 ? "text-red-500" :
                      passwordStrength.strength <= 50 ? "text-orange-500" :
                      passwordStrength.strength <= 75 ? "text-yellow-500" :
                      "text-green-500"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Mật khẩu khớp
                </p>
              )}

              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isChangingPassword ? (
                  <>Đang xử lý...</>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Đổi Mật Khẩu
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setErrors({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
