import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { calculatePayroll, formatCurrency } from '@/utils/salary-calculations';
import { ArrowLeft, Play, Calculator, Check, AlertCircle, Users } from 'lucide-react';
import { Link } from 'wouter';

const payrollSchema = z.object({
  title: z.string().min(1, 'Payroll title is required'),
  payPeriod: z.string().min(1, 'Pay period is required'),
  departments: z.array(z.string()).min(1, 'At least one department must be selected'),
});

type PayrollFormData = z.infer<typeof payrollSchema>;

export default function ProcessPayroll() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [calculatedPayroll, setCalculatedPayroll] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const { data: currentPayroll } = useQuery({
    queryKey: ['/api/payroll/current'],
  });

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      title: `Payroll - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      payPeriod: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      departments: [],
    },
  });

  const selectedDepartments = form.watch('departments');

  const { data: eligibleStaff = [] } = useQuery({
    queryKey: ['/api/staff/eligible-for-payroll', selectedDepartments],
    enabled: selectedDepartments.length > 0,
  });

  const createPayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormData) => {
      const response = await apiRequest('POST', '/api/payroll/create', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payroll Created',
        description: 'Payroll run has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payroll'] });
      setActiveTab('staff');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create payroll.',
        variant: 'destructive',
      });
    },
  });

  const calculatePayrollMutation = useMutation({
    mutationFn: async (staffIds: string[]) => {
      const response = await apiRequest('POST', '/api/payroll/calculate', { staffIds });
      return response.json();
    },
    onSuccess: (data) => {
      setCalculatedPayroll(data.calculations);
      setActiveTab('review');
      toast({
        title: 'Calculations Complete',
        description: `Payroll calculated for ${data.calculations.length} staff members.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Calculation Error',
        description: error.message || 'Failed to calculate payroll.',
        variant: 'destructive',
      });
    },
  });

  const submitPayrollMutation = useMutation({
    mutationFn: async (payrollData: any) => {
      const response = await apiRequest('POST', '/api/payroll/submit', payrollData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payroll Submitted',
        description: 'Payroll has been submitted for review.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payroll'] });
      setActiveTab('complete');
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Error',
        description: error.message || 'Failed to submit payroll.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: PayrollFormData) => {
    createPayrollMutation.mutate(data);
  };

  const handleStaffSelection = (staffId: string, selected: boolean) => {
    if (selected) {
      const staff = eligibleStaff.find((s: any) => s.id === staffId);
      if (staff) {
        setSelectedStaff([...selectedStaff, staff]);
      }
    } else {
      setSelectedStaff(selectedStaff.filter((s) => s.id !== staffId));
    }
  };

  const handleCalculatePayroll = () => {
    const staffIds = selectedStaff.map((s) => s.id);
    calculatePayrollMutation.mutate(staffIds);
  };

  const handleSubmitPayroll = () => {
    const payrollData = {
      title: form.getValues('title'),
      payPeriod: form.getValues('payPeriod'),
      calculations: calculatedPayroll,
    };
    submitPayrollMutation.mutate(payrollData);
  };

  const totalGrossPay = calculatedPayroll.reduce((sum, calc) => sum + calc.grossPay, 0);
  const totalDeductions = calculatedPayroll.reduce((sum, calc) => sum + calc.totalDeductions, 0);
  const totalNetPay = calculatedPayroll.reduce((sum, calc) => sum + calc.netPay, 0);

  const getTabStatus = (tab: string) => {
    switch (tab) {
      case 'setup':
        return currentPayroll ? 'complete' : 'active';
      case 'staff':
        return selectedStaff.length > 0 ? 'complete' : currentPayroll ? 'active' : 'pending';
      case 'review':
        return calculatedPayroll.length > 0 ? 'complete' : selectedStaff.length > 0 ? 'active' : 'pending';
      case 'complete':
        return calculatedPayroll.length > 0 ? 'active' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Process Payroll"
            subtitle="Create and calculate monthly payroll"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6">
            <div className="mb-6">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getTabStatus('setup') === 'complete' ? 'bg-green-500' : 
                    getTabStatus('setup') === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  Setup
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2" disabled={!currentPayroll}>
                  <div className={`w-2 h-2 rounded-full ${
                    getTabStatus('staff') === 'complete' ? 'bg-green-500' : 
                    getTabStatus('staff') === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  Select Staff
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2" disabled={selectedStaff.length === 0}>
                  <div className={`w-2 h-2 rounded-full ${
                    getTabStatus('review') === 'complete' ? 'bg-green-500' : 
                    getTabStatus('review') === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  Review
                </TabsTrigger>
                <TabsTrigger value="complete" className="flex items-center gap-2" disabled={calculatedPayroll.length === 0}>
                  <div className={`w-2 h-2 rounded-full ${
                    getTabStatus('complete') === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  Submit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup">
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payroll Title *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="payPeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pay Period *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="departments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Departments *</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {departments.map((dept: any) => (
                                  <label key={dept.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(dept.id)}
                                      onChange={(e) => {
                                        const updatedDepts = e.target.checked
                                          ? [...field.value, dept.id]
                                          : field.value.filter((id) => id !== dept.id);
                                        field.onChange(updatedDepts);
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-sm">{dept.name}</span>
                                  </label>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" disabled={createPayrollMutation.isPending}>
                          {createPayrollMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Create Payroll Run
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="staff">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Select Staff for Payroll</CardTitle>
                      <Badge variant="outline">
                        {selectedStaff.length} of {eligibleStaff.length} selected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {eligibleStaff.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No eligible staff found for selected departments
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedStaff([...eligibleStaff])}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedStaff([])}
                          >
                            Clear All
                          </Button>
                        </div>

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">Select</TableHead>
                                <TableHead>Staff ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Grade/Step</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eligibleStaff.map((staff: any) => (
                                <TableRow key={staff.id}>
                                  <TableCell>
                                    <input
                                      type="checkbox"
                                      checked={selectedStaff.some((s) => s.id === staff.id)}
                                      onChange={(e) => handleStaffSelection(staff.id, e.target.checked)}
                                      className="rounded"
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">{staff.staffId}</TableCell>
                                  <TableCell>
                                    {staff.firstName} {staff.lastName}
                                  </TableCell>
                                  <TableCell>{staff.department?.name}</TableCell>
                                  <TableCell>
                                    {staff.gradeLevel}/{staff.step}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-100 text-green-800">
                                      {staff.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={handleCalculatePayroll}
                            disabled={selectedStaff.length === 0 || calculatePayrollMutation.isPending}
                          >
                            {calculatePayrollMutation.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Calculating...
                              </>
                            ) : (
                              <>
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculate Payroll ({selectedStaff.length} staff)
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review">
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(totalGrossPay)}
                          </p>
                          <p className="text-sm text-gray-500">Total Gross Pay</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalDeductions)}
                          </p>
                          <p className="text-sm text-gray-500">Total Deductions</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalNetPay)}
                          </p>
                          <p className="text-sm text-gray-500">Total Net Pay</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Calculations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payroll Calculations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {calculatedPayroll.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No calculations available
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Staff</TableHead>
                                <TableHead>Basic Salary</TableHead>
                                <TableHead>Allowances</TableHead>
                                <TableHead>Gross Pay</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {calculatedPayroll.map((calc: any) => (
                                <TableRow key={calc.staffId}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{calc.staffName}</p>
                                      <p className="text-sm text-gray-500">{calc.staffId}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{formatCurrency(calc.basicSalary)}</TableCell>
                                  <TableCell>
                                    {formatCurrency(
                                      calc.housingAllowance +
                                      calc.transportAllowance +
                                      calc.medicalAllowance +
                                      calc.leaveAllowance +
                                      calc.responsibilityAllowance +
                                      calc.hazardAllowance
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(calc.grossPay)}
                                  </TableCell>
                                  <TableCell className="text-red-600">
                                    {formatCurrency(calc.totalDeductions)}
                                  </TableCell>
                                  <TableCell className="font-medium text-green-600">
                                    {formatCurrency(calc.netPay)}
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
              </TabsContent>

              <TabsContent value="complete">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Payroll for Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900">
                              Ready for Submission
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              This payroll run will be submitted for Account Admin review and approval.
                              Once submitted, calculations cannot be modified.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Payroll Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Staff:</span>
                              <span>{calculatedPayroll.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Gross Pay:</span>
                              <span>{formatCurrency(totalGrossPay)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Deductions:</span>
                              <span>{formatCurrency(totalDeductions)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total Net Pay:</span>
                              <span>{formatCurrency(totalNetPay)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setActiveTab('review')}>
                          Back to Review
                        </Button>
                        <Button
                          onClick={handleSubmitPayroll}
                          disabled={submitPayrollMutation.isPending}
                        >
                          {submitPayrollMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Submit for Approval
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
