"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getAllDocuments, getDocumentWithRules } from "@/lib/actions/document";

interface DocumentRule {
  id: number;
  documentRuleId?: number;
  documentRuleName: string;
  documentRuleDescription: string;
}

interface Document {
  id: number;
  documentName: string;
  documentDescription: string;
}

interface DocumentWithRules {
  id: number;
  documentName: string;
  documentDescription: string;
  documentRules: DocumentRule[];
}

export function ViewRulesPage() {
  const [loading, setLoading] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [documentWithRules, setDocumentWithRules] = useState<DocumentWithRules | null>(null);

  // Load documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const result = await getAllDocuments() as any;

        if (result.status === "200 OK" || result.status === "success") {
          setDocuments(result.data || []);
        } else {
          toast.error(result.message || "Không thể tải danh sách tài liệu");
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Lỗi khi tải danh sách tài liệu");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // Load rules when document is selected
  const handleDocumentChange = async (documentId: string) => {
    setSelectedDocumentId(documentId);
    
    if (!documentId) {
      setDocumentWithRules(null);
      return;
    }

    try {
      setLoadingRules(true);
      const result = await getDocumentWithRules(Number(documentId)) as any;

      console.log("📄 Document with rules:", result);

      if (result.status === "200 OK" || result.status === "success") {
        setDocumentWithRules(result.data);
      } else {
        toast.error(result.message || "Không thể tải quy tắc");
        setDocumentWithRules(null);
      }
    } catch (error) {
      console.error("Error loading rules:", error);
      toast.error("Lỗi khi tải quy tắc");
      setDocumentWithRules(null);
    } finally {
      setLoadingRules(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Xem Quy Tắc</h1>
        <p className="text-sm text-muted-foreground">
          Chọn tài liệu để xem danh sách quy tắc
        </p>
      </div>

      {/* Document Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn tài liệu</label>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedDocumentId}
                onValueChange={handleDocumentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài liệu để xem quy tắc..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Không có tài liệu
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <SelectItem key={doc.id} value={String(doc.id)}>
                        {doc.documentName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      {loadingRules ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : documentWithRules ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {documentWithRules.documentName}
            </CardTitle>
            {documentWithRules.documentDescription && (
              <p className="text-sm text-muted-foreground mt-1">
                {documentWithRules.documentDescription}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Danh sách quy tắc ({documentWithRules.documentRules?.length || 0})
              </h4>
              {documentWithRules.documentRules?.length > 0 ? (
                <div className="grid gap-3">
                  {documentWithRules.documentRules.map((rule) => (
                    <div
                      key={rule.id || rule.documentRuleId}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <FileCheck className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium">{rule.documentRuleName}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rule.documentRuleDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Tài liệu này chưa có quy tắc nào
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : selectedDocumentId ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy dữ liệu</h3>
              <p className="text-sm text-muted-foreground">
                Không thể tải quy tắc cho tài liệu này
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Chọn tài liệu</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn một tài liệu từ danh sách để xem các quy tắc
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
