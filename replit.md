# JSC Payroll Management System

## Overview

This is a full-stack payroll management system designed for the Judicial Service Committee (JSC) in Nigeria. The application provides comprehensive payroll processing, staff management, and financial reporting capabilities with role-based access control for government payroll operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + Vite**: Modern frontend framework with hot module replacement for development
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built component library
- **Wouter**: Lightweight client-side routing
- **React Query (TanStack Query)**: Server state management and caching
- **React Hook Form**: Form validation and management

### Backend Architecture
- **Express.js**: Node.js web framework for REST API
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: TypeScript-first ORM for database operations
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **RESTful API**: Standard HTTP methods for client-server communication

### Authentication & Authorization
- **Supabase Auth**: Handles user authentication and session management
- **Role-based Access Control**: Three primary roles (Super Admin, Account Admin, Payroll Admin)
- **AuthGuard Components**: Client-side route protection based on authentication state
- **JWT Tokens**: Secure token-based authentication with automatic refresh

### Database Design
- **PostgreSQL with Drizzle**: Uses pgEnum for role definitions and status management
- **Modular Schema**: Separate tables for users, staff, departments, and payroll data
- **CONJUSS Grade Structure**: Nigerian civil service grade levels (GL01-GL17) with salary steps
- **Audit Trails**: Timestamp tracking for all major operations

### Key Features Architecture

#### Staff Management
- Comprehensive employee records with personal and employment details
- Department-based organization with hierarchical structure
- Grade level and step progression tracking
- Staff status management (active, on-leave, retired, terminated)

#### Payroll Processing
- CONJUSS salary structure implementation
- Automated allowance calculations (housing, transport, medical, etc.)
- Tax calculations (PAYE, Pension, NHF) based on Nigerian tax laws
- Multi-step approval workflow (draft → review → approved → finalized → paid)
- Bank report generation for payment processing

#### Dashboard & Reporting
- Real-time metrics and KPIs
- Staff overview by department and role
- Payroll calendar with deadline tracking
- Activity logging and audit trails
- Export capabilities for various report formats

### State Management
- **React Query**: Server state caching and synchronization
- **React Context**: Authentication state and user role management
- **Local State**: Component-level state using React hooks
- **Form State**: React Hook Form for complex form validation

### Development Tools
- **Vite**: Fast build tool with HMR
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing with Tailwind
- **TypeScript Compiler**: Type checking and compilation

### Security Features
- Environment variable management for sensitive data
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Role-based route protection
- Session timeout and token refresh

## External Dependencies

### Database & Authentication
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Supabase**: Authentication service with user management and session handling
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library with consistent styling
- **Class Variance Authority**: Utility for managing conditional CSS classes

### Form & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema parsing
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod validation

### Development & Build
- **Vite**: Build tool and development server
- **TSX**: TypeScript execution for development
- **ESBuild**: JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins and error handling

### Data & API
- **TanStack React Query**: Server state management and caching
- **Date-fns**: Date manipulation and formatting utilities
- **Connect-pg-simple**: PostgreSQL session store for Express

### Utility Libraries
- **clsx & cn**: Conditional className utilities
- **cmdk**: Command palette component
- **Embla Carousel**: Carousel/slider component
- **Nanoid**: Unique ID generation