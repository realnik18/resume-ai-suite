// Mock data and API functions for ApplyPro AI
import { User, Resume, Application, Invoice, MetricPoint, KPICard } from '@/types';

// Mock current user - TODO: Replace with Supabase auth
const currentUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  role: 'user',
  plan: 'starter',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5af?w=150&h=150&fit=crop&crop=face',
  createdAt: '2024-01-15T08:00:00Z'
};

// Mock data arrays
export const mockUsers: User[] = [
  currentUser,
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    plan: 'pro',
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: 'user',
    plan: 'business',
    seats: 5,
    createdAt: '2024-01-05T14:15:00Z'
  }
];

export const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    atsScore: 85,
    language: 'en',
    lastImprovedAt: '2024-01-20T16:30:00Z',
    lastExportedAt: '2024-01-21T09:15:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z'
  },
  {
    id: '2',
    title: 'Marketing Manager Resume',
    atsScore: 78,
    language: 'en',
    lastImprovedAt: '2024-01-18T14:20:00Z',
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '3',
    title: 'Product Designer Resume',
    atsScore: 92,
    language: 'en',
    lastImprovedAt: '2024-01-19T10:45:00Z',
    lastExportedAt: '2024-01-19T11:00:00Z',
    createdAt: '2024-01-10T15:20:00Z',
    updatedAt: '2024-01-19T10:45:00Z'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    role: 'Senior Software Engineer',
    status: 'interview',
    link: 'https://techcorp.com/careers/123',
    salaryRange: '$120k - $150k',
    notes: 'Great culture fit, technical interview scheduled for next week',
    appliedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Frontend Developer',
    status: 'applied',
    link: 'https://startupxyz.com/jobs/frontend',
    salaryRange: '$90k - $110k',
    appliedAt: '2024-01-18T09:30:00Z',
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-18T09:30:00Z'
  },
  {
    id: '3',
    company: 'BigTech Inc',
    role: 'Full Stack Engineer',
    status: 'offer',
    salaryRange: '$140k - $170k',
    notes: 'Offer received! Need to respond by Friday',
    appliedAt: '2024-01-10T11:15:00Z',
    createdAt: '2024-01-10T11:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '4',
    company: 'DesignCo',
    role: 'UI/UX Designer',
    status: 'rejected',
    notes: 'Not a good fit for the role',
    appliedAt: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-17T10:10:00Z'
  },
  {
    id: '5',
    company: 'InnovateLabs',
    role: 'Product Manager',
    status: 'saved',
    link: 'https://innovatelabs.com/careers/pm',
    salaryRange: '$130k - $160k',
    notes: 'Interesting position, waiting for referral',
    createdAt: '2024-01-19T13:45:00Z',
    updatedAt: '2024-01-19T13:45:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    amount: 19,
    currency: 'USD',
    status: 'paid',
    periodStart: '2024-01-01T00:00:00Z',
    periodEnd: '2024-01-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    amount: 19,
    currency: 'USD',
    status: 'paid',
    periodStart: '2023-12-01T00:00:00Z',
    periodEnd: '2023-12-31T23:59:59Z',
    createdAt: '2023-12-01T00:00:00Z'
  }
];

// Mock API functions
export const getCurrentUser = async (): Promise<User> => {
  // TODO: Replace with Supabase auth
  await new Promise(resolve => setTimeout(resolve, 100));
  return currentUser;
};

export const updateUserPlan = async (plan: User['plan']): Promise<User> => {
  // TODO: Replace with Supabase + Stripe
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser.plan = plan;
  return currentUser;
};

export const listResumes = async (params?: { search?: string; page?: number; limit?: number }): Promise<{ data: Resume[]; total: number }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filtered = [...mockResumes];
  
  if (params?.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(resume => 
      resume.title.toLowerCase().includes(search)
    );
  }
  
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length
  };
};

export const getResume = async (id: string): Promise<Resume | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockResumes.find(r => r.id === id) || null;
};

export const improveResumeAI = async (id: string): Promise<Resume> => {
  // TODO: Replace with real AI integration
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const resume = mockResumes.find(r => r.id === id);
  if (!resume) throw new Error('Resume not found');
  
  // Simulate AI improvement
  resume.atsScore = Math.min(100, resume.atsScore + Math.floor(Math.random() * 10) + 1);
  resume.lastImprovedAt = new Date().toISOString();
  resume.updatedAt = new Date().toISOString();
  
  return resume;
};

export const duplicateResume = async (id: string): Promise<Resume> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const original = mockResumes.find(r => r.id === id);
  if (!original) throw new Error('Resume not found');
  
  const duplicate: Resume = {
    ...original,
    id: Date.now().toString(),
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastImprovedAt: new Date().toISOString(),
    lastExportedAt: undefined
  };
  
  mockResumes.unshift(duplicate);
  return duplicate;
};

export const deleteResume = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = mockResumes.findIndex(r => r.id === id);
  if (index > -1) {
    mockResumes.splice(index, 1);
  }
};

export const listApplications = async (params?: { status?: string; search?: string }): Promise<Application[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filtered = [...mockApplications];
  
  if (params?.status) {
    filtered = filtered.filter(app => app.status === params.status);
  }
  
  if (params?.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(app => 
      app.company.toLowerCase().includes(search) || 
      app.role.toLowerCase().includes(search)
    );
  }
  
  return filtered;
};

export const moveApplication = async (id: string, status: Application['status']): Promise<Application> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const app = mockApplications.find(a => a.id === id);
  if (!app) throw new Error('Application not found');
  
  app.status = status;
  app.updatedAt = new Date().toISOString();
  
  if (status === 'applied' && !app.appliedAt) {
    app.appliedAt = new Date().toISOString();
  }
  
  return app;
};

export const getKPIs = async (): Promise<KPICard[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const avgAtsScore = Math.round(mockResumes.reduce((sum, r) => sum + r.atsScore, 0) / mockResumes.length);
  const thisWeekApps = mockApplications.filter(a => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.createdAt) > weekAgo;
  }).length;
  
  const interviewCount = mockApplications.filter(a => a.status === 'interview').length;
  const improvementsThisMonth = mockResumes.filter(r => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(r.lastImprovedAt) > monthAgo;
  }).length;
  
  return [
    {
      title: 'Avg ATS Score',
      value: `${avgAtsScore}%`,
      change: { value: 5, trend: 'up' },
      icon: 'target'
    },
    {
      title: 'Applications This Week',
      value: thisWeekApps,
      change: { value: 2, trend: 'up' },
      icon: 'send'
    },
    {
      title: 'Interviews Booked',
      value: interviewCount,
      change: { value: 1, trend: 'up' },
      icon: 'calendar'
    },
    {
      title: 'AI Improvements',
      value: improvementsThisMonth,
      change: { value: 3, trend: 'up' },
      icon: 'zap'
    }
  ];
};

export const getMetrics = async (range: '7d' | '30d' | '90d' = '30d'): Promise<{ applications: MetricPoint[]; interviews: MetricPoint[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate mock time series data
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const applications: MetricPoint[] = [];
  const interviews: MetricPoint[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    applications.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5) + 1
    });
    
    interviews.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 3)
    });
  }
  
  return { applications, interviews };
};

export const getInvoices = async (): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockInvoices];
};

// Auth placeholder - TODO: Replace with Supabase
export const isAuthenticated = (): boolean => {
  // Mock authentication state
  return true;
};

export const signOut = async (): Promise<void> => {
  // TODO: Replace with Supabase auth
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('User signed out');
};