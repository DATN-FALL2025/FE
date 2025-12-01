"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  User,
  Calendar,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { getAllPositions, getAllDepartments } from "@/lib/actions";

interface AdmissionResult {
  applicationId: number;
  studentName: string;
  studentCode: string;
  email: string;
  position: string;
  department: string;
  status: "approved" | "rejected" | "pending" | "under_review";
  score: number;
  rank: number;
  submittedDate: Date;
  reviewedDate?: Date;
  finalDecisionDate?: Date;
  evaluationNotes?: string;
  rejectionReason?: string;
}

// Mock data
const mockResults: AdmissionResult[] = [
  {
    applicationId: 1001,
    studentName: "Nguyễn Văn A",
    studentCode: "SV2025001",
    email: "nguyenvana@student.edu.vn",
    position: "Commercial Pilot License",
    department: "Flight Training",
    status: "approved",
    score: 92,
    rank: 3,
    submittedDate: new Date(2025, 9, 15),
    reviewedDate: new Date(2025, 10, 10),
    finalDecisionDate: new Date(2025, 10, 25),
    evaluationNotes: "Excellent performance, all requirements met",
  },
  {
    applicationId: 1002,
    studentName: "Trần Thị B",
    studentCode: "SV2025002",
    email: "tranthib@student.edu.vn",
    position: "Instrument Rating",
    department: "Flight Training",
    status: "approved",
    score: 88,
    rank: 7,
    submittedDate: new Date(2025, 9, 16),
    reviewedDate: new Date(2025, 10, 11),
    finalDecisionDate: new Date(2025, 10, 26),
    evaluationNotes: "Strong candidate with good practical skills",
  },
  {
    applicationId: 1003,
    studentName: "Lê Văn C",
    studentCode: "SV2025003",
    email: "levanc@student.edu.vn",
    position: "Flight Instructor Certificate",
    department: "Advanced Training",
    status: "rejected",
    score: 65,
    rank: 45,
    submittedDate: new Date(2025, 9, 17),
    reviewedDate: new Date(2025, 10, 12),
    finalDecisionDate: new Date(2025, 10, 27),
    rejectionReason: "Did not meet minimum score requirements for instructor certification",
  },
  {
    applicationId: 1004,
    studentName: "Phạm Thị D",
    studentCode: "SV2025004",
    email: "phamthid@student.edu.vn",
    position: "Commercial Pilot License",
    department: "Flight Training",
    status: "under_review",
    score: 78,
    rank: 15,
    submittedDate: new Date(2025, 10, 20),
    reviewedDate: new Date(2025, 10, 28),
  },
  {
    applicationId: 1005,
    studentName: "Hoàng Văn E",
    studentCode: "SV2025005",
    email: "hoangvane@student.edu.vn",
    position: "Instrument Rating",
    department: "Flight Training",
    status: "pending",
    score: 0,
    rank: 0,
    submittedDate: new Date(2025, 10, 29),
  },
];

export default function ResultsPage() {
  const [results, setResults] = useState<AdmissionResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<AdmissionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AdmissionResult | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Data
  const [positions, setPositions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchQuery, selectedStatus, selectedPosition, selectedDepartment, results]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch positions and departments
      const [posRes, deptRes] = await Promise.all([
        getAllPositions(),
        getAllDepartments(),
      ]);

      if (posRes.status === "success" && posRes.data) {
        setPositions(Array.isArray(posRes.data) ? posRes.data : []);
      }

      if (deptRes.status === "success" && deptRes.data) {
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      }

      // Set mock results
      setResults(mockResults);
      setFilteredResults(mockResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Position filter
    if (selectedPosition !== "all") {
      filtered = filtered.filter((r) => r.position === selectedPosition);
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((r) => r.department === selectedDepartment);
    }

    setFilteredResults(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "under_review":
        return <Badge className="bg-blue-600">Under Review</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetail = (result: AdmissionResult) => {
    setSelectedResult(result);
    setDetailDialogOpen(true);
  };

  const handleExportResults = () => {
    toast.success("Exporting results...");
    // TODO: Implement export functionality
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Admission Results
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage student admission results
          </p>
        </div>

        <Button onClick={handleExportResults}>
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name, Code, Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="All positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos.positionId} value={pos.positionName}>
                      {pos.positionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.departmentId} value={dept.departmentName}>
                      {dept.departmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {filteredResults.length} of {results.length} results</span>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Rank</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">No results found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.applicationId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{result.studentName}</span>
                          <span className="text-sm text-muted-foreground font-mono">
                            {result.studentCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{result.position}</TableCell>
                      <TableCell>{result.department}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(result.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold">
                          {result.score > 0 ? result.score : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold">
                          {result.rank > 0 ? result.rank : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {result.submittedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(result)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Admission Result Details
            </DialogTitle>
            <DialogDescription>
              Application #{selectedResult?.applicationId}
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-semibold">{selectedResult.studentName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Student Code:</span>
                    <p className="font-mono">{selectedResult.studentCode}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email:</span>
                    <p>{selectedResult.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Application Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Application Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Position:</span>
                    <p className="font-semibold">{selectedResult.position}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <p>{selectedResult.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedResult.status)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Score:</span>
                    <p className="font-semibold text-lg">
                      {selectedResult.score > 0 ? selectedResult.score : "Not evaluated"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{selectedResult.submittedDate.toLocaleDateString()}</span>
                  </div>
                  {selectedResult.reviewedDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-muted-foreground">Reviewed:</span>
                      <span>{selectedResult.reviewedDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedResult.finalDecisionDate && (
                    <div className="flex items-center gap-2">
                      {selectedResult.status === "approved" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-muted-foreground">Decision:</span>
                      <span>{selectedResult.finalDecisionDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedResult.evaluationNotes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Evaluation Notes</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {selectedResult.evaluationNotes}
                    </p>
                  </div>
                </>
              )}

              {/* Rejection Reason */}
              {selectedResult.rejectionReason && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-600">Rejection Reason</h3>
                    <p className="text-sm bg-red-50 border border-red-200 p-3 rounded-md text-red-900">
                      {selectedResult.rejectionReason}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
