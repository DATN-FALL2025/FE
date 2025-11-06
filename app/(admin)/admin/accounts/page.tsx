"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const accounts = [
    {
      id: "1",
      name: "System Administrator",
      email: "admin@idmawa.edu.vn",
      role: "Admin",
      department: "System",
      status: "Active",
      lastLogin: "2024-01-15 10:30",
      avatar: null,
    },
    {
      id: "2",
      name: "Mr. David Wilson",
      email: "david.wilson@idmawa.edu.vn",
      role: "Head",
      department: "Ground Operations",
      status: "Active",
      lastLogin: "2024-01-15 09:45",
      avatar: null,
    },
    {
      id: "3",
      name: "Ms. Sarah Johnson",
      email: "sarah.johnson@idmawa.edu.vn",
      role: "Head",
      department: "Cabin Crew",
      status: "Active",
      lastLogin: "2024-01-15 08:20",
      avatar: null,
    },
    {
      id: "4",
      name: "Eng. Michael Chen",
      email: "michael.chen@idmawa.edu.vn",
      role: "Head",
      department: "Technical and Maintenance",
      status: "Active",
      lastLogin: "2024-01-14 16:55",
      avatar: null,
    },
    {
      id: "5",
      name: "Capt. John Smith",
      email: "john.smith@idmawa.edu.vn",
      role: "Head",
      department: "Flight Crew",
      status: "Active",
      lastLogin: "2024-01-14 14:30",
      avatar: null,
    },
    {
      id: "6",
      name: "Dr. Lisa Anderson",
      email: "lisa.anderson@idmawa.edu.vn",
      role: "Training Director",
      department: "All Departments",
      status: "Active",
      lastLogin: "2024-01-15 11:15",
      avatar: null,
    },
    {
      id: "7",
      name: "John Doe",
      email: "john.doe@idmawa.edu.vn",
      role: "Trainee",
      department: "Ground Operations",
      status: "Active",
      lastLogin: "2024-01-15 07:50",
      avatar: null,
    },
    {
      id: "8",
      name: "Jane Smith",
      email: "jane.smith@idmawa.edu.vn",
      role: "Trainee",
      department: "Cabin Crew",
      status: "Inactive",
      lastLogin: "2024-01-10 15:20",
      avatar: null,
    },
  ];

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || account.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      title: "Total Accounts",
      value: accounts.length.toString(),
      icon: Users,
      description: "All user accounts",
    },
    {
      title: "Active Users",
      value: accounts.filter((a) => a.status === "Active").length.toString(),
      icon: UserCheck,
      description: "Currently active",
    },
    {
      title: "Inactive Users",
      value: accounts.filter((a) => a.status === "Inactive").length.toString(),
      icon: UserX,
      description: "Suspended or inactive",
    },
    {
      title: "Administrators",
      value: accounts.filter((a) => a.role === "Admin" || a.role === "Training Director").length.toString(),
      icon: Shield,
      description: "Admin & TD accounts",
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";
      case "Training Director":
        return "bg-purple-600";
      case "Head":
        return "bg-blue-600";
      case "Trainee":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Account Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage user accounts and permissions
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create Account
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Training Director">Training Director</SelectItem>
                <SelectItem value="Head">Head of Department</SelectItem>
                <SelectItem value="Trainee">Trainee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription className="mt-1">
                {filteredAccounts.length} account{filteredAccounts.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No accounts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={account.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(account.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{account.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(account.role)}>{account.role}</Badge>
                    </TableCell>
                    <TableCell>{account.department}</TableCell>
                    <TableCell>
                      <Badge className={account.status === "Active" ? "bg-green-600" : "bg-gray-600"}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{account.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {account.status === "Active" ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
