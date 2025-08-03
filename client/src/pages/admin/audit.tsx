import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pie } from 'recharts';
import { 
  FileText, 
  Search, 
  Download, 
  Filter,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2025-08-03 10:15:23',
    user: 'admin@jsc.gov.ng',
    action: 'USER_LOGIN',
    resource: 'Authentication System',
    details: 'User successfully logged in',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'info',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2025-08-03 10:14:15',
    user: 'admin@jsc.gov.ng',
    action: 'STAFF_CREATE',
    resource: 'Staff Management',
    details: 'Created new staff record for John Doe (JSC/2025/00001)',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'info',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2025-08-03 09:45:30',
    user: 'payroll@jsc.gov.ng',
    action: 'PAYROLL_CREATE',
    resource: 'Payroll Processing',
    details: 'Attempted to create payroll run for August 2025',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 118.0.0',
    severity: 'warning',
    status: 'failed'
  },
  {
    id: '4',
    timestamp: '2025-08-03 09:30:12',
    user: 'admin@jsc.gov.ng',
    action: 'DEPARTMENT_UPDATE',
    resource: 'Department Management',
    details: 'Updated Finance and Accounts department information',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'info',
    status: 'success'
  },
  {
    id: '5',
    timestamp: '2025-08-03 09:15:45',
    user: 'accounts@jsc.gov.ng',
    action: 'SETTINGS_MODIFY',
    resource: 'System Settings',
    details: 'Modified allowance configuration',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari 17.1.0',
    severity: 'warning',
    status: 'success'
  },
  {
    id: '6',
    timestamp: '2025-08-03 08:45:22',
    user: 'admin@jsc.gov.ng',
    action: 'USER_CREATE',
    resource: 'User Management',
    details: 'Created new user account: test@jsc.gov.ng',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 119.0.0.0',
    severity: 'info',
    status: 'success'
  },
  {
    id: '7',
    timestamp: '2025-08-03 08:30:10',
    user: 'system',
    action: 'BACKUP_COMPLETED',
    resource: 'System Backup',
    details: 'Daily database backup completed successfully',
    ipAddress: 'system',
    userAgent: 'system',
    severity: 'info',
    status: 'success'
  },
  {
    id: '8',
    timestamp: '2025-08-02 17:20:15',
    user: 'payroll@jsc.gov.ng',
    action: 'LOGIN_FAILED',
    resource: 'Authentication System',
    details: 'Failed login attempt - incorrect password',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox 118.0.0',
    severity: 'error',
    status: 'failed'
  }
];

export default function AuditLog() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    
    return matchesSearch && matchesAction && matchesSeverity && matchesUser;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800"><Activity className="h-3 w-3 mr-1" />Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const uniqueActions = [...new Set(mockAuditLogs.map(log => log.action))];
  const uniqueUsers = [...new Set(mockAuditLogs.map(log => log.user))];

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Audit Log"
            subtitle="System activity and security logs"
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Actions</p>
                      <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Failed Actions</p>
                      <p className="text-2xl font-bold text-red-600">
                        {mockAuditLogs.filter(log => log.status === 'failed').length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {mockAuditLogs.filter(log => log.severity === 'warning').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold">{uniqueUsers.filter(user => user !== 'system').length}</p>
                    </div>
                    <User className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Logs ({filteredLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center">
                          {getStatusIcon(log.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{log.action.replace(/_/g, ' ')}</h4>
                            {getSeverityBadge(log.severity)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.timestamp}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.user}
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {log.resource}
                            </div>
                            <div>IP: {log.ipAddress}</div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="ml-4">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">No audit logs found</h3>
                      <p className="text-gray-500">Try adjusting your filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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