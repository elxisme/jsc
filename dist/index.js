// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, inArray, count, sum } from "drizzle-orm";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var roleEnum = pgEnum("role", ["Super Admin", "Account Admin", "Payroll Admin", "Staff"]);
var statusEnum = pgEnum("status", ["active", "on-leave", "retired", "terminated"]);
var payrollStatusEnum = pgEnum("payroll_status", ["draft", "pending_approval", "approved", "processed", "cancelled"]);
var gradeEnum = pgEnum("grade_level", ["GL01", "GL02", "GL03", "GL04", "GL05", "GL06", "GL07", "GL08", "GL09", "GL10", "GL11", "GL12", "GL13", "GL14", "GL15", "GL16", "GL17"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("Staff"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  headOfDepartment: varchar("head_of_department"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: text("staff_id").notNull().unique(),
  // JSC/2025/00001 format
  userId: varchar("user_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  // Employment details
  departmentId: varchar("department_id").notNull(),
  gradeLevel: gradeEnum("grade_level").notNull(),
  step: integer("step").notNull(),
  jobTitle: text("job_title").notNull(),
  employmentDate: timestamp("employment_date").notNull(),
  status: statusEnum("status").notNull().default("active"),
  // Banking details
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountName: text("account_name"),
  // Pension details
  penNumber: text("pen_number"),
  pensionFundAdministrator: text("pension_fund_administrator"),
  // Next of kin
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),
  nextOfKinRelationship: text("next_of_kin_relationship"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var salaryStructure = pgTable("salary_structure", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradeLevel: gradeEnum("grade_level").notNull(),
  step: integer("step").notNull(),
  basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }).notNull(),
  // Allowances
  housingAllowance: decimal("housing_allowance", { precision: 15, scale: 2 }).default("0"),
  transportAllowance: decimal("transport_allowance", { precision: 15, scale: 2 }).default("0"),
  medicalAllowance: decimal("medical_allowance", { precision: 15, scale: 2 }).default("0"),
  leaveAllowance: decimal("leave_allowance", { precision: 15, scale: 2 }).default("0"),
  responsibilityAllowance: decimal("responsibility_allowance", { precision: 15, scale: 2 }).default("0"),
  hazardAllowance: decimal("hazard_allowance", { precision: 15, scale: 2 }).default("0"),
  isActive: boolean("is_active").notNull().default(true),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var payrollRuns = pgTable("payroll_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  payPeriod: text("pay_period").notNull(),
  // e.g., "January 2025"
  status: payrollStatusEnum("status").notNull().default("draft"),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).default("0"),
  staffCount: integer("staff_count").default(0),
  // Workflow tracking
  createdBy: varchar("created_by").notNull(),
  reviewedBy: varchar("reviewed_by"),
  approvedBy: varchar("approved_by"),
  finalizedBy: varchar("finalized_by"),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  finalizedAt: timestamp("finalized_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var payrollItems = pgTable("payroll_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payrollRunId: varchar("payroll_run_id").notNull(),
  staffId: varchar("staff_id").notNull(),
  // Salary components
  basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }).notNull(),
  housingAllowance: decimal("housing_allowance", { precision: 15, scale: 2 }).default("0"),
  transportAllowance: decimal("transport_allowance", { precision: 15, scale: 2 }).default("0"),
  medicalAllowance: decimal("medical_allowance", { precision: 15, scale: 2 }).default("0"),
  leaveAllowance: decimal("leave_allowance", { precision: 15, scale: 2 }).default("0"),
  responsibilityAllowance: decimal("responsibility_allowance", { precision: 15, scale: 2 }).default("0"),
  hazardAllowance: decimal("hazard_allowance", { precision: 15, scale: 2 }).default("0"),
  overtime: decimal("overtime", { precision: 15, scale: 2 }).default("0"),
  bonus: decimal("bonus", { precision: 15, scale: 2 }).default("0"),
  arrears: decimal("arrears", { precision: 15, scale: 2 }).default("0"),
  // Deductions
  paye: decimal("paye", { precision: 15, scale: 2 }).default("0"),
  pension: decimal("pension", { precision: 15, scale: 2 }).default("0"),
  nhf: decimal("nhf", { precision: 15, scale: 2 }).default("0"),
  insurance: decimal("insurance", { precision: 15, scale: 2 }).default("0"),
  unionDues: decimal("union_dues", { precision: 15, scale: 2 }).default("0"),
  loanDeduction: decimal("loan_deduction", { precision: 15, scale: 2 }).default("0"),
  cooperativeDeduction: decimal("cooperative_deduction", { precision: 15, scale: 2 }).default("0"),
  otherDeductions: decimal("other_deductions", { precision: 15, scale: 2 }).default("0"),
  // Totals
  grossPay: decimal("gross_pay", { precision: 15, scale: 2 }).notNull(),
  totalDeductions: decimal("total_deductions", { precision: 15, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  // info, warning, error, success
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true
});
var insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  staffId: true,
  createdAt: true,
  updatedAt: true
});
var insertPayrollRunSchema = createInsertSchema(payrollRuns).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPayrollItemSchema = createInsertSchema(payrollItems).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true
});

// server/storage.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be provided");
}
var sql2 = neon(process.env.DATABASE_URL);
var db = drizzle(sql2);
var DatabaseStorage = class {
  async getUser(id) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return void 0;
    }
  }
  async createUser(user) {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  async getDashboardMetrics() {
    try {
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const totalStaffResult = await db.select({ count: count() }).from(staff);
      const totalStaff = totalStaffResult[0].count;
      const activePayrollResult = await db.select({ count: count() }).from(payrollRuns).where(and(
        eq(payrollRuns.status, "processed"),
        eq(payrollRuns.period_month, currentMonth),
        eq(payrollRuns.period_year, currentYear)
      ));
      const activePayroll = activePayrollResult[0].count;
      const pendingApprovalsResult = await db.select({ count: count() }).from(payrollRuns).where(eq(payrollRuns.status, "pending_approval"));
      const pendingApprovals = pendingApprovalsResult[0].count;
      const totalDepartmentsResult = await db.select({ count: count() }).from(departments);
      const totalDepartments = totalDepartmentsResult[0].count;
      const monthlyBudgetResult = await db.select({ total: sum(payrollRuns.total_net) }).from(payrollRuns).where(and(
        eq(payrollRuns.status, "processed"),
        eq(payrollRuns.period_month, currentMonth),
        eq(payrollRuns.period_year, currentYear)
      ));
      const monthlyBudget = parseFloat(monthlyBudgetResult[0].total || "0");
      return {
        totalStaff,
        monthlyPayroll: monthlyBudget,
        payrollGrowth: 0,
        // Placeholder - would need historical comparison
        staffGrowth: 0,
        // Placeholder - would need historical comparison
        pendingApprovals,
        departments: totalDepartments
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return {
        totalStaff: 0,
        monthlyPayroll: 0,
        payrollGrowth: 0,
        staffGrowth: 0,
        pendingApprovals: 0,
        departments: 0
      };
    }
  }
  async getStaffOverview() {
    return [];
  }
  async getRecentActivity() {
    return [];
  }
  async getPayrollDeadlines(year, month) {
    return [];
  }
  async getStaff(filters) {
    try {
      let query = db.select().from(staff);
      if (filters.departmentId && filters.departmentId !== "all") {
        query = query.where(eq(staff.departmentId, filters.departmentId));
      }
      return await query;
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  }
  async createStaff(staffData) {
    try {
      const staffId = staffData.staffId || `JSC/2025/${String(Date.now()).slice(-5).padStart(5, "0")}`;
      const [newStaff] = await db.insert(staff).values({
        ...staffData,
        staffId,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return newStaff;
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  }
  async getEligibleStaff(departmentIds) {
    try {
      let query = db.select().from(staff).where(eq(staff.status, "active"));
      if (departmentIds.length > 0 && !departmentIds.includes("all")) {
        query = query.where(inArray(staff.departmentId, departmentIds));
      }
      return await query;
    } catch (error) {
      console.error("Error fetching eligible staff:", error);
      return [];
    }
  }
  async getDepartments() {
    return await db.select().from(departments);
  }
  async createDepartment(department) {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }
  async updateDepartment(id, updates) {
    const [updatedDepartment] = await db.update(departments).set(updates).where(eq(departments.id, id)).returning();
    return updatedDepartment;
  }
  async deleteDepartment(id) {
    await db.delete(departments).where(eq(departments.id, id));
  }
  async getCurrentPayrollRun() {
    return null;
  }
  async getPayrollRuns() {
    return [];
  }
  async createPayrollRun(payroll) {
    try {
      const [newPayroll] = await db.insert(payrollRuns).values({
        ...payroll,
        id: void 0,
        // Let database generate ID
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return newPayroll;
    } catch (error) {
      console.error("Error creating payroll run:", error);
      throw error;
    }
  }
  async calculatePayroll(staffIds) {
    return {};
  }
  async submitPayroll(data) {
    const [payroll] = await db.insert(payrollRuns).values(data).returning();
    return payroll;
  }
  async getPayslips(filters) {
    return [];
  }
  async getBankTransferData(periodId) {
    return {};
  }
  async getBankReports() {
    return [];
  }
  async getNotifications(userId) {
    return [];
  }
  async getUnreadNotificationCount(userId) {
    return 0;
  }
  async markNotificationAsRead(id) {
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.VITE_SUPABASE_URL || "";
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
var supabase = createClient(supabaseUrl, supabaseServiceKey);
async function registerRoutes(app2) {
  app2.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });
  app2.get("/api/dashboard/staff-overview", async (req, res) => {
    try {
      const overview = await storage.getStaffOverview();
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff overview" });
    }
  });
  app2.get("/api/dashboard/recent-activity", async (req, res) => {
    try {
      const activities = await storage.getRecentActivity();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });
  app2.get("/api/dashboard/deadlines", async (req, res) => {
    try {
      const year = parseInt(req.query.year);
      const month = parseInt(req.query.month);
      const deadlines = await storage.getPayrollDeadlines(year, month);
      res.json(deadlines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deadlines" });
    }
  });
  app2.get("/api/staff", async (req, res) => {
    try {
      const { search, status, department } = req.query;
      const staff2 = await storage.getStaff({
        search,
        status,
        departmentId: department
      });
      res.json(staff2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });
  app2.get("/api/staff/:status/:department", async (req, res) => {
    try {
      const { status, department } = req.params;
      const staff2 = await storage.getStaff({
        status: status === "all" ? void 0 : status,
        departmentId: department === "all" ? void 0 : department
      });
      res.json(staff2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });
  app2.post("/api/staff", async (req, res) => {
    try {
      const staff2 = await storage.createStaff(req.body);
      res.json(staff2);
    } catch (error) {
      res.status(500).json({ message: "Failed to create staff" });
    }
  });
  app2.get("/api/staff/eligible-for-payroll", async (req, res) => {
    try {
      const departmentIds = req.query.departmentIds;
      const staff2 = await storage.getEligibleStaff(departmentIds);
      res.json(staff2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch eligible staff" });
    }
  });
  app2.get("/api/departments", async (req, res) => {
    try {
      const departments2 = await storage.getDepartments();
      res.json(departments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });
  app2.post("/api/departments", async (req, res) => {
    try {
      const department = await storage.createDepartment(req.body);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to create department" });
    }
  });
  app2.put("/api/departments/:id", async (req, res) => {
    try {
      const department = await storage.updateDepartment(req.params.id, req.body);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to update department" });
    }
  });
  app2.delete("/api/departments/:id", async (req, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      res.json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete department" });
    }
  });
  app2.get("/api/payroll/current", async (req, res) => {
    try {
      const currentPayroll = await storage.getCurrentPayrollRun();
      res.json(currentPayroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current payroll" });
    }
  });
  app2.get("/api/payroll/runs", async (req, res) => {
    try {
      const runs = await storage.getPayrollRuns();
      res.json(runs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll runs" });
    }
  });
  app2.post("/api/payroll/create", async (req, res) => {
    try {
      const payroll = await storage.createPayrollRun(req.body);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payroll run" });
    }
  });
  app2.post("/api/payroll/calculate", async (req, res) => {
    try {
      const { staffIds } = req.body;
      const calculations = await storage.calculatePayroll(staffIds);
      res.json({ calculations });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate payroll" });
    }
  });
  app2.post("/api/payroll/submit", async (req, res) => {
    try {
      const payroll = await storage.submitPayroll(req.body);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit payroll" });
    }
  });
  app2.get("/api/payslips", async (req, res) => {
    try {
      const { search, period, department } = req.query;
      const payslips = await storage.getPayslips({
        search,
        periodId: period,
        departmentId: department
      });
      res.json(payslips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payslips" });
    }
  });
  app2.get("/api/payroll/bank-data/:periodId", async (req, res) => {
    try {
      const bankData = await storage.getBankTransferData(req.params.periodId);
      res.json(bankData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank data" });
    }
  });
  app2.get("/api/payroll/bank-reports", async (req, res) => {
    try {
      const reports = await storage.getBankReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank reports" });
    }
  });
  app2.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId;
      const notifications3 = await storage.getNotifications(userId);
      res.json(notifications3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.query.userId;
      const count2 = await storage.getUnreadNotificationCount(userId);
      res.json({ count: count2 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });
  app2.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.get("/api/users/:id/role", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      res.json({ role: user?.role || "Staff" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user role" });
    }
  });
  app2.post("/api/auth/create-test-user", async (req, res) => {
    try {
      const { email, password, role = "Super Admin" } = req.body;
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (error) throw error;
      const user = await storage.createUser({
        email: data.user.email,
        password: "supabase_auth",
        role,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      res.json({ message: "Test user created successfully", user });
    } catch (error) {
      console.error("Error creating test user:", error);
      res.status(500).json({ message: "Failed to create test user" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
