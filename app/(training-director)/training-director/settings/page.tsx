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
      return "Password must be at least 8 characters";
    }
    if (!hasUpperCase) {
      return "Password must contain at least 1 uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least 1 lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least 1 number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least 1 special character";
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
      newErrors.currentPassword = "Please enter your current password";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "Please enter a new password";
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if same as current
    if (formData.currentPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
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

      toast.success("Password changed successfully!");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
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

    if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 50) return { strength, label: "Fair", color: "bg-orange-500" };
    if (strength <= 75) return { strength, label: "Good", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Security Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security settings
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Ensure your account is using a strong and secure password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Security Tips */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Security Best Practices:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Use a strong password with at least 8 characters</li>
                  <li>Include uppercase, lowercase, numbers, and special characters</li>
                  <li>Avoid using personal information</li>
                  <li>Never share your password with others</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Current Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="Enter current password"
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
                New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  placeholder="Enter new password"
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
                    <span className="text-muted-foreground">Password Strength:</span>
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
                Confirm New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Re-enter new password"
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
                  Passwords match
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
                  <>Processing...</>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
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
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
