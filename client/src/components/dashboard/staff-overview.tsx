import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Users, Shield, Wrench } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function StaffOverview() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['/api/dashboard/staff-overview'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const departments = [
    {
      name: 'Judicial Officers',
      description: 'Active staff',
      count: overview?.judicialOfficers || 0,
      gradeRange: 'GL 12-17',
      icon: Scale,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Administrative',
      description: 'Support staff',
      count: overview?.administrative || 0,
      gradeRange: 'GL 06-11',
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      name: 'Security',
      description: 'Safety personnel',
      count: overview?.security || 0,
      gradeRange: 'GL 03-08',
      icon: Shield,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Technical',
      description: 'IT & maintenance',
      count: overview?.technical || 0,
      gradeRange: 'GL 07-14',
      icon: Wrench,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Staff Overview</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {departments.map((dept, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${dept.iconBg} rounded-lg flex items-center justify-center`}>
                  <dept.icon className={`${dept.iconColor} h-4 w-4`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                  <p className="text-xs text-gray-500">{dept.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{dept.count}</p>
                <p className="text-xs text-gray-500">{dept.gradeRange}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Active Staff</span>
            <span className="text-lg font-semibold text-gray-900">
              {overview?.totalActive || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
