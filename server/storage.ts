import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and, or, like, isNull, inArray } from "drizzle-orm";
import { 
  users, 
  departments, 
  staff, 
  salaryStructure, 
  payrollRuns, 
  payrollItems, 
  notifications,
  type User, 
  type InsertUser,
  type Department,
  type InsertDepartment,
  type Staff,
  type InsertStaff,
  type PayrollRun,
  type InsertPayrollRun,
  type PayrollItem,
  type InsertPayrollItem,
  type Notification,
  type InsertNotification
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be provided");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<any>;
  getStaffOverview(): Promise<any>;
  getRecentActivity(): Promise<any>;
  getPayrollDeadlines(year: number, month: number): Promise<any>;
  
  // Staff management
  getStaff(filters: any): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  getEligibleStaff(departmentIds: string[]): Promise<Staff[]>;
  
  // Department management
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, updates: Partial<Department>): Promise<Department>;
  deleteDepartment(id: string): Promise<void>;
  
  // Payroll management
  getCurrentPayrollRun(): Promise<PayrollRun | null>;
  getPayrollRuns(): Promise<PayrollRun[]>;
  createPayrollRun(payroll: InsertPayrollRun): Promise<PayrollRun>;
  calculatePayroll(staffIds: string[]): Promise<any>;
  submitPayroll(data: any): Promise<PayrollRun>;
  
  // Payslips
  getPayslips(filters: any): Promise<any[]>;
  getBankTransferData(periodId: string): Promise<any>;
  getBankReports(): Promise<any[]>;
  
  // Notifications
  getNotifications(userId?: string): Promise<Notification[]>;
  getUnreadNotificationCount(userId?: string): Promise<number>;
  markNotificationAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getDashboardMetrics(): Promise<any> {
    // Mock implementation for now
    return {
      totalStaff: 0,
      activePayroll: 0,
      pendingApprovals: 0,
      monthlyBudget: 0
    };
  }

  async getStaffOverview(): Promise<any> {
    // Mock implementation for now
    return [];
  }

  async getRecentActivity(): Promise<any> {
    // Mock implementation for now
    return [];
  }

  async getPayrollDeadlines(year: number, month: number): Promise<any> {
    // Mock implementation for now
    return [];
  }

  async getStaff(filters: any): Promise<Staff[]> {
    try {
      let query = db.select().from(staff);
      if (filters.departmentId && filters.departmentId !== 'all') {
        query = query.where(eq(staff.departmentId, filters.departmentId));
      }
      return await query;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    try {
      // Generate staff ID if not provided
      const staffId = staffData.staffId || `JSC/2025/${String(Date.now()).slice(-5).padStart(5, '0')}`;
      
      const [newStaff] = await db.insert(staff).values({
        ...staffData,
        staffId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return newStaff;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  async getEligibleStaff(departmentIds: string[]): Promise<Staff[]> {
    try {
      let query = db.select().from(staff).where(eq(staff.status, 'active'));
      
      if (departmentIds.length > 0 && !departmentIds.includes('all')) {
        query = query.where(inArray(staff.departmentId, departmentIds));
      }
      
      return await query;
    } catch (error) {
      console.error('Error fetching eligible staff:', error);
      return [];
    }
  }

  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    const [updatedDepartment] = await db.update(departments).set(updates).where(eq(departments.id, id)).returning();
    return updatedDepartment;
  }

  async deleteDepartment(id: string): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  async getCurrentPayrollRun(): Promise<PayrollRun | null> {
    // Mock implementation for now
    return null;
  }

  async getPayrollRuns(): Promise<PayrollRun[]> {
    // Mock implementation for now
    return [];
  }

  async createPayrollRun(payroll: InsertPayrollRun): Promise<PayrollRun> {
    try {
      const [newPayroll] = await db.insert(payrollRuns).values({
        ...payroll,
        id: undefined, // Let database generate ID
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return newPayroll;
    } catch (error) {
      console.error('Error creating payroll run:', error);
      throw error;
    }
  }

  async calculatePayroll(staffIds: string[]): Promise<any> {
    // Mock implementation for now
    return {};
  }

  async submitPayroll(data: any): Promise<PayrollRun> {
    // Mock implementation for now
    const [payroll] = await db.insert(payrollRuns).values(data).returning();
    return payroll;
  }

  async getPayslips(filters: any): Promise<any[]> {
    // Mock implementation for now
    return [];
  }

  async getBankTransferData(periodId: string): Promise<any> {
    // Mock implementation for now
    return {};
  }

  async getBankReports(): Promise<any[]> {
    // Mock implementation for now
    return [];
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    // Mock implementation for now
    return [];
  }

  async getUnreadNotificationCount(userId?: string): Promise<number> {
    // Mock implementation for now
    return 0;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    // Mock implementation for now
  }
}

export const storage = new DatabaseStorage();
