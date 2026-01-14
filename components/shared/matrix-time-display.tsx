"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getMatrixTimeDeadline, getMatrixTimeActive } from "@/lib/actions";

interface DeadlineData {
  start_date_deadLine?: string;
  end_date_deadline?: string;
}

interface ActiveData {
  start_Date?: string | null;
  end_Date?: string | null;
}

interface MatrixTimeDisplayProps {
  showDeadlineOnly?: boolean;
  onSetDeadline?: () => void;
  onSetActive?: () => void;
  showActions?: boolean;
}

export default function MatrixTimeDisplay({ 
  showDeadlineOnly = false,
  onSetDeadline,
  onSetActive,
  showActions = false
}: MatrixTimeDisplayProps) {
  const [deadlineData, setDeadlineData] = useState<DeadlineData | null>(null);
  const [activeData, setActiveData] = useState<ActiveData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [deadlineRes, activeRes]: any[] = await Promise.all([
        getMatrixTimeDeadline(token),
        getMatrixTimeActive(token)
      ]);

      if (deadlineRes.status === "200 OK" && deadlineRes.data) {
        setDeadlineData(deadlineRes.data);
      }
      
      if (activeRes.status === "200 OK" && activeRes.data) {
        setActiveData(activeRes.data);
      }
    } catch (error) {
      console.error("Error fetching matrix time:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-20 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // Check if has active time (not null)
  const hasActiveTime = activeData && (activeData.start_Date || activeData.end_Date);
  const hasDeadlineTime = deadlineData && (deadlineData.start_date_deadLine || deadlineData.end_date_deadline);

  // Determine what to display
  const displayActive = !showDeadlineOnly && hasActiveTime;
  const displayDeadline = showDeadlineOnly ? hasDeadlineTime : (!hasActiveTime && hasDeadlineTime);

  // No data case
  if (!displayActive && !displayDeadline) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="w-5 h-5" />
              <span>Chưa có thông tin thời gian ma trận</span>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onSetDeadline}>
                  <Clock className="w-4 h-4 mr-2" />
                  Tạo Deadline
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${displayActive 
      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
      : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {displayActive ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
              <h3 className="font-semibold text-lg">
                {displayActive ? "Thời gian hoạt động Ma trận" : "Thời hạn chờ duyệt Ma trận"}
              </h3>
              <Badge className={displayActive ? "bg-green-500" : "bg-yellow-500"}>
                {displayActive ? "Đang hoạt động" : "Chờ duyệt"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="font-medium">
                    {displayActive 
                      ? formatDate(activeData?.start_Date) 
                      : formatDate(deadlineData?.start_date_deadLine)
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                  <p className="font-medium">
                    {displayActive 
                      ? formatDate(activeData?.end_Date) 
                      : formatDate(deadlineData?.end_date_deadline)
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onSetDeadline}>
                <Clock className="w-4 h-4 mr-2" />
                {hasDeadlineTime ? "Tạo lại Deadline" : "Tạo Deadline"}
              </Button>
              <Button size="sm" variant="default" onClick={onSetActive} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Kích hoạt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
