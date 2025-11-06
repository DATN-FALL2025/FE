"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Building2,
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
import { cn } from "@/lib/utils";

export default function PositionsPage() {
  const departments = [
    { id: "1", name: "Ground Operations", code: "GO", color: "bg-blue-500" },
    { id: "2", name: "Cabin Crew", code: "CC", color: "bg-purple-500" },
    { id: "3", name: "Technical and Maintenance", code: "TAM", color: "bg-orange-500" },
    { id: "4", name: "Flight Crew", code: "FC", color: "bg-red-500" },
  ];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(departments[0].id);

  const positionsByDepartment: Record<string, any[]> = {
    "1": [
      { id: "1", name: "Ground Operations Level 1", code: "GO-L1", level: "L1", employeeCount: 45 },
      { id: "2", name: "Ground Operations Level 2", code: "GO-L2", level: "L2", employeeCount: 32 },
      { id: "3", name: "Ground Operations Level 3", code: "GO-L3", level: "L3", employeeCount: 18 },
      { id: "4", name: "Ground Operations Level 4", code: "GO-L4", level: "L4", employeeCount: 8 },
    ],
    "2": [
      { id: "5", name: "Cabin Crew Level 1", code: "CC-L1", level: "L1", employeeCount: 67 },
      { id: "6", name: "Cabin Crew Level 2", code: "CC-L2", level: "L2", employeeCount: 45 },
      { id: "7", name: "Cabin Crew Level 3", code: "CC-L3", level: "L3", employeeCount: 23 },
      { id: "8", name: "Cabin Crew Level 4", code: "CC-L4", level: "L4", employeeCount: 12 },
    ],
    "3": [
      { id: "9", name: "Technical and Maintenance Level 1", code: "TAM-L1", level: "L1", employeeCount: 38 },
      { id: "10", name: "Technical and Maintenance Level 2", code: "TAM-L2", level: "L2", employeeCount: 29 },
      { id: "11", name: "Technical and Maintenance Level 3", code: "TAM-L3", level: "L3", employeeCount: 15 },
      { id: "12", name: "Technical and Maintenance Level 4", code: "TAM-L4", level: "L4", employeeCount: 7 },
    ],
    "4": [
      { id: "13", name: "Flight Crew Level 1", code: "FC-L1", level: "L1", employeeCount: 52 },
      { id: "14", name: "Flight Crew Level 2", code: "FC-L2", level: "L2", employeeCount: 41 },
      { id: "15", name: "Flight Crew Level 3", code: "FC-L3", level: "L3", employeeCount: 28 },
      { id: "16", name: "Flight Crew Level 4", code: "FC-L4", level: "L4", employeeCount: 15 },
    ],
  };

  const selectedDepartment = departments.find((d) => d.id === selectedDepartmentId);
  const positions = positionsByDepartment[selectedDepartmentId] || [];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Position Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage positions and levels across departments
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Add Position
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Levels per Dept</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              L1 through L4
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">575</div>
            <p className="text-xs text-muted-foreground mt-1">
              In all positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Department</CardTitle>
          <CardDescription>Choose a department to view and manage its positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => {
              const isSelected = selectedDepartmentId === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartmentId(dept.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all hover:border-primary",
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-background"
                  )}
                >
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl", dept.color)}>
                    {dept.code}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{dept.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{positionsByDepartment[dept.id]?.length || 0} positions</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Positions in {selectedDepartment?.name}</CardTitle>
              <CardDescription className="mt-1">
                Manage position structure and hierarchy
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              {positions.length} positions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{position.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{position.level}</Badge>
                  </TableCell>
                  <TableCell>{position.employeeCount}</TableCell>
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
                          Edit Position
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Briefcase className="w-4 h-4 mr-2" />
                          View Employees
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
