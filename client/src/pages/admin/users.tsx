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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Super Admin', 'Account Admin', 'Payroll Admin', 'Staff']),
  isActive: z.boolean(),
});

type UserForm = z.infer<typeof userSchema>;

const mockUsers = [
  {
    id: 'e9fac583-e29f-4880-b526-bbc87eca590a',
    email: 'admin@jsc.gov.ng',
    role: 'Super Admin',
    isActive: true,
    createdAt: '2025-01-01',
    lastLogin: '2025-08-03',
  },
  {
    id: '17f801f1-5e93-48aa-9119-166eba5f6897',
    email: 'test@jsc.gov.ng',
    role: 'Super Admin',
    isActive: true,
    createdAt: '2025-01-01',
    lastLogin: '2025-08-03',
  },
  {
    id: '3',
    email: 'payroll@jsc.gov.ng',
    role: 'Payroll Admin',
    isActive: true,
    createdAt: '2025-01-15',
    lastLogin: '2025-08-02',
  },
  {
    id: '4',
    email: 'accounts@jsc.gov.ng',
    role: 'Account Admin',
    isActive: true,
    createdAt: '2025-01-20',
    lastLogin: '2025-08-01',
  },
];

export default function UserManagement() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'Staff',
      isActive: true,
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: UserForm) => {
      const response = await apiRequest('POST', '/api/auth/create-test-user', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'User Created',
        description: 'New user has been created successfully.',
      });
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: UserForm) => {
    addUserMutation.mutate(data);
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-red-100 text-red-800';
      case 'Account Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Payroll Admin':
        return 'bg-green-100 text-green-800';
      case 'Staff':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthGuard requiredRole={['Super Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="User Management"
            subtitle="Manage system users and permissions"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6 space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Account Admin">Account Admin</SelectItem>
                    <SelectItem value="Payroll Admin">Payroll Admin</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="user@jsc.gov.ng" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Staff">Staff</SelectItem>
                                <SelectItem value="Payroll Admin">Payroll Admin</SelectItem>
                                <SelectItem value="Account Admin">Account Admin</SelectItem>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addUserMutation.isPending}>
                          {addUserMutation.isPending ? 'Creating...' : 'Create User'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.email}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                            {user.isActive ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {user.createdAt}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="h-3 w-3" />
                            Last login: {user.lastLogin}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">No users found</h3>
                      <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Super Admins</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <Shield className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Account Admins</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payroll Admins</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Staff Users</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Users className="h-8 w-8 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
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