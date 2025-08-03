import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  Download, 
  Bell, 
  Calendar,
  CreditCard,
  Building,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Edit,
  Save,
  Eye,
  CheckCircle
} from 'lucide-react';

const mockStaffData = {
  staffId: 'JSC/2025/00001',
  firstName: 'John',
  lastName: 'Doe',
  middleName: 'Smith',
  email: 'john.doe@jsc.gov.ng',
  phone: '+234-801-234-5678',
  department: 'Legal Services',
  gradeLevel: 'GL08',
  step: 5,
  jobTitle: 'Senior Legal Officer',
  employmentDate: '2020-03-15',
  status: 'active',
  bankName: 'First Bank Nigeria',
  accountNumber: '3012345678',
  accountName: 'John Smith Doe',
  address: '123 Abuja Street, Wuse 2, FCT',
};

const mockPayslips = [
  {
    id: '1',
    period: 'July 2025',
    basicSalary: 450000,
    allowances: 225000,
    deductions: 89000,
    netPay: 586000,
    status: 'paid',
    payDate: '2025-07-31',
  },
  {
    id: '2',
    period: 'June 2025',
    basicSalary: 450000,
    allowances: 225000,
    deductions: 89000,
    netPay: 586000,
    status: 'paid',
    payDate: '2025-06-30',
  },
  {
    id: '3',
    period: 'May 2025',
    basicSalary: 450000,
    allowances: 225000,
    deductions: 89000,
    netPay: 586000,
    status: 'paid',
    payDate: '2025-05-31',
  },
];

const mockNotifications = [
  {
    id: '1',
    title: 'Payslip Available',
    message: 'Your July 2025 payslip is now available for download',
    date: '2025-08-01',
    read: false,
    type: 'payroll',
  },
  {
    id: '2',
    title: 'Profile Update Required',
    message: 'Please update your emergency contact information',
    date: '2025-07-28',
    read: false,
    type: 'profile',
  },
  {
    id: '3',
    title: 'Leave Balance Update',
    message: 'Your annual leave balance has been updated',
    date: '2025-07-25',
    read: true,
    type: 'leave',
  },
];

export default function StaffPortal() {
  const { user, userRole } = useAuth();
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(mockStaffData);

  const handleUpdateProfile = () => {
    setEditMode(false);
    // Handle profile update logic here
  };

  const downloadPayslip = (payslipId: string) => {
    // Handle payslip download logic here
    console.log('Downloading payslip:', payslipId);
  };

  return (
    <AuthGuard requiredRole={['Staff', 'Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Staff Self-Service Portal"
            subtitle={`Welcome, ${mockStaffData.firstName} ${mockStaffData.lastName}`}
            onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          />

          <div className="p-6 space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, {mockStaffData.firstName}!
                    </h2>
                    <p className="text-blue-100">
                      {mockStaffData.jobTitle} • {mockStaffData.department}
                    </p>
                    <p className="text-blue-100">
                      Staff ID: {mockStaffData.staffId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">GL{mockStaffData.gradeLevel.slice(2)}</div>
                    <div className="text-blue-100">Step {mockStaffData.step}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Latest Pay</p>
                      <p className="text-2xl font-bold">₦586,000</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Years of Service</p>
                      <p className="text-2xl font-bold">5.4</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notifications</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <Bell className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="payslips" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Payslips
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Requests
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Personal Information</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editMode ? handleUpdateProfile() : setEditMode(true)}
                            className="flex items-center gap-2"
                          >
                            {editMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            {editMode ? 'Save' : 'Edit'}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">First Name</label>
                            {editMode ? (
                              <Input 
                                value={profileData.firstName}
                                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                              />
                            ) : (
                              <p className="mt-1 font-semibold">{profileData.firstName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Last Name</label>
                            {editMode ? (
                              <Input 
                                value={profileData.lastName}
                                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                              />
                            ) : (
                              <p className="mt-1 font-semibold">{profileData.lastName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            {editMode ? (
                              <Input 
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              />
                            ) : (
                              <p className="mt-1 font-semibold">{profileData.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            {editMode ? (
                              <Input 
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                              />
                            ) : (
                              <p className="mt-1 font-semibold">{profileData.phone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Address</label>
                          {editMode ? (
                            <Input 
                              value={profileData.address}
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            />
                          ) : (
                            <p className="mt-1 font-semibold">{profileData.address}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Employment Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Position</p>
                            <p className="font-semibold">{profileData.jobTitle}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Department</p>
                            <p className="font-semibold">{profileData.department}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Grade & Step</p>
                            <p className="font-semibold">{profileData.gradeLevel} - Step {profileData.step}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Employment Date</p>
                            <p className="font-semibold">{profileData.employmentDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge className="bg-green-100 text-green-800">
                              {profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Banking Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Bank</p>
                            <p className="font-semibold">{profileData.bankName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Account Name</p>
                            <p className="font-semibold">{profileData.accountName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Account Number</p>
                            <p className="font-semibold">{profileData.accountNumber}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Payslips Tab */}
              <TabsContent value="payslips">
                <Card>
                  <CardHeader>
                    <CardTitle>Payslips History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPayslips.map((payslip) => (
                        <div
                          key={payslip.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-4">
                            <FileText className="h-8 w-8 text-blue-500" />
                            <div>
                              <h4 className="font-semibold">{payslip.period}</h4>
                              <p className="text-sm text-gray-600">
                                Net Pay: ₦{payslip.netPay.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Paid on: {payslip.payDate}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-green-100 text-green-800">
                              {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadPayslip(payslip.id)}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg ${
                            !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Bell className={`h-5 w-5 mt-1 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                              <div>
                                <h4 className="font-semibold">{notification.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests">
                <Card>
                  <CardHeader>
                    <CardTitle>Leave & Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">Leave Management Coming Soon</h3>
                      <p className="text-gray-500">
                        Leave request and approval system will be available in the next update
                      </p>
                    </div>
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