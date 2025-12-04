"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { authenticateAccount } from "@/lib/actions/auth";
import { toast } from "sonner";
import { setUser, getRoleRedirectPath } from "@/lib/auth-utils";
import type { ApiResponse, AuthData } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authenticateAccount({
        userName: formData.userName,
        password: formData.password,
      }) as ApiResponse<AuthData>;

      if (result.status === 'error') {
        toast.error(result.message || 'Đăng nhập thất bại', {
          description: 'Vui lòng kiểm tra lại thông tin đăng nhập',
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      // Success - store user data and redirect
      console.log('✅ Login successful:', result);
      
      if (result.data) {
        // Store user info using auth utils
        setUser(result.data);

        // Log JWT token details
        if (result.data.token) {
          try {
            const parts = result.data.token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              console.log('🔐 JWT Token Payload:', JSON.stringify(payload, null, 2));
              console.log('📋 JWT Fields:', {
                sub: payload.sub,
                gmail: payload.gmail,
                role: payload.role,
                departmentId: payload.departmentId,
                departmentName: payload.departmentName,
                studentCode: payload.studentCode,
                exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
                iat: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'N/A',
              });
            }
          } catch (e) {
            console.error('❌ Error decoding JWT:', e);
          }
        }

        // Get redirect path based on user role
        const userRole = result.data?.role || result.data?.roles?.[0]?.roleName;
        const redirectPath = getRoleRedirectPath(userRole);
        
        console.log('🔀 Redirecting to:', redirectPath);
        
        toast.success('Đăng nhập thành công!', {
          description: `Chào mừng ${result.data.userName}`,
          duration: 2000,
        });
        
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          router.push(redirectPath);
        }, 100);
      } else {
        // No user data returned
        toast.error('Đăng nhập thất bại', {
          description: 'Không nhận được thông tin người dùng',
          duration: 4000,
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra', {
        description: 'Vui lòng thử lại sau',
        duration: 4000,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="bg-primary rounded-lg p-3">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="font-bold text-2xl">IDMAWA</h1>
            <p className="text-sm text-muted-foreground">Aviation Academy</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

