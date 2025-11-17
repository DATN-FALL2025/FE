"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Building2, FileText, Clock, TrendingUp, UserCheck, UserPlus } from "lucide-react";
import { DashboardStats } from "../../types";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const statsData = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
    },
    {
      label: "Total Trainees",
      value: stats.totalTrainees.toLocaleString(),
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
    },
    {
      label: "Departments",
      value: stats.totalDepartments,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "0%",
    },
    {
      label: "Total Documents",
      value: stats.totalDocuments.toLocaleString(),
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+24%",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      urgent: true,
    },
    {
      label: "Approval Rate",
      value: `${stats.approvalRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+2.5%",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "New This Month",
      value: stats.newUsersThisMonth,
      icon: UserPlus,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "+15%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <span className={`text-xs font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  {stat.urgent && (
                    <p className="text-xs text-orange-600 font-medium">Requires attention</p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

