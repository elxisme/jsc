import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Download, University, FileSpreadsheet, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { downloadBankTransferFile } from '@/utils/pdf-generator';
import { formatCurrency } from '@/utils/salary-calculations';
import { useToast } from '@/hooks/use-toast';

export default function BankReports() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedBank, setSelectedBank] = useState('all');
  const [activeTab, setActiveTab] = useState('generate');
  const { toast } = useToast();

  const { data: payrollRuns = [] } = useQuery({
    queryKey: ['/api/payroll/runs'],
  });

  const { data: bankData = [], isLoading } = useQuery({
    queryKey: ['/api/payroll/bank-data', selectedPeriod],
    enabled: !!selectedPeriod,
  });

  const { data: previousReports = [] } = useQuery({
    queryKey: ['/api/payroll/bank-reports'],
  });

  const nigerianBanks = [
    { name: 'Access Bank', code: '044' },
    { name: 'Citibank', code: '023' },
    { name: 'Ecobank', code: '050' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'First Bank', code: '011' },
    { name: 'First City Monument Bank', code: '214' },
    { name: 'Globus Bank', code: '00103' },
    { name: 'GTBank', code: '058' },
    { name: 'Heritage Bank', code: '030' },
    { name: 'Keystone Bank', code: '082' },
    { name: 'Polaris Bank', code: '076' },
    { name: 'Stanbic IBTC', code: '221' },
    { name: 'Standard Chartered', code: '068' },
    { name: 'Sterling Bank', code: '232' },
    { name: 'Union Bank', code: '032' },
    { name: 'United Bank for Africa', code: '033' },
    { name: 'Unity Bank', code: '215' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Zenith Bank', code: '057' },
  ];

  const generateBankReport = (bankName: string) => {
    const bankRecords = bankData.filter((record: any) => 
      selectedBank === 'all' || record.bankName === bankName
    );

    if (bankRecords.length === 0) {
      toast({
        title: 'No Records',
        description: `No payment records found for ${bankName}`,
        variant: 'destructive',
      });
      return;
    }

    const bank = nigerianBanks.find(b => b.name === bankName);
    const filename = `${bankName.replace(/\s+/g, '_')}_Transfer_${selectedPeriod.replace(/\s+/g, '_')}`;
    
    const transferRecords = bankRecords.map((record: any) => ({
      ...record,
      bankCode: bank?.code || '',
    }));

    downloadBankTransferFile(transferRecords, filename);

    toast({
      title: 'Report Generated',
      description: `Bank transfer file for ${bankName} has been downloaded.`,
    });
  };

  const generateAllBanksReport = () => {
    const bankGroups = bankData.reduce((groups: any, record: any) => {
      const bank = record.bankName;
      if (!groups[bank]) {
        groups[bank] = [];
      }
      groups[bank].push(record);
      return groups;
    }, {});

    Object.keys(bankGroups).forEach(bankName => {
      const bank = nigerianBanks.find(b => b.name === bankName);
      const filename = `${bankName.replace(/\s+/g, '_')}_Transfer_${selectedPeriod.replace(/\s+/g, '_')}`;
      
      const transferRecords = bankGroups[bankName].map((record: any) => ({
        ...record,
        bankCode: bank?.code || '',
      }));

      downloadBankTransferFile(transferRecords, filename);
    });

    toast({
      title: 'All Reports Generated',
      description: `Bank transfer files for all banks have been downloaded.`,
    });
  };

  const getBankSummary = () => {
    const summary = bankData.reduce((acc: any, record: any) => {
      const bank = record.bankName;
      if (!acc[bank]) {
        acc[bank] = {
          count: 0,
          totalAmount: 0,
        };
      }
      acc[bank].count++;
      acc[bank].totalAmount += record.amount;
      return acc;
    }, {});

    return Object.keys(summary).map(bankName => ({
      bankName,
      ...summary[bankName],
    }));
  };

  const getReportStatus = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge className="bg-green-100 text-green-800">Generated</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'processing':
        return <Badge className="bg-amber-100 text-amber-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalAmount = bankData.reduce((sum: number, record: any) => sum + record.amount, 0);
  const totalRecords = bankData.length;
  const bankSummary = getBankSummary();

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Bank Reports"
            subtitle="Generate payment transfer files for banks"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generate Reports</TabsTrigger>
                <TabsTrigger value="history">Report History</TabsTrigger>
              </TabsList>

              <TabsContent value="generate">
                <div className="space-y-6">
                  {/* Selection Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Report Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Pay Period *</label>
                          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pay period" />
                            </SelectTrigger>
                            <SelectContent>
                              {payrollRuns.map((run: any) => (
                                <SelectItem key={run.id} value={run.id}>
                                  {run.payPeriod} - {run.status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Bank Filter</label>
                          <Select value={selectedBank} onValueChange={setSelectedBank}>
                            <SelectTrigger>
                              <SelectValue placeholder="All banks" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Banks</SelectItem>
                              {nigerianBanks.map((bank) => (
                                <SelectItem key={bank.code} value={bank.name}>
                                  {bank.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedPeriod && (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                              <Users className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="text-2xl font-bold text-gray-900">
                                  {totalRecords}
                                </p>
                                <p className="text-sm text-gray-500">Total Recipients</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                              <University className="h-8 w-8 text-green-500" />
                              <div>
                                <p className="text-2xl font-bold text-gray-900">
                                  {bankSummary.length}
                                </p>
                                <p className="text-sm text-gray-500">Banks</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                              <FileSpreadsheet className="h-8 w-8 text-purple-500" />
                              <div>
                                <p className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(totalAmount)}
                                </p>
                                <p className="text-sm text-gray-500">Total Amount</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Bank Breakdown */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>Bank Breakdown</CardTitle>
                            <Button onClick={generateAllBanksReport} disabled={isLoading}>
                              <Download className="mr-2 h-4 w-4" />
                              Generate All Banks
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isLoading ? (
                            <div className="text-center py-8">Loading bank data...</div>
                          ) : bankSummary.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              No bank data available for selected period
                            </div>
                          ) : (
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Bank Name</TableHead>
                                    <TableHead>Bank Code</TableHead>
                                    <TableHead>Recipients</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {bankSummary.map((bank: any) => {
                                    const bankInfo = nigerianBanks.find(b => b.name === bank.bankName);
                                    const percentage = (bank.totalAmount / totalAmount) * 100;
                                    
                                    return (
                                      <TableRow key={bank.bankName}>
                                        <TableCell>
                                          <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                              <University className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="font-medium">{bank.bankName}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                          {bankInfo?.code || 'N/A'}
                                        </TableCell>
                                        <TableCell>{bank.count}</TableCell>
                                        <TableCell className="font-medium">
                                          {formatCurrency(bank.totalAmount)}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center space-x-2">
                                            <Progress value={percentage} className="w-16" />
                                            <span className="text-sm">{percentage.toFixed(1)}%</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => generateBankReport(bank.bankName)}
                                          >
                                            <Download className="mr-2 h-4 w-4" />
                                            Generate
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Report History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {previousReports.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No previous reports found
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Report Name</TableHead>
                              <TableHead>Pay Period</TableHead>
                              <TableHead>Bank</TableHead>
                              <TableHead>Records</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Generated</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previousReports.map((report: any) => (
                              <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                  {report.filename}
                                </TableCell>
                                <TableCell>{report.payPeriod}</TableCell>
                                <TableCell>{report.bankName}</TableCell>
                                <TableCell>{report.recordCount}</TableCell>
                                <TableCell className="font-medium">
                                  {formatCurrency(report.totalAmount)}
                                </TableCell>
                                <TableCell>
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {getReportStatus(report.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
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
              </TabsContent>
            </Tabs>
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
