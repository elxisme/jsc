import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Building,
  Calculator,
  FileText,
  University,
  TrendingUp,
  FileDown,
  UserCog,
  Settings,
  LogOut,
  Scale,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, userRole, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: BarChart3,
      roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
    },
    {
      title: 'Staff Management',
      items: [
        {
          title: 'Staff Directory',
          href: '/staff',
          icon: Users,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
        {
          title: 'Departments',
          href: '/departments',
          icon: Building,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
      ],
    },
    {
      title: 'Payroll',
      items: [
        {
          title: 'Process Payroll',
          href: '/payroll/process',
          icon: Calculator,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
        {
          title: 'Payslips',
          href: '/payroll/payslips',
          icon: FileText,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
        {
          title: 'Bank Reports',
          href: '/payroll/bank-reports',
          icon: University,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
      ],
    },
    {
      title: 'Reports',
      items: [
        {
          title: 'Analytics',
          href: '/analytics',
          icon: TrendingUp,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
        {
          title: 'Export Data',
          href: '/export',
          icon: FileDown,
          roles: ['Super Admin', 'Account Admin', 'Payroll Admin'],
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'User Management',
          href: '/admin/users',
          icon: UserCog,
          roles: ['Super Admin', 'Account Admin'],
        },
        {
          title: 'System Settings',
          href: '/admin/settings',
          icon: Settings,
          roles: ['Super Admin', 'Account Admin'],
        },
        {
          title: 'Audit Log',
          href: '/admin/audit',
          icon: FileText,
          roles: ['Super Admin', 'Account Admin'],
        },
      ],
    },
    {
      title: 'Self-Service',
      items: [
        {
          title: 'Staff Portal',
          href: '/portal',
          icon: Users,
          roles: ['Staff', 'Super Admin', 'Account Admin', 'Payroll Admin'],
        },
      ],
    },
  ];

  const canAccessItem = (roles: string[]) => {
    return userRole && roles.includes(userRole);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Scale className="text-primary-foreground text-sm" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">JSC Payroll</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.href ? (
                  // Single item
                  canAccessItem(section.roles || []) && (
                    <Link href={section.href}>
                      <a
                        className={cn(
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          location === section.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <section.icon className="mr-3 text-sm flex-shrink-0" />
                        {section.title}
                      </a>
                    </Link>
                  )
                ) : (
                  // Section with items
                  <div className="mt-6">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      {section.items?.map((item, itemIndex) => (
                        canAccessItem(item.roles || []) && (
                          <Link key={itemIndex} href={item.href}>
                            <a
                              className={cn(
                                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                location === item.href
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              )}
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <item.icon className="mr-3 text-sm flex-shrink-0" />
                              {item.title}
                            </a>
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
