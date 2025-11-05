export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Position {
  id: string;
  code: string;
  name: string;
  level: number;
  departmentId: string;
  description?: string;
}

export interface CertificateType {
  id: string;
  name: string;
  description?: string;
  isRequired?: boolean;
}

export interface MatrixRule {
  id: string;
  positionId: string;
  certificateTypeId: string;
  departmentId: string;
  status: "required" | "optional" | "not_required";
  priority?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface DocumentMatrix {
  positions: Position[];
  certificateTypes: CertificateType[];
  rules: MatrixRule[];
}

export interface MatrixStats {
  totalPositions: number;
  totalCertificates: number;
  totalRules: number;
  requiredRules: number;
  optionalRules: number;
}
