import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Building, 
  DollarSign, 
  Calculator, 
  Bell, 
  Shield,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

const generalSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationCode: z.string().min(1, 'Organization code is required'),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  financialYear: z.string().min(1, 'Financial year is required'),
  payrollCycle: z.enum(['monthly', 'bi-weekly', 'weekly']),
});

const allowanceSchema = z.object({
  name: z.string().min(1, 'Allowance name is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  percentage: z.coerce.number().min(0).max(100).optional(),
  isPercentage: z.boolean(),
  applicableGrades: z.array(z.string()).min(1, 'Select at least one grade'),
});

const deductionSchema = z.object({
  name: z.string().min(1, 'Deduction name is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  percentage: z.coerce.number().min(0).max(100).optional(),
  isPercentage: z.boolean(),
  isMandatory: z.boolean(),
});

type GeneralSettings = z.infer<typeof generalSettingsSchema>;
type AllowanceForm = z.infer<typeof allowanceSchema>;
type DeductionForm = z.infer<typeof deductionSchema>;

export default function SystemSettings() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [allowances, setAllowances] = useState([
    { id: 1, name: 'Housing Allowance', amount: 50000, isPercentage: false, applicableGrades: ['GL01', 'GL02'] },
    { id: 2, name: 'Transport Allowance', amount: 25000, isPercentage: false, applicableGrades: ['GL01', 'GL02', 'GL03'] },
    { id: 3, name: 'Medical Allowance', amount: 15, isPercentage: true, applicableGrades: ['GL01', 'GL02', 'GL03', 'GL04'] },
  ]);
  const [deductions, setDeductions] = useState([
    { id: 1, name: 'PAYE Tax', amount: 10, isPercentage: true, isMandatory: true },
    { id: 2, name: 'Pension Contribution', amount: 8, isPercentage: true, isMandatory: true },
    { id: 3, name: 'NHF Contribution', amount: 2.5, isPercentage: true, isMandatory: true },
  ]);
  const { toast } = useToast();

  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      organizationName: 'Judicial Service Committee',
      organizationCode: 'JSC',
      address: 'Three Arms Zone, Central Area, Abuja, Nigeria',
      email: 'info@jsc.gov.ng',
      phone: '+234-9-234-5678',
      financialYear: '2025',
      payrollCycle: 'monthly',
    },
  });

  const allowanceForm = useForm<AllowanceForm>({
    resolver: zodResolver(allowanceSchema),
    defaultValues: {
      isPercentage: false,
      applicableGrades: [],
    },
  });

  const deductionForm = useForm<DeductionForm>({
    resolver: zodResolver(deductionSchema),
    defaultValues: {
      isPercentage: false,
      isMandatory: false,
    },
  });

  const onSaveGeneral = (data: GeneralSettings) => {
    toast({
      title: 'Settings Saved',
      description: 'General settings have been updated successfully.',
    });
  };

  const onAddAllowance = (data: AllowanceForm) => {
    const newAllowance = {
      id: Date.now(),
      ...data,
    };
    setAllowances([...allowances, newAllowance]);
    allowanceForm.reset();
    toast({
      title: 'Allowance Added',
      description: 'New allowance has been added successfully.',
    });
  };

  const onAddDeduction = (data: DeductionForm) => {
    const newDeduction = {
      id: Date.now(),
      ...data,
    };
    setDeductions([...deductions, newDeduction]);
    deductionForm.reset();
    toast({
      title: 'Deduction Added',
      description: 'New deduction has been added successfully.',
    });
  };

  const removeAllowance = (id: number) => {
    setAllowances(allowances.filter(a => a.id !== id));
    toast({
      title: 'Allowance Removed',
      description: 'Allowance has been removed successfully.',
    });
  };

  const removeDeduction = (id: number) => {
    setDeductions(deductions.filter(d => d.id !== id));
    toast({
      title: 'Deduction Removed',
      description: 'Deduction has been removed successfully.',
    });
  };

  const gradeOptions = [
    'GL01', 'GL02', 'GL03', 'GL04', 'GL05', 'GL06', 'GL07', 'GL08', 'GL09',
    'GL10', 'GL11', 'GL12', 'GL13', 'GL14', 'GL15', 'GL16', 'GL17'
  ];

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="System Settings"
            subtitle="Configure system-wide settings and parameters"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6 space-y-6">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="conjuss" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  CONJUSS
                </TabsTrigger>
                <TabsTrigger value="allowances" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Allowances
                </TabsTrigger>
                <TabsTrigger value="deductions" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Deductions
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  System
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...generalForm}>
                      <form onSubmit={generalForm.handleSubmit(onSaveGeneral)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={generalForm.control}
                            name="organizationName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="organizationCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Official Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Official Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="financialYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Financial Year</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="payrollCycle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payroll Cycle</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={generalForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Official Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save General Settings
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CONJUSS Settings */}
              <TabsContent value="conjuss">
                <Card>
                  <CardHeader>
                    <CardTitle>CONJUSS Salary Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Current CONJUSS salary structure (Grade Levels GL01-GL17, Steps 1-15).
                        Contact system administrator to modify salary scales.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold">Lower Cadre</h4>
                          <p className="text-sm text-gray-600">GL01 - GL06</p>
                          <p className="text-sm">Entry level positions</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold">Middle Cadre</h4>
                          <p className="text-sm text-gray-600">GL07 - GL12</p>
                          <p className="text-sm">Supervisory positions</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold">Senior Cadre</h4>
                          <p className="text-sm text-gray-600">GL13 - GL17</p>
                          <p className="text-sm">Management positions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Allowances */}
              <TabsContent value="allowances">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Allowance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...allowanceForm}>
                        <form onSubmit={allowanceForm.handleSubmit(onAddAllowance)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={allowanceForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Allowance Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Housing Allowance" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={allowanceForm.control}
                              name="isPercentage"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Percentage-based</FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={allowanceForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {allowanceForm.watch('isPercentage') ? 'Percentage (%)' : 'Fixed Amount (₦)'}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" step="0.01" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Allowance
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Current Allowances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {allowances.map((allowance) => (
                          <div key={allowance.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{allowance.name}</h4>
                              <p className="text-sm text-gray-600">
                                {allowance.isPercentage ? `${allowance.amount}%` : `₦${allowance.amount.toLocaleString()}`}
                                {' • '} Grades: {allowance.applicableGrades.join(', ')}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAllowance(allowance.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Deductions */}
              <TabsContent value="deductions">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Deduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...deductionForm}>
                        <form onSubmit={deductionForm.handleSubmit(onAddDeduction)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={deductionForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Deduction Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Staff Loan" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={deductionForm.control}
                              name="isPercentage"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Percentage-based</FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={deductionForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {deductionForm.watch('isPercentage') ? 'Percentage (%)' : 'Fixed Amount (₦)'}
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} type="number" step="0.01" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={deductionForm.control}
                              name="isMandatory"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Mandatory</FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button type="submit" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Deduction
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Current Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {deductions.map((deduction) => (
                          <div key={deduction.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-semibold">{deduction.name}</h4>
                              <p className="text-sm text-gray-600">
                                {deduction.isPercentage ? `${deduction.amount}%` : `₦${deduction.amount.toLocaleString()}`}
                                {deduction.isMandatory && ' • Mandatory'}
                              </p>
                            </div>
                            {!deduction.isMandatory && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeDeduction(deduction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Payroll Reminders</h4>
                            <p className="text-sm text-gray-600">Send reminders for payroll deadlines</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Staff Updates</h4>
                            <p className="text-sm text-gray-600">Notify when staff information changes</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">System Alerts</h4>
                            <p className="text-sm text-gray-600">Important system notifications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Send notifications via email</p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Notification Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System */}
              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Backup & Recovery</h4>
                          <p className="text-sm text-gray-600 mb-2">Configure automatic backups</p>
                          <Button variant="outline">Configure Backup</Button>
                        </div>

                        <div>
                          <h4 className="font-semibold">Data Retention</h4>
                          <p className="text-sm text-gray-600 mb-2">Set data retention policies</p>
                          <Select defaultValue="2-years">
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-year">1 Year</SelectItem>
                              <SelectItem value="2-years">2 Years</SelectItem>
                              <SelectItem value="5-years">5 Years</SelectItem>
                              <SelectItem value="indefinite">Indefinite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h4 className="font-semibold">Security Settings</h4>
                          <p className="text-sm text-gray-600 mb-2">Configure security parameters</p>
                          <div className="flex items-center justify-between">
                            <span>Two-Factor Authentication</span>
                            <Switch />
                          </div>
                        </div>
                      </div>

                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save System Settings
                      </Button>
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