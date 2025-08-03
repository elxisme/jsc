import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

export function PayrollWorkflow() {
  const { data: currentPayroll, isLoading } = useQuery({
    queryKey: ['/api/payroll/current'],
  });

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'finalized':
        return <Badge className="bg-green-100 text-green-800">Finalized</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const workflowSteps = [
    {
      title: 'Data Collection & Validation',
      status: 'completed',
      description: 'Completed by Payroll Admin • 2 hours ago',
    },
    {
      title: 'Account Admin Review',
      status: currentPayroll?.status === 'pending_review' ? 'current' : 'pending',
      description: `${
        currentPayroll?.status === 'pending_review'
          ? 'Pending approval • Review required'
          : 'Awaiting previous step completion'
      }`,
    },
    {
      title: 'Super Admin Final Approval',
      status: 'pending',
      description: 'Awaiting previous step completion',
    },
    {
      title: 'Bank File Generation & Transfer',
      status: 'pending',
      description: 'Final step - automatic processing',
    },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Current Payroll Status</CardTitle>
          {currentPayroll && getStatusBadge(currentPayroll.status)}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!currentPayroll ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No active payroll run</p>
            <Link href="/payroll/process">
              <Button>Start New Payroll Run</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : step.status === 'current'
                        ? 'bg-amber-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="text-white h-4 w-4" />
                    ) : step.status === 'current' ? (
                      <Clock className="text-white h-4 w-4" />
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-xs ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {step.status === 'current' && (
                    <Link href="/payroll/review">
                      <Button variant="ghost" size="sm" className="text-primary">
                        Review <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Payroll Period: {currentPayroll.payPeriod}
                </span>
                <span className="text-gray-900 font-medium">
                  Total: ₦{(currentPayroll.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
