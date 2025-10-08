"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [documentApprovals, setDocumentApprovals] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-8 w-full max-w-6xl">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Manage system configuration and preferences
        </p>
      </div>

      {/* System Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            System Information
          </CardTitle>
          <CardDescription>Current system configuration and version</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Environment", value: "Production" },
              { label: "Last Updated", value: "2024-10-08" },
              { label: "Uptime", value: "99.9%" },
            ].map((item, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input id="system-name" defaultValue="IDMAWA - Aviation Academy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@idmawa.edu.vn" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc+7">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc+7">UTC+7 (Vietnam)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="utc+8">UTC+8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="support-message">Support Message</Label>
            <Textarea
              id="support-message"
              placeholder="Message displayed to users for support..."
              defaultValue="For assistance, please contact support@idmawa.edu.vn or call +84 123 456 789"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notif" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
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
                <Label htmlFor="push-notif" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
            </div>
            <Switch
              id="push-notif"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="doc-approvals" className="text-base">Document Approval Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify when documents need approval</p>
              </div>
            </div>
            <Switch
              id="doc-approvals"
              checked={documentApprovals}
              onCheckedChange={setDocumentApprovals}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="system-alerts" className="text-base">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system notifications</p>
              </div>
            </div>
            <Switch
              id="system-alerts"
              checked={systemAlerts}
              onCheckedChange={setSystemAlerts}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage security and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="2fa" className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra security layer</p>
              </div>
            </div>
            <Switch
              id="2fa"
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <Select defaultValue="strong">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8 characters)</SelectItem>
                  <SelectItem value="strong">Strong (12 characters + special)</SelectItem>
                  <SelectItem value="very-strong">Very Strong (16 characters + 2FA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Maintenance */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup & Maintenance
          </CardTitle>
          <CardDescription>Database backup and system maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="auto-backup" className="text-base">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Daily automated database backup</p>
              </div>
            </div>
            <Switch
              id="auto-backup"
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Last Backup</p>
              <p className="text-lg font-semibold mt-1">2024-10-08 03:00</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Backup Size</p>
              <p className="text-lg font-semibold mt-1">245 MB</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Database className="w-4 h-4 mr-2" />
              Download Backup
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Create Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button size="lg" className="gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

