import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum('role', ['Super Admin', 'Account Admin', 'Payroll Admin', 'Staff']);
export const statusEnum = pgEnum('status', ['active', 'on-leave', 'retired', 'terminated']);
export const payrollStatusEnum = pgEnum('payroll_status', ['draft', 'pending_approval', 'approved', 'processed', 'cancelled']);
export const gradeEnum = pgEnum('grade_level', ['GL01', 'GL02', 'GL03', 'GL04', 'GL05', 'GL06', 'GL07', 'GL08', 'GL09', 'GL10', 'GL11', 'GL12', 'GL13', 'GL14', 'GL15', 'GL16', 'GL17']);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default('Staff'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Departments table
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  headOfDepartment: varchar("head_of_department"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Staff table
export const staff = pgTable("staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: text("staff_id").notNull().unique(), // JSC/2025/00001 format
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
  status: statusEnum("status").notNull().default('active'),
  
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
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Salary structure table
export const salaryStructure = pgTable("salary_structure", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gradeLevel: gradeEnum("grade_level").notNull(),
  step: integer("step").notNull(),
  basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }).notNull(),
  
  // Allowances
  housingAllowance: decimal("housing_allowance", { precision: 15, scale: 2 }).default('0'),
  transportAllowance: decimal("transport_allowance", { precision: 15, scale: 2 }).default('0'),
  medicalAllowance: decimal("medical_allowance", { precision: 15, scale: 2 }).default('0'),
  leaveAllowance: decimal("leave_allowance", { precision: 15, scale: 2 }).default('0'),
  responsibilityAllowance: decimal("responsibility_allowance", { precision: 15, scale: 2 }).default('0'),
  hazardAllowance: decimal("hazard_allowance", { precision: 15, scale: 2 }).default('0'),
  
  isActive: boolean("is_active").notNull().default(true),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Payroll runs table
export const payrollRuns = pgTable("payroll_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  payPeriod: text("pay_period").notNull(), // e.g., "January 2025"
  status: payrollStatusEnum("status").notNull().default('draft'),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).default('0'),
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
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Payroll items table
export const payrollItems = pgTable("payroll_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payrollRunId: varchar("payroll_run_id").notNull(),
  staffId: varchar("staff_id").notNull(),
  
  // Salary components
  basicSalary: decimal("basic_salary", { precision: 15, scale: 2 }).notNull(),
  housingAllowance: decimal("housing_allowance", { precision: 15, scale: 2 }).default('0'),
  transportAllowance: decimal("transport_allowance", { precision: 15, scale: 2 }).default('0'),
  medicalAllowance: decimal("medical_allowance", { precision: 15, scale: 2 }).default('0'),
  leaveAllowance: decimal("leave_allowance", { precision: 15, scale: 2 }).default('0'),
  responsibilityAllowance: decimal("responsibility_allowance", { precision: 15, scale: 2 }).default('0'),
  hazardAllowance: decimal("hazard_allowance", { precision: 15, scale: 2 }).default('0'),
  overtime: decimal("overtime", { precision: 15, scale: 2 }).default('0'),
  bonus: decimal("bonus", { precision: 15, scale: 2 }).default('0'),
  arrears: decimal("arrears", { precision: 15, scale: 2 }).default('0'),
  
  // Deductions
  paye: decimal("paye", { precision: 15, scale: 2 }).default('0'),
  pension: decimal("pension", { precision: 15, scale: 2 }).default('0'),
  nhf: decimal("nhf", { precision: 15, scale: 2 }).default('0'),
  insurance: decimal("insurance", { precision: 15, scale: 2 }).default('0'),
  unionDues: decimal("union_dues", { precision: 15, scale: 2 }).default('0'),
  loanDeduction: decimal("loan_deduction", { precision: 15, scale: 2 }).default('0'),
  cooperativeDeduction: decimal("cooperative_deduction", { precision: 15, scale: 2 }).default('0'),
  otherDeductions: decimal("other_deductions", { precision: 15, scale: 2 }).default('0'),
  
  // Totals
  grossPay: decimal("gross_pay", { precision: 15, scale: 2 }).notNull(),
  totalDeductions: decimal("total_deductions", { precision: 15, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 15, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, warning, error, success
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// System settings table
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  staffId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollRunSchema = createInsertSchema(payrollRuns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollItemSchema = createInsertSchema(payrollItems).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type SalaryStructure = typeof salaryStructure.$inferSelect;

export type PayrollRun = typeof payrollRuns.$inferSelect;
export type InsertPayrollRun = z.infer<typeof insertPayrollRunSchema>;

export type PayrollItem = typeof payrollItems.$inferSelect;
export type InsertPayrollItem = z.infer<typeof insertPayrollItemSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
