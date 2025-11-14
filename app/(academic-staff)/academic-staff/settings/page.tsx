"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Save, User } from "lucide-react";

export default function AcademicStaffSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [gradeAlerts, setGradeAlerts] = useState(true);
  const [courseReminders, setCourseReminders] = useState(true);

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Manage your preferences and notifications
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Academic Staff" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="academic@idmawa.edu.vn" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Academic Staff" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+84 123 456 789" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notif" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
            </div>
            <Switch
              id="email-notif"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="grade-alerts" className="text-base">Grade Submission Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when grades need to be submitted</p>
              </div>
            </div>
            <Switch
              id="grade-alerts"
              checked={gradeAlerts}
              onCheckedChange={setGradeAlerts}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="course-reminders" className="text-base">Course Schedule Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily reminders for upcoming classes</p>
              </div>
            </div>
            <Switch
              id="course-reminders"
              checked={courseReminders}
              onCheckedChange={setCourseReminders}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg">Cancel</Button>
        <Button size="lg" className="gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
