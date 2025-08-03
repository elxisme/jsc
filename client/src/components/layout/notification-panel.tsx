import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Clock, UserPlus, CheckCircle, FileDown } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isOpen,
  });

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pending_approval':
        return Clock;
      case 'staff_added':
        return UserPlus;
      case 'payroll_complete':
        return CheckCircle;
      case 'export_ready':
        return FileDown;
      default:
        return Clock;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'pending_approval':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'staff_added':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'payroll_complete':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'export_ready':
        return 'bg-purple-50 border-purple-200 text-purple-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pending_approval':
        return 'bg-amber-500 text-white';
      case 'staff_added':
        return 'bg-blue-500 text-white';
      case 'payroll_complete':
        return 'bg-green-500 text-white';
      case 'export_ready':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-40',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500">No notifications</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: any) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      'border cursor-pointer transition-colors',
                      getNotificationColor(notification.type),
                      !notification.isRead && 'ring-2 ring-primary/20'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                            getIconColor(notification.type)
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <Badge variant="default" className="ml-2 h-2 w-2 p-0 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs mt-1 opacity-90">
                            {notification.message}
                          </p>
                          <p className="text-xs mt-2 opacity-70">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
