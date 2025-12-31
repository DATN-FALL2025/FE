"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { authenticateAccount } from "@/lib/actions/auth";
import { toast } from "sonner";
import { setUser, getRoleRedirectPath, getDecodedToken } from "@/lib/auth-utils";
import type { ApiResponse, AuthData } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  // Check if user is already logged in and redirect to their dashboard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const decodedToken = getDecodedToken();
      if (decodedToken?.role) {
        const redirectPath = getRoleRedirectPath(decodedToken.role);
        console.log('🔀 User already logged in, redirecting to:', redirectPath);
        router.push(redirectPath);
      }
    }
  }, [router]);

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
        <h2 className="text-3xl font-bold">Chào mừng trở lại</h2>
        <p className="text-muted-foreground mt-2">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin đăng nhập để truy cập hệ thống</CardDescription>
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


        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Bằng việc tiếp tục, bạn đồng ý với{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Chính sách bảo mật
        </Link>
      </p>
    </div>
  );
}

