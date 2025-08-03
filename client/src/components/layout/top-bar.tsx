import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onNotificationClick: () => void;
}

export function TopBar({ title, subtitle, onNotificationClick }: TopBarProps) {
  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notifications?.count || 0;

  const handleStartPayroll = () => {
    // Navigate to payroll processing
    window.location.href = '/payroll/process';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationClick}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button onClick={handleStartPayroll} className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" />
              Run Payroll
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
