import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, Clock, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Staff',
      value: metrics?.totalStaff || 0,
      change: `+${metrics?.staffGrowth || 0} this month`,
      changeType: 'positive',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Monthly Payroll',
      value: `₦${(metrics?.monthlyPayroll || 0).toLocaleString()}`,
      change: `+${metrics?.payrollGrowth || 0}% vs last month`,
      changeType: 'positive',
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pendingApprovals || 0,
      change: 'Requires attention',
      changeType: 'warning',
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Departments',
      value: metrics?.departments || 0,
      change: 'Active units',
      changeType: 'neutral',
      icon: Building,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : card.changeType === 'warning'
                      ? 'text-amber-600'
                      : 'text-gray-500'
                  }`}
                >
                  {card.changeType === 'positive' && '↗ '}
                  {card.changeType === 'warning' && '⏰ '}
                  {card.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
