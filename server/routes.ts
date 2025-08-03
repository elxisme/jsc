import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/staff-overview", async (req, res) => {
    try {
      const overview = await storage.getStaffOverview();
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff overview" });
    }
  });

  app.get("/api/dashboard/recent-activity", async (req, res) => {
    try {
      const activities = await storage.getRecentActivity();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/dashboard/deadlines", async (req, res) => {
    try {
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      const deadlines = await storage.getPayrollDeadlines(year, month);
      res.json(deadlines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deadlines" });
    }
  });

  // Staff management
  app.get("/api/staff", async (req, res) => {
    try {
      const { search, status, department } = req.query;
      const staff = await storage.getStaff({
        search: search as string,
        status: status as string,
        departmentId: department as string,
      });
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.get("/api/staff/:status/:department", async (req, res) => {
    try {
      const { status, department } = req.params;
      const staff = await storage.getStaff({
        status: status === 'all' ? undefined : status,
        departmentId: department === 'all' ? undefined : department,
      });
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const staff = await storage.createStaff(req.body);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to create staff" });
    }
  });

  app.get("/api/staff/eligible-for-payroll", async (req, res) => {
    try {
      const departmentIds = req.query.departmentIds as string[];
      const staff = await storage.getEligibleStaff(departmentIds);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eligible staff" });
    }
  });

  // Departments
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const department = await storage.createDepartment(req.body);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  app.put("/api/departments/:id", async (req, res) => {
    try {
      const department = await storage.updateDepartment(req.params.id, req.body);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to update department" });
    }
  });

  app.delete("/api/departments/:id", async (req, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      res.json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // Payroll management
  app.get("/api/payroll/current", async (req, res) => {
    try {
      const currentPayroll = await storage.getCurrentPayrollRun();
      res.json(currentPayroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current payroll" });
    }
  });

  app.get("/api/payroll/runs", async (req, res) => {
    try {
      const runs = await storage.getPayrollRuns();
      res.json(runs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll runs" });
    }
  });

  app.post("/api/payroll/create", async (req, res) => {
    try {
      const payroll = await storage.createPayrollRun(req.body);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payroll run" });
    }
  });

  app.post("/api/payroll/calculate", async (req, res) => {
    try {
      const { staffIds } = req.body;
      const calculations = await storage.calculatePayroll(staffIds);
      res.json({ calculations });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate payroll" });
    }
  });

  app.post("/api/payroll/submit", async (req, res) => {
    try {
      const payroll = await storage.submitPayroll(req.body);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit payroll" });
    }
  });

  // Payslips
  app.get("/api/payslips", async (req, res) => {
    try {
      const { search, period, department } = req.query;
      const payslips = await storage.getPayslips({
        search: search as string,
        periodId: period as string,
        departmentId: department as string,
      });
      res.json(payslips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payslips" });
    }
  });

  // Bank reports
  app.get("/api/payroll/bank-data/:periodId", async (req, res) => {
    try {
      const bankData = await storage.getBankTransferData(req.params.periodId);
      res.json(bankData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank data" });
    }
  });

  app.get("/api/payroll/bank-reports", async (req, res) => {
    try {
      const reports = await storage.getBankReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank reports" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // User management endpoints
  app.get("/api/users/:id/role", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      res.json({ role: user?.role || 'Staff' });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user role" });
    }
  });

  app.post("/api/auth/create-test-user", async (req, res) => {
    try {
      const { email, password, role = 'Super Admin' } = req.body;
      
      // Create user in Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) throw error;

      // Create user record in our database
      const user = await storage.createUser({
        email: data.user.email!,
        password: 'supabase_auth',
        role: role as any,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.json({ message: "Test user created successfully", user });
    } catch (error) {
      console.error('Error creating test user:', error);
      res.status(500).json({ message: "Failed to create test user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
