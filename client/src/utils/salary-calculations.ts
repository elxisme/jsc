import { PayrollCalculationInput, SalaryCalculation } from '@/types';

// CONJUSS Salary Structure Base Rates (in Naira)
const CONJUSS_BASE_SALARIES: { [key: string]: number[] } = {
  'GL01': [42000, 43470, 44940, 46410, 47880, 49350, 50820, 52290, 53760, 55230, 56700, 58170, 59640, 61110, 62580],
  'GL02': [48000, 49680, 51360, 53040, 54720, 56400, 58080, 59760, 61440, 63120, 64800, 66480, 68160, 69840, 71520],
  'GL03': [54000, 55890, 57780, 59670, 61560, 63450, 65340, 67230, 69120, 71010, 72900, 74790, 76680, 78570, 80460],
  'GL04': [62000, 64170, 66340, 68510, 70680, 72850, 75020, 77190, 79360, 81530, 83700, 85870, 88040, 90210, 92380],
  'GL05': [72000, 74520, 77040, 79560, 82080, 84600, 87120, 89640, 92160, 94680, 97200, 99720, 102240, 104760, 107280],
  'GL06': [84000, 86940, 89880, 92820, 95760, 98700, 101640, 104580, 107520, 110460, 113400, 116340, 119280, 122220, 125160],
  'GL07': [98000, 101430, 104860, 108290, 111720, 115150, 118580, 122010, 125440, 128870, 132300, 135730, 139160, 142590, 146020],
  'GL08': [115000, 119025, 123050, 127075, 131100, 135125, 139150, 143175, 147200, 151225, 155250, 159275, 163300, 167325, 171350],
  'GL09': [135000, 139725, 144450, 149175, 153900, 158625, 163350, 168075, 172800, 177525, 182250, 186975, 191700, 196425, 201150],
  'GL10': [160000, 165600, 171200, 176800, 182400, 188000, 193600, 199200, 204800, 210400, 216000, 221600, 227200, 232800, 238400],
  'GL11': [190000, 196700, 203400, 210100, 216800, 223500, 230200, 236900, 243600, 250300, 257000, 263700, 270400, 277100, 283800],
  'GL12': [225000, 232875, 240750, 248625, 256500, 264375, 272250, 280125, 288000, 295875, 303750, 311625, 319500, 327375, 335250],
  'GL13': [270000, 279450, 288900, 298350, 307800, 317250, 326700, 336150, 345600, 355050, 364500, 373950, 383400, 392850, 402300],
  'GL14': [320000, 331200, 342400, 353600, 364800, 376000, 387200, 398400, 409600, 420800, 432000, 443200, 454400, 465600, 476800],
  'GL15': [385000, 398425, 411850, 425275, 438700, 452125, 465550, 478975, 492400, 505825, 519250, 532675, 546100, 559525, 572950],
  'GL16': [465000, 481425, 497850, 514275, 530700, 547125, 563550, 579975, 596400, 612825, 629250, 645675, 662100, 678525, 694950],
  'GL17': [560000, 579800, 599600, 619400, 639200, 659000, 678800, 698600, 718400, 738200, 758000, 777800, 797600, 817400, 837200]
};

// Standard rates (as percentages)
const TAX_RATES = {
  PAYE_RATE: 0.075, // 7.5% for this bracket (simplified)
  PENSION_RATE: 0.08, // 8%
  NHF_RATE: 0.025, // 2.5%
};

// Allowance percentages of basic salary
const ALLOWANCE_RATES = {
  HOUSING: 0.20, // 20% of basic salary
  TRANSPORT: 0.15, // 15% of basic salary
  MEDICAL: 0.10, // 10% of basic salary
  LEAVE: 0.08, // 8% of basic salary
  RESPONSIBILITY: 0.05, // 5% of basic salary (varies by role)
  HAZARD: 0.03, // 3% of basic salary (for specific roles)
};

export function getBasicSalary(gradeLevel: string, step: number): number {
  const grades = CONJUSS_BASE_SALARIES[gradeLevel.toUpperCase()];
  if (!grades || step < 1 || step > 15) {
    throw new Error('Invalid grade level or step');
  }
  return grades[step - 1];
}

export function calculateAllowances(basicSalary: number, customAllowances?: any): any {
  return {
    housing: customAllowances?.housing ?? Math.round(basicSalary * ALLOWANCE_RATES.HOUSING),
    transport: customAllowances?.transport ?? Math.round(basicSalary * ALLOWANCE_RATES.TRANSPORT),
    medical: customAllowances?.medical ?? Math.round(basicSalary * ALLOWANCE_RATES.MEDICAL),
    leave: customAllowances?.leave ?? Math.round(basicSalary * ALLOWANCE_RATES.LEAVE),
    responsibility: customAllowances?.responsibility ?? Math.round(basicSalary * ALLOWANCE_RATES.RESPONSIBILITY),
    hazard: customAllowances?.hazard ?? Math.round(basicSalary * ALLOWANCE_RATES.HAZARD),
  };
}

export function calculatePAYE(grossPay: number): number {
  // Simplified PAYE calculation - in reality this would be more complex with tax bands
  const annualIncome = grossPay * 12;
  const taxFreeAllowance = 200000; // N200,000 annual tax-free allowance
  
  if (annualIncome <= taxFreeAllowance) {
    return 0;
  }
  
  const taxableIncome = annualIncome - taxFreeAllowance;
  let totalTax = 0;
  
  // Progressive tax bands (simplified)
  if (taxableIncome <= 300000) {
    totalTax = taxableIncome * 0.07;
  } else if (taxableIncome <= 600000) {
    totalTax = 300000 * 0.07 + (taxableIncome - 300000) * 0.11;
  } else if (taxableIncome <= 1100000) {
    totalTax = 300000 * 0.07 + 300000 * 0.11 + (taxableIncome - 600000) * 0.15;
  } else if (taxableIncome <= 1600000) {
    totalTax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + (taxableIncome - 1100000) * 0.19;
  } else if (taxableIncome <= 3200000) {
    totalTax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + 500000 * 0.19 + (taxableIncome - 1600000) * 0.21;
  } else {
    totalTax = 300000 * 0.07 + 300000 * 0.11 + 500000 * 0.15 + 500000 * 0.19 + 1600000 * 0.21 + (taxableIncome - 3200000) * 0.24;
  }
  
  return Math.round(totalTax / 12); // Monthly PAYE
}

export function calculateDeductions(grossPay: number, customDeductions?: any): any {
  return {
    paye: calculatePAYE(grossPay),
    pension: Math.round(grossPay * TAX_RATES.PENSION_RATE),
    nhf: Math.round(grossPay * TAX_RATES.NHF_RATE),
    insurance: customDeductions?.insurance ?? 0,
    unionDues: customDeductions?.unionDues ?? 0,
    loanDeduction: customDeductions?.loanDeduction ?? 0,
    cooperativeDeduction: customDeductions?.cooperativeDeduction ?? 0,
    otherDeductions: customDeductions?.otherDeductions ?? 0,
  };
}

export function calculatePayroll(input: PayrollCalculationInput): SalaryCalculation {
  // Get basic salary from CONJUSS structure
  const basicSalary = getBasicSalary(input.gradeLevel, input.step);
  
  // Calculate allowances
  const allowances = calculateAllowances(basicSalary, input.allowances);
  
  // Additional payments
  const overtime = input.additionalPayments?.overtime ?? 0;
  const bonus = input.additionalPayments?.bonus ?? 0;
  const arrears = input.additionalPayments?.arrears ?? 0;
  
  // Calculate gross pay
  const grossPay = basicSalary + 
                   allowances.housing + 
                   allowances.transport + 
                   allowances.medical + 
                   allowances.leave + 
                   allowances.responsibility + 
                   allowances.hazard + 
                   overtime + 
                   bonus + 
                   arrears;
  
  // Calculate deductions
  const deductions = calculateDeductions(grossPay, input.deductions);
  
  // Calculate total deductions
  const totalDeductions = deductions.paye + 
                          deductions.pension + 
                          deductions.nhf + 
                          deductions.insurance + 
                          deductions.unionDues + 
                          deductions.loanDeduction + 
                          deductions.cooperativeDeduction + 
                          deductions.otherDeductions;
  
  // Calculate net pay
  const netPay = grossPay - totalDeductions;
  
  return {
    basicSalary,
    housingAllowance: allowances.housing,
    transportAllowance: allowances.transport,
    medicalAllowance: allowances.medical,
    leaveAllowance: allowances.leave,
    responsibilityAllowance: allowances.responsibility,
    hazardAllowance: allowances.hazard,
    overtime,
    bonus,
    arrears,
    grossPay,
    paye: deductions.paye,
    pension: deductions.pension,
    nhf: deductions.nhf,
    insurance: deductions.insurance,
    unionDues: deductions.unionDues,
    loanDeduction: deductions.loanDeduction,
    cooperativeDeduction: deductions.cooperativeDeduction,
    otherDeductions: deductions.otherDeductions,
    totalDeductions,
    netPay,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function validateGradeAndStep(gradeLevel: string, step: number): boolean {
  const grades = CONJUSS_BASE_SALARIES[gradeLevel.toUpperCase()];
  return !!(grades && step >= 1 && step <= 15);
}
