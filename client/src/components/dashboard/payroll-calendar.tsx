import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarCheck, AlertTriangle, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function PayrollCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: deadlines = [] } = useQuery({
    queryKey: ['/api/dashboard/deadlines', currentMonth.getFullYear(), currentMonth.getMonth()],
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case 'data_collection':
        return CalendarCheck;
      case 'processing':
        return AlertTriangle;
      case 'payment':
        return CreditCard;
      default:
        return CalendarCheck;
    }
  };

  const getDeadlineColor = (type: string, daysRemaining: number) => {
    if (daysRemaining <= 1) {
      return 'border-red-200 bg-red-50 text-red-900';
    } else if (daysRemaining <= 3) {
      return 'border-amber-200 bg-amber-50 text-amber-900';
    } else {
      return 'border-blue-200 bg-blue-50 text-blue-900';
    }
  };

  const getIconColor = (type: string, daysRemaining: number) => {
    if (daysRemaining <= 1) {
      return 'bg-red-500';
    } else if (daysRemaining <= 3) {
      return 'bg-amber-500';
    } else {
      return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Payroll Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deadlines.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-8">
              No upcoming deadlines for this month
            </div>
          ) : (
            deadlines.map((deadline: any, index: number) => {
              const Icon = getDeadlineIcon(deadline.type);
              const daysRemaining = Math.ceil(
                (new Date(deadline.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getDeadlineColor(deadline.type, daysRemaining)}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 ${getIconColor(
                        deadline.type,
                        daysRemaining
                      )} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <p className="text-xs opacity-90">
                        {new Date(deadline.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {daysRemaining <= 0
                          ? 'Overdue'
                          : daysRemaining === 1
                          ? '1 day remaining'
                          : `${daysRemaining} days remaining`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
