import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// Pages
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import StaffDirectory from "@/pages/staff/staff-directory";
import AddStaff from "@/pages/staff/add-staff";
import Departments from "@/pages/departments/departments";
import ProcessPayroll from "@/pages/payroll/process-payroll";
import Payslips from "@/pages/payroll/payslips";
import BankReports from "@/pages/payroll/bank-reports";
import Analytics from "@/pages/analytics";
import SystemSettings from "@/pages/admin/settings";
import UserManagement from "@/pages/admin/users";
import AuditLog from "@/pages/admin/audit";
import StaffPortal from "@/pages/portal";

function AuthenticatedRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/staff" component={StaffDirectory} />
      <Route path="/staff/add" component={AddStaff} />
      <Route path="/departments" component={Departments} />
      <Route path="/payroll/process" component={ProcessPayroll} />
      <Route path="/payroll/payslips" component={Payslips} />
      <Route path="/payroll/bank-reports" component={BankReports} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/admin/settings" component={SystemSettings} />
      <Route path="/admin/users" component={UserManagement} />
      <Route path="/admin/audit" component={AuditLog} />
      <Route path="/portal" component={StaffPortal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AuthenticatedRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
