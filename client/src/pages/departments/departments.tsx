import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Building, Users, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Department code is required'),
  description: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function Departments() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['/api/departments'],
  });

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: DepartmentFormData) => {
      const response = await apiRequest('POST', '/api/departments', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Department Created',
        description: 'New department has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create department.',
        variant: 'destructive',
      });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async (data: DepartmentFormData & { id: string }) => {
      const { id, ...updateData } = data;
      const response = await apiRequest('PUT', `/api/departments/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Department Updated',
        description: 'Department has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      setDialogOpen(false);
      setEditingDepartment(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update department.',
        variant: 'destructive',
      });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/departments/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Department Deleted',
        description: 'Department has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department.',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    form.setValue('name', department.name);
    form.setValue('code', department.code);
    form.setValue('description', department.description || '');
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      deleteDepartmentMutation.mutate(id);
    }
  };

  const onSubmit = (data: DepartmentFormData) => {
    if (editingDepartment) {
      updateDepartmentMutation.mutate({ ...data, id: editingDepartment.id });
    } else {
      createDepartmentMutation.mutate(data);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingDepartment(null);
    form.reset();
  };

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Departments"
            subtitle="Manage organizational departments"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Departments</CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingDepartment ? 'Edit Department' : 'Add New Department'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department Code *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={handleDialogClose}>
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                createDepartmentMutation.isPending ||
                                updateDepartmentMutation.isPending
                              }
                            >
                              {editingDepartment ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading departments...</div>
                ) : departments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No departments found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Staff Count</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((department: any) => (
                          <TableRow key={department.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Building className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{department.name}</p>
                                  {department.headOfDepartment && (
                                    <p className="text-sm text-gray-500">
                                      Head: {department.headOfDepartment}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">{department.code}</TableCell>
                            <TableCell>
                              <p className="text-sm text-gray-600 truncate max-w-xs">
                                {department.description || 'No description'}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span>{department._count?.staff || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={department.isActive ? 'default' : 'secondary'}
                                className={
                                  department.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {department.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(department)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => handleDelete(department.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
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

        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
