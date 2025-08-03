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
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Save, User, Briefcase, CreditCard, Users } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const staffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female']),
  address: z.string().min(1, 'Address is required'),
  
  // Employment details
  departmentId: z.string().min(1, 'Department is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  step: z.coerce.number().min(1).max(15),
  jobTitle: z.string().min(1, 'Job title is required'),
  employmentDate: z.string().min(1, 'Employment date is required'),
  
  // Banking details
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  
  // Pension details
  penNumber: z.string().optional(),
  pensionFundAdministrator: z.string().optional(),
  
  // Next of kin
  nextOfKinName: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinRelationship: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function AddStaff() {
  const [, setLocation] = useLocation();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      step: 1,
      gender: 'male',
    },
  });

  const addStaffMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const response = await apiRequest('POST', '/api/staff', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Staff Added',
        description: 'New staff member has been successfully added.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      setLocation('/staff');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add staff member.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: StaffFormData) => {
    addStaffMutation.mutate(data);
  };

  const gradeOptions = [
    'GL01', 'GL02', 'GL03', 'GL04', 'GL05', 'GL06', 'GL07', 'GL08', 'GL09',
    'GL10', 'GL11', 'GL12', 'GL13', 'GL14', 'GL15', 'GL16', 'GL17'
  ];

  const nigerianBanks = [
    'Access Bank', 'Citibank', 'Ecobank', 'Fidelity Bank', 'First Bank',
    'First City Monument Bank', 'Globus Bank', 'GTBank', 'Heritage Bank',
    'Keystone Bank', 'Kuda Bank', 'Parallex Bank', 'Polaris Bank',
    'Providus Bank', 'Stanbic IBTC', 'Standard Chartered', 'Sterling Bank',
    'SunTrust Bank', 'Union Bank', 'United Bank for Africa', 'Unity Bank',
    'Wema Bank', 'Zenith Bank'
  ];

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Add New Staff"
            subtitle="Register a new employee"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6">
            <div className="mb-6">
              <Link href="/staff">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Staff Directory
                </Button>
              </Link>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="employment" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Employment
                    </TabsTrigger>
                    <TabsTrigger value="banking" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Banking
                    </TabsTrigger>
                    <TabsTrigger value="nextofkin" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Next of Kin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="employment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Employment Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {departments.map((dept: any) => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="gradeLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade Level *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {gradeOptions.map((grade) => (
                                      <SelectItem key={grade} value={grade}>
                                        {grade}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="step"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Step *</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" max="15" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="employmentDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employment Date *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="banking">
                    <Card>
                      <CardHeader>
                        <CardTitle>Banking & Pension Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select bank" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {nigerianBanks.map((bank) => (
                                      <SelectItem key={bank} value={bank}>
                                        {bank}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="penNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PEN Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pensionFundAdministrator"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pension Fund Administrator</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="nextofkin">
                    <Card>
                      <CardHeader>
                        <CardTitle>Next of Kin Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="nextOfKinName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nextOfKinPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nextOfKinRelationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4 mt-6">
                  <Link href="/staff">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={addStaffMutation.isPending}>
                    {addStaffMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Add Staff
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
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
