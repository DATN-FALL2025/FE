"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Briefcase,
  Shield,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Departments",
      value: "4",
      icon: Building2,
      description: "Active departments",
    },
    {
      title: "Total Positions",
      value: "16",
      icon: Briefcase,
      description: "Across all departments",
    },
    {
      title: "Matrix Rules",
      value: "0",
      icon: Shield,
      description: "Active rules",
    },
    {
      title: "Documents",
      value: "0",
      icon: FileText,
      description: "Total documents",
    },
    {
      title: "Total Accounts",
      value: "0",
      icon: Users,
      description: "All users",
    },
  ];

  const quickActions = [
    {
      title: "Manage Departments",
      description: "Add, edit, or remove departments",
      href: "/admin/departments",
      icon: Building2,
    },
    {
      title: "Manage Positions",
      description: "Configure position structure",
      href: "/admin/positions",
      icon: Briefcase,
    },
    {
      title: "Manage Rules",
      description: "Configure matrix rules",
      href: "/admin/rules",
      icon: Shield,
    },
    {
      title: "Manage Documents",
      description: "Upload and organize documents",
      href: "/admin/documents",
      icon: FileText,
    },
    {
      title: "Manage Accounts",
      description: "User and account management",
      href: "/admin/accounts",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-base">
          System overview and management console
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="hover:bg-muted/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{action.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={action.href}>
                    <Button variant="outline" className="w-full">
                      Go to {action.title.split(" ")[1]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
