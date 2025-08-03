export interface DashboardMetrics {
  totalStaff: number;
  monthlyPayroll: number;
  payrollGrowth: number;
  staffGrowth: number;
  pendingApprovals: number;
  departments: number;
}

export interface StaffOverview {
  totalActive: number;
  judicialOfficers: number;
  administrative: number;
  security: number;
  technical: number;
}

export interface RecentActivity {
  id: string;
  type: 'staff_update' | 'payroll_complete' | 'document_upload' | 'export_generated';
  description: string;
  createdAt: string;
}

export interface PayrollDeadline {
  id: string;
  title: string;
  date: string;
  type: 'data_collection' | 'processing' | 'payment';
}

export interface NotificationCount {
  count: number;
}

export interface SalaryCalculation {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  medicalAllowance: number;
  leaveAllowance: number;
  responsibilityAllowance: number;
  hazardAllowance: number;
  overtime: number;
  bonus: number;
  arrears: number;
  grossPay: number;
  paye: number;
  pension: number;
  nhf: number;
  insurance: number;
  unionDues: number;
  loanDeduction: number;
  cooperativeDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollCalculationInput {
  gradeLevel: string;
  step: number;
  allowances?: Partial<{
    housing: number;
    transport: number;
    medical: number;
    leave: number;
    responsibility: number;
    hazard: number;
  }>;
  additionalPayments?: Partial<{
    overtime: number;
    bonus: number;
    arrears: number;
  }>;
  deductions?: Partial<{
    insurance: number;
    unionDues: number;
    loanDeduction: number;
    cooperativeDeduction: number;
    otherDeductions: number;
  }>;
}

export interface BankTransferRecord {
  staffId: string;
  staffName: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  amount: number;
  bankCode?: string;
}

export interface PayslipData {
  staffId: string;
  staffName: string;
  payPeriod: string;
  department: string;
  gradeLevel: string;
  step: number;
  calculation: SalaryCalculation;
}

export interface PayrollRunSummary {
  id: string;
  title: string;
  payPeriod: string;
  status: 'draft' | 'pending_review' | 'approved' | 'finalized' | 'paid';
  totalAmount: number;
  staffCount: number;
  createdAt: string;
  createdBy: string;
}

export interface SystemSettings {
  payeRate: number;
  pensionRate: number;
  nhfRate: number;
  organizationName: string;
  organizationLogo?: string;
  contactDetails: {
    address: string;
    phone: string;
    email: string;
  };
}
