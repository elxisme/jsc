import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, Download, Calculator } from 'lucide-react';
import { Link } from 'wouter';

export function QuickActions() {
  const actions = [
    {
      title: 'Add New Staff',
      description: 'Register new employee',
      icon: UserPlus,
      href: '/staff/add',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Generate Payslips',
      description: 'Bulk payslip creation',
      icon: FileText,
      href: '/payroll/payslips',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Export Bank Report',
      description: 'Generate transfer files',
      icon: Download,
      href: '/payroll/bank-reports',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Manage Deductions',
      description: 'PAYE, Pension, NHF rates',
      icon: Calculator,
      href: '/admin/settings',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <action.icon className={`${action.iconColor} h-5 w-5`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
