import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, CheckCircle, Upload, FileDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-activity'],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'staff_update':
        return UserCheck;
      case 'payroll_complete':
        return CheckCircle;
      case 'document_upload':
        return Upload;
      case 'export_generated':
        return FileDown;
      default:
        return CheckCircle;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'staff_update':
        return 'bg-blue-100 text-blue-600';
      case 'payroll_complete':
        return 'bg-green-100 text-green-600';
      case 'document_upload':
        return 'bg-amber-100 text-amber-600';
      case 'export_generated':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any, index: number) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${getIconColor(
                      activity.type
                    )}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
