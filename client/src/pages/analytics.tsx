import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const payrollTrendData = [
  { month: 'Jan', totalAmount: 85000000, staffCount: 245 },
  { month: 'Feb', totalAmount: 87500000, staffCount: 248 },
  { month: 'Mar', totalAmount: 89200000, staffCount: 252 },
  { month: 'Apr', totalAmount: 91800000, staffCount: 255 },
  { month: 'May', totalAmount: 88900000, staffCount: 250 },
  { month: 'Jun', totalAmount: 93400000, staffCount: 258 },
  { month: 'Jul', totalAmount: 95600000, staffCount: 262 },
];

const departmentData = [
  { name: 'Legal Services', value: 35, amount: 32500000 },
  { name: 'Administration', value: 28, amount: 28900000 },
  { name: 'Finance & Accounts', value: 22, amount: 24200000 },
  { name: 'Human Resources', value: 15, amount: 18400000 },
];

const gradeDistributionData = [
  { grade: 'GL01-GL03', count: 45, percentage: 18 },
  { grade: 'GL04-GL06', count: 62, percentage: 25 },
  { grade: 'GL07-GL09', count: 58, percentage: 23 },
  { grade: 'GL10-GL12', count: 48, percentage: 19 },
  { grade: 'GL13-GL15', count: 28, percentage: 11 },
  { grade: 'GL16-GL17', count: 9, percentage: 4 },
];

const allowanceBreakdownData = [
  { name: 'Housing', amount: 125000000, percentage: 35 },
  { name: 'Transport', amount: 89000000, percentage: 25 },
  { name: 'Medical', amount: 67000000, percentage: 19 },
  { name: 'Hardship', amount: 45000000, percentage: 13 },
  { name: 'Others', amount: 28000000, percentage: 8 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function Analytics() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedYear, setSelectedYear] = useState('2025');

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Analytics & Reports"
            subtitle="Comprehensive payroll and staff analytics"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="12months">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Payroll (YTD)</p>
                      <p className="text-2xl font-bold">₦631.4M</p>
                      <p className="text-sm text-green-600">+5.2% from last year</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Staff</p>
                      <p className="text-2xl font-bold">262</p>
                      <p className="text-sm text-blue-600">+7 this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Salary</p>
                      <p className="text-2xl font-bold">₦365K</p>
                      <p className="text-sm text-yellow-600">+2.1% from last month</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Processing Time</p>
                      <p className="text-2xl font-bold">2.3hrs</p>
                      <p className="text-sm text-green-600">-15% improvement</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="trends" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trends">Payroll Trends</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="staff">Staff Analysis</TabsTrigger>
                <TabsTrigger value="allowances">Allowances</TabsTrigger>
              </TabsList>

              {/* Payroll Trends */}
              <TabsContent value="trends">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Monthly Payroll Amounts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={payrollTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} />
                          <Tooltip 
                            formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, 'Amount']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="totalAmount" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Staff Count Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={payrollTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="staffCount" 
                            stroke="#82ca9d" 
                            strokeWidth={3}
                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Department Analysis */}
              <TabsContent value="departments">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Staff Distribution by Department
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Payroll by Department
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} />
                          <Tooltip 
                            formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, 'Amount']}
                          />
                          <Bar dataKey="amount" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentData.map((dept, index) => (
                        <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                              <h4 className="font-semibold">{dept.name}</h4>
                              <p className="text-sm text-gray-600">{dept.value}% of total staff</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₦{(dept.amount / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-gray-600">Monthly payroll</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Staff Analysis */}
              <TabsContent value="staff">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Staff Distribution by Grade Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gradeDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="grade" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gradeDistributionData.map((grade) => (
                      <Card key={grade.grade}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{grade.grade}</p>
                              <p className="text-2xl font-bold">{grade.count}</p>
                              <p className="text-sm text-gray-600">{grade.percentage}% of staff</p>
                            </div>
                            <Users className="h-8 w-8 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Allowances */}
              <TabsContent value="allowances">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Allowance Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={allowanceBreakdownData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="amount"
                            label={({ name, percentage }) => `${name} ${percentage}%`}
                          >
                            {allowanceBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `₦${(value / 1000000).toFixed(1)}M`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Allowance Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {allowanceBreakdownData.map((allowance, index) => (
                          <div key={allowance.name} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <div>
                                <h4 className="font-semibold">{allowance.name} Allowance</h4>
                                <p className="text-sm text-gray-600">{allowance.percentage}% of total</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₦{(allowance.amount / 1000000).toFixed(1)}M</p>
                              <p className="text-sm text-gray-600">Annual budget</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
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