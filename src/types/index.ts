// ApplyPro AI Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'starter' | 'pro' | 'business';
  seats?: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  title: string;
  atsScore: number;
  language: string;
  lastImprovedAt: string;
  lastExportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  link?: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  salaryRange?: string;
  notes?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: 'USD';
  status: 'paid' | 'due' | 'failed';
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface MetricPoint {
  date: string;
  value: number;
}

export interface PricingPlan {
  id: 'starter' | 'pro' | 'business';
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}