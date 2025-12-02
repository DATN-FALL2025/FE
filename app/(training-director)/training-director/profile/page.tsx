"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit,
  Save,
  Upload,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar?: string;
  joinDate: Date;
  lastLogin: Date;
  employeeId: string;
}

// Mock data
const mockProfile: ProfileData = {
  fullName: "Nguyễn Văn An",
  email: "nguyenvanan@aviation.edu.vn",
  phone: "+84 123 456 789",
  role: "Training Director",
  department: "Training Management Department",
  avatar: "",
  joinDate: new Date(2020, 0, 15),
  lastLogin: new Date(2025, 10, 30, 9, 30),
  employeeId: "TD-2020-001",
};

export default function TrainingDirectorProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // TODO: Call API to update profile
      // await updateTrainingDirectorProfile(profile);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(mockProfile);
    setIsEditing(false);
  };

  const handlePhotoUpload = () => {
    toast.info("Photo upload functionality coming soon");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px]" />
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Profile Picture & Quick Info */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Avatar className="w-32 h-32 mx-auto border-4 border-primary/10">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback className="text-4xl font-bold bg-blue-100 text-blue-600">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {profile.employeeId}
                </p>
              </div>

              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                <Shield className="w-3 h-3 mr-1" />
                {profile.role}
              </Badge>

              {isEditing && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePhotoUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined
                </span>
                <span className="text-sm font-semibold">
                  {profile.joinDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last Login
                </span>
                <span className="text-sm font-semibold">
                  {profile.lastLogin.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={profile.employeeId}
                    disabled
                    className="bg-muted font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Work Information
              </CardTitle>
              <CardDescription>
                Your role and department details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="role"
                      value={profile.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="department"
                      value={profile.department}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="joinDate"
                      value={profile.joinDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = "/training-director/settings"}
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
