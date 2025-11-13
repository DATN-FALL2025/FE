export interface CriteriaItem {
  id: string;
  position: string;
  hoSoNangLuc: boolean;
  bangCapChuyenMon: boolean;
  chungChiNgheNghiep: boolean;
  experienceYears: number;
  educationLevel: string;
}

export interface MatrixProgram {
  id: string;
  program: string;
  code: string;
  documents: number;
  createdBy: string;
  status: "pending_review" | "approved" | "rejected";
}

