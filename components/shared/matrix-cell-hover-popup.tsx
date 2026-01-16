"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { getMatrixDetails } from "@/lib/actions/matrix";

interface DocumentRuleValue {
  document_rule_value_id: number;
  value: string;
  document_rule_id: number;
  document_rule_name: string;
}

interface DocumentColumn {
  document_id: number;
  document_name: string;
  statusEnum: string;
  matrixId: number;
  documentRuleValueList: DocumentRuleValue[];
  required: boolean;
}

interface MatrixDetail {
  positionId: number;
  positionName: string;
  statusEnum: string;
  matrixStatusEnum: string;
  startDate: string;
  endDate: string;
  reject_reason: string | null;
  departmentId: number;
  documentCollumResponseList: DocumentColumn[];
}

interface MatrixCellHoverPopupProps {
  matrixId: number;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function MatrixCellHoverPopup({
  matrixId,
  children,
  disabled = false,
}: MatrixCellHoverPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<MatrixDetail | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchDetails = useCallback(async () => {
    if (!matrixId || disabled) return;
    
    setIsLoading(true);
    try {
      const result = await getMatrixDetails([matrixId]);
      if (result.status === "200" && result.data?.length > 0) {
        setDetails(result.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch matrix details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [matrixId, disabled]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });

    hoverTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      fetchDetails();
    }, 300); // 1.5 giây
  }, [disabled, fetchDetails]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsVisible(false);
    setDetails(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Find the document info from details
  const documentInfo = details?.documentCollumResponseList?.find(
    (doc) => doc.matrixId === matrixId
  );

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex"
    >
      {children}

      {isVisible && (
        <div
          className="fixed z-50 min-w-[280px] max-w-[400px] p-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Đang tải...
              </span>
            </div>
          ) : details ? (
            <div className="space-y-3">
              {/* Position Info */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900">
                  {details.positionName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={details.statusEnum} />
                </div>
              </div>

              {/* Date Range */}
              {details.startDate && details.endDate && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Thời gian:</span>{" "}
                  {formatDate(details.startDate)} - {formatDate(details.endDate)}
                </div>
              )}

              {/* Reject Reason */}
              {details.reject_reason && (
                <div className="p-2 bg-red-50 rounded text-xs text-red-700">
                  <span className="font-medium">Lý do từ chối:</span>{" "}
                  {details.reject_reason}
                </div>
              )}

              {/* Document Rules */}
              {documentInfo && documentInfo.documentRuleValueList?.length > 0 && (
                <div className="border-t pt-3">
                  <h5 className="font-medium text-xs text-gray-700 mb-2">
                    {documentInfo.document_name}
                  </h5>
                  <div className="space-y-2">
                    {/* Group by rule name */}
                    {groupRulesByName(documentInfo.documentRuleValueList).map(
                      (group, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-gray-600">
                            {group.ruleName}:
                          </span>
                          <ul className="ml-2 mt-1 space-y-0.5">
                            {group.values.map((val, vIdx) => (
                              <li key={vIdx} className="text-gray-700">
                                • {val}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-2">
              Không có dữ liệu
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    InProgress: { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800" },
    Drafted: { label: "Đã gửi", className: "bg-blue-100 text-blue-800" },
    Pending: { label: "Chờ duyệt", className: "bg-orange-100 text-orange-800" },
    Approved: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
    Approve: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
    Rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    Reject: { label: "Từ chối", className: "bg-red-100 text-red-800" },
  };

  const config = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function groupRulesByName(rules: DocumentRuleValue[]): { ruleName: string; values: string[] }[] {
  const grouped = new Map<string, string[]>();
  
  rules.forEach((rule) => {
    const existing = grouped.get(rule.document_rule_name) || [];
    existing.push(rule.value);
    grouped.set(rule.document_rule_name, existing);
  });

  return Array.from(grouped.entries()).map(([ruleName, values]) => ({
    ruleName,
    values,
  }));
}
