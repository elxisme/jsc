import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Download, Eye, FileText, Calendar, Users } from 'lucide-react';
import { printPayslip, downloadPayslipHTML } from '@/utils/pdf-generator';
import { formatCurrency } from '@/utils/salary-calculations';

export default function Payslips() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: payslips = [], isLoading } = useQuery({
    queryKey: ['/api/payslips', searchTerm, selectedPeriod, selectedDepartment],
  });

  const { data: payrollRuns = [] } = useQuery({
    queryKey: ['/api/payroll/runs'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
    setPreviewOpen(true);
  };

  const handlePrintPayslip = (payslip: any) => {
    printPayslip({
      staffId: payslip.staff.staffId,
      staffName: `${payslip.staff.firstName} ${payslip.staff.lastName}`,
      payPeriod: payslip.payrollRun.payPeriod,
      department: payslip.staff.department.name,
      gradeLevel: payslip.staff.gradeLevel,
      step: payslip.staff.step,
      calculation: payslip,
    });
  };

  const handleDownloadPayslip = (payslip: any) => {
    downloadPayslipHTML({
      staffId: payslip.staff.staffId,
      staffName: `${payslip.staff.firstName} ${payslip.staff.lastName}`,
      payPeriod: payslip.payrollRun.payPeriod,
      department: payslip.staff.department.name,
      gradeLevel: payslip.staff.gradeLevel,
      step: payslip.staff.step,
      calculation: payslip,
    });
  };

  const handleBulkDownload = async () => {
    // In a real implementation, this would generate a ZIP file with all payslips
    for (const payslip of payslips) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to prevent overwhelming
      handleDownloadPayslip(payslip);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-800">Generated</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Payslips"
            subtitle="View and manage employee payslips"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Payslips</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleBulkDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Bulk Download
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by staff name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Pay Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      {payrollRuns.map((run: any) => (
                        <SelectItem key={run.id} value={run.id}>
                          {run.payPeriod}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {payslips.length}
                          </p>
                          <p className="text-sm text-gray-500">Total Payslips</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {payrollRuns.length}
                          </p>
                          <p className="text-sm text-gray-500">Pay Periods</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {new Set(payslips.map((p: any) => p.staff.department.name)).size}
                          </p>
                          <p className="text-sm text-gray-500">Departments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Download className="h-8 w-8 text-amber-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(payslips.reduce((sum: number, p: any) => sum + p.netPay, 0))}
                          </p>
                          <p className="text-sm text-gray-500">Total Net Pay</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payslips Table */}
                {isLoading ? (
                  <div className="text-center py-8">Loading payslips...</div>
                ) : payslips.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payslips found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff</TableHead>
                          <TableHead>Pay Period</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Grade/Step</TableHead>
                          <TableHead>Gross Pay</TableHead>
                          <TableHead>Net Pay</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payslips.map((payslip: any) => (
                          <TableRow key={payslip.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {payslip.staff.firstName} {payslip.staff.lastName}
                                </p>
                                <p className="text-sm text-gray-500 font-mono">
                                  {payslip.staff.staffId}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{payslip.payrollRun.payPeriod}</TableCell>
                            <TableCell>{payslip.staff.department.name}</TableCell>
                            <TableCell>
                              {payslip.staff.gradeLevel}/{payslip.staff.step}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(payslip.grossPay)}
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(payslip.netPay)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(payslip.status || 'generated')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewPayslip(payslip)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePrintPayslip(payslip)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownloadPayslip(payslip)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Payslip Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Payslip Preview - {selectedPayslip?.staff?.firstName} {selectedPayslip?.staff?.lastName}
              </DialogTitle>
            </DialogHeader>
            
            {selectedPayslip && (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-primary pb-4">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg">
                    JSC
                  </div>
                  <h2 className="text-xl font-bold text-primary">Judicial Service Committee</h2>
                  <p className="text-gray-600">Federal Republic of Nigeria</p>
                  <h3 className="text-lg font-semibold mt-4">MONTHLY PAYSLIP</h3>
                </div>

                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Staff ID:</span>
                      <span>{selectedPayslip.staff.staffId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedPayslip.staff.firstName} {selectedPayslip.staff.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{selectedPayslip.staff.department.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Pay Period:</span>
                      <span>{selectedPayslip.payrollRun.payPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Grade Level:</span>
                      <span>{selectedPayslip.staff.gradeLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Step:</span>
                      <span>{selectedPayslip.staff.step}</span>
                    </div>
                  </div>
                </div>

                {/* Earnings and Deductions */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div>
                    <h4 className="bg-primary text-white p-2 text-center font-semibold">EARNINGS</h4>
                    <div className="space-y-2 p-2 border">
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Basic Salary</span>
                        <span>{formatCurrency(selectedPayslip.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Housing Allowance</span>
                        <span>{formatCurrency(selectedPayslip.housingAllowance)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Transport Allowance</span>
                        <span>{formatCurrency(selectedPayslip.transportAllowance)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Medical Allowance</span>
                        <span>{formatCurrency(selectedPayslip.medicalAllowance)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Leave Allowance</span>
                        <span>{formatCurrency(selectedPayslip.leaveAllowance)}</span>
                      </div>
                      {selectedPayslip.responsibilityAllowance > 0 && (
                        <div className="flex justify-between py-1 border-b border-dotted">
                          <span>Responsibility Allowance</span>
                          <span>{formatCurrency(selectedPayslip.responsibilityAllowance)}</span>
                        </div>
                      )}
                      {selectedPayslip.hazardAllowance > 0 && (
                        <div className="flex justify-between py-1 border-b border-dotted">
                          <span>Hazard Allowance</span>
                          <span>{formatCurrency(selectedPayslip.hazardAllowance)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 bg-gray-100 font-semibold">
                        <span>GROSS PAY</span>
                        <span>{formatCurrency(selectedPayslip.grossPay)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <h4 className="bg-primary text-white p-2 text-center font-semibold">DEDUCTIONS</h4>
                    <div className="space-y-2 p-2 border">
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>PAYE Tax</span>
                        <span>{formatCurrency(selectedPayslip.paye)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>Pension (8%)</span>
                        <span>{formatCurrency(selectedPayslip.pension)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dotted">
                        <span>NHF (2.5%)</span>
                        <span>{formatCurrency(selectedPayslip.nhf)}</span>
                      </div>
                      {selectedPayslip.insurance > 0 && (
                        <div className="flex justify-between py-1 border-b border-dotted">
                          <span>Insurance</span>
                          <span>{formatCurrency(selectedPayslip.insurance)}</span>
                        </div>
                      )}
                      {selectedPayslip.unionDues > 0 && (
                        <div className="flex justify-between py-1 border-b border-dotted">
                          <span>Union Dues</span>
                          <span>{formatCurrency(selectedPayslip.unionDues)}</span>
                        </div>
                      )}
                      {selectedPayslip.loanDeduction > 0 && (
                        <div className="flex justify-between py-1 border-b border-dotted">
                          <span>Loan Deduction</span>
                          <span>{formatCurrency(selectedPayslip.loanDeduction)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 bg-gray-100 font-semibold">
                        <span>TOTAL DEDUCTIONS</span>
                        <span>{formatCurrency(selectedPayslip.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-primary text-white p-4 rounded-lg text-center">
                  <div className="text-xl font-bold">
                    NET PAY: {formatCurrency(selectedPayslip.netPay)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => handlePrintPayslip(selectedPayslip)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button onClick={() => handleDownloadPayslip(selectedPayslip)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
