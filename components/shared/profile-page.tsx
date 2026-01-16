"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Building2, 
  Briefcase, 
  Calendar, 
  MapPin, 
  UserCircle 
} from "lucide-react";
import { getProfile } from "@/lib/actions";
import { translateRole } from "@/lib/auth-utils";

interface ProfileData {
  userName: string;
  accountImage: string | null;
  gmail: string | null;
  positionName: string | null;
  departmentName: string | null;
  fullName: string | null;
  birthDay: string | null;
  address: string | null;
  gender: string | null;
}

interface ProfilePageProps {
  role?: string;
}

export default function ProfilePage({ role }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const result: any = await getProfile(token);
        
        if (result.status === "200 OK" && result.data) {
          setProfile(result.data);
        } else {
          setError(result.message || "Không thể tải thông tin profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const translateGender = (gender: string | null) => {
    if (!gender) return "Chưa cập nhật";
    const genderMap: { [key: string]: string } = {
      male: "Nam",
      female: "Nữ",
      other: "Khác",
      Male: "Nam",
      Female: "Nữ",
      Other: "Khác",
    };
    return genderMap[gender] || gender;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Không thể tải Profile</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground mt-1">
          Xem thông tin tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-primary/10">
              {profile?.accountImage && profile.accountImage !== "string" && (
                <AvatarImage src={profile.accountImage} alt={profile?.fullName || profile?.userName || ""} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {getInitials(profile?.fullName || profile?.userName || null)}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold mt-4">
              {profile?.fullName || profile?.userName || "Chưa cập nhật"}
            </h2>
            
            {profile?.userName && profile?.fullName && (
              <p className="text-sm text-muted-foreground">@{profile.userName}</p>
            )}
            
            {role && (
              <Badge className="mt-3 bg-primary">
                {translateRole(role)}
              </Badge>
            )}
            
            {profile?.departmentName && (
              <p className="text-sm text-muted-foreground mt-2 px-4">
                {profile.departmentName}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Tên đăng nhập
                </label>
                <p className="text-base font-medium">
                  {profile?.userName || "Chưa cập nhật"}
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Họ và tên
                </label>
                <p className="text-base font-medium">
                  {profile?.fullName || "Chưa cập nhật"}
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-base font-medium">
                  {profile?.gmail || "Chưa cập nhật"}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Giới tính
                </label>
                <p className="text-base font-medium">
                  {translateGender(profile?.gender ?? null)}
                </p>
              </div>

              {/* Birthday */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày sinh
                </label>
                <p className="text-base font-medium">
                  {formatDate(profile?.birthDay ?? null)}
                </p>
              </div>

              {/* Position */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Vị trí
                </label>
                <p className="text-base font-medium">
                  {profile?.positionName || "Chưa cập nhật"}
                </p>
              </div>

              {/* Department */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Phòng ban / Khoa
                </label>
                <p className="text-base font-medium">
                  {profile?.departmentName || "Chưa cập nhật"}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Địa chỉ
                </label>
                <p className="text-base font-medium">
                  {profile?.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
