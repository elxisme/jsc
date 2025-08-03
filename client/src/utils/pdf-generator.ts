import { PayslipData } from '@/types';

// Note: In a real implementation, you would use a proper PDF library like jsPDF or react-pdf
// For now, this provides the structure and will work with browser's print functionality

export function generatePayslipHTML(data: PayslipData): string {
  const { staffId, staffName, payPeriod, department, gradeLevel, step, calculation } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payslip - ${staffName}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                font-size: 12px;
                line-height: 1.4;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #1E40AF;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .logo {
                width: 60px;
                height: 60px;
                background: #1E40AF;
                border-radius: 8px;
                margin: 0 auto 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            .org-name {
                font-size: 18px;
                font-weight: bold;
                color: #1E40AF;
                margin-bottom: 5px;
            }
            .org-subtitle {
                color: #666;
                font-size: 14px;
            }
            .payslip-title {
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0 10px;
                text-align: center;
                text-transform: uppercase;
            }
            .employee-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 5px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            .label {
                font-weight: bold;
                width: 140px;
            }
            .value {
                flex: 1;
            }
            .earnings-section, .deductions-section {
                width: 48%;
                display: inline-block;
                vertical-align: top;
                margin-bottom: 20px;
            }
            .deductions-section {
                margin-left: 4%;
            }
            .section-title {
                background: #1E40AF;
                color: white;
                padding: 8px;
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .item {
                display: flex;
                justify-content: space-between;
                padding: 5px 8px;
                border-bottom: 1px dotted #ccc;
            }
            .item:last-child {
                border-bottom: none;
            }
            .total-row {
                background: #f0f0f0;
                font-weight: bold;
                margin-top: 10px;
                padding: 8px;
            }
            .net-pay {
                background: #1E40AF;
                color: white;
                padding: 15px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                border-radius: 5px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                text-align: center;
                color: #666;
                font-size: 10px;
            }
            @media print {
                body { margin: 0; padding: 15px; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">JSC</div>
            <div class="org-name">Judicial Service Committee</div>
            <div class="org-subtitle">Federal Republic of Nigeria</div>
        </div>

        <div class="payslip-title">Monthly Payslip</div>

        <div class="employee-info">
            <div>
                <div class="info-row">
                    <span class="label">Staff ID:</span>
                    <span class="value">${staffId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${staffName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Department:</span>
                    <span class="value">${department}</span>
                </div>
            </div>
            <div>
                <div class="info-row">
                    <span class="label">Pay Period:</span>
                    <span class="value">${payPeriod}</span>
                </div>
                <div class="info-row">
                    <span class="label">Grade Level:</span>
                    <span class="value">${gradeLevel}</span>
                </div>
                <div class="info-row">
                    <span class="label">Step:</span>
                    <span class="value">${step}</span>
                </div>
            </div>
        </div>

        <div class="earnings-section">
            <div class="section-title">EARNINGS</div>
            <div class="item">
                <span>Basic Salary</span>
                <span>₦${calculation.basicSalary.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>Housing Allowance</span>
                <span>₦${calculation.housingAllowance.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>Transport Allowance</span>
                <span>₦${calculation.transportAllowance.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>Medical Allowance</span>
                <span>₦${calculation.medicalAllowance.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>Leave Allowance</span>
                <span>₦${calculation.leaveAllowance.toLocaleString()}</span>
            </div>
            ${calculation.responsibilityAllowance > 0 ? `
            <div class="item">
                <span>Responsibility Allowance</span>
                <span>₦${calculation.responsibilityAllowance.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.hazardAllowance > 0 ? `
            <div class="item">
                <span>Hazard Allowance</span>
                <span>₦${calculation.hazardAllowance.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.overtime > 0 ? `
            <div class="item">
                <span>Overtime</span>
                <span>₦${calculation.overtime.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.bonus > 0 ? `
            <div class="item">
                <span>Bonus</span>
                <span>₦${calculation.bonus.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.arrears > 0 ? `
            <div class="item">
                <span>Arrears</span>
                <span>₦${calculation.arrears.toLocaleString()}</span>
            </div>` : ''}
            <div class="total-row">
                <span>GROSS PAY</span>
                <span>₦${calculation.grossPay.toLocaleString()}</span>
            </div>
        </div>

        <div class="deductions-section">
            <div class="section-title">DEDUCTIONS</div>
            <div class="item">
                <span>PAYE Tax</span>
                <span>₦${calculation.paye.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>Pension (8%)</span>
                <span>₦${calculation.pension.toLocaleString()}</span>
            </div>
            <div class="item">
                <span>NHF (2.5%)</span>
                <span>₦${calculation.nhf.toLocaleString()}</span>
            </div>
            ${calculation.insurance > 0 ? `
            <div class="item">
                <span>Insurance</span>
                <span>₦${calculation.insurance.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.unionDues > 0 ? `
            <div class="item">
                <span>Union Dues</span>
                <span>₦${calculation.unionDues.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.loanDeduction > 0 ? `
            <div class="item">
                <span>Loan Deduction</span>
                <span>₦${calculation.loanDeduction.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.cooperativeDeduction > 0 ? `
            <div class="item">
                <span>Cooperative</span>
                <span>₦${calculation.cooperativeDeduction.toLocaleString()}</span>
            </div>` : ''}
            ${calculation.otherDeductions > 0 ? `
            <div class="item">
                <span>Other Deductions</span>
                <span>₦${calculation.otherDeductions.toLocaleString()}</span>
            </div>` : ''}
            <div class="total-row">
                <span>TOTAL DEDUCTIONS</span>
                <span>₦${calculation.totalDeductions.toLocaleString()}</span>
            </div>
        </div>

        <div style="clear: both;"></div>

        <div class="net-pay">
            NET PAY: ₦${calculation.netPay.toLocaleString()}
        </div>

        <div class="footer">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p>Generated on ${new Date().toLocaleDateString()} | Judicial Service Committee Payroll System</p>
        </div>
    </body>
    </html>
  `;
}

export function printPayslip(data: PayslipData): void {
  const htmlContent = generatePayslipHTML(data);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
}

export function downloadPayslipHTML(data: PayslipData): void {
  const htmlContent = generatePayslipHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `payslip-${data.staffId}-${data.payPeriod.replace(/\s+/g, '-')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function generateBankTransferCSV(records: any[]): string {
  const headers = [
    'Staff ID',
    'Staff Name',
    'Account Number',
    'Bank Name',
    'Account Name',
    'Amount',
    'Bank Code'
  ];
  
  const csvContent = [
    headers.join(','),
    ...records.map(record => [
      record.staffId,
      `"${record.staffName}"`,
      record.accountNumber,
      `"${record.bankName}"`,
      `"${record.accountName}"`,
      record.amount,
      record.bankCode || ''
    ].join(','))
  ].join('\n');
  
  return csvContent;
}

export function downloadBankTransferFile(records: any[], filename: string): void {
  const csvContent = generateBankTransferCSV(records);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
