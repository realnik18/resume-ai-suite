// ApplyPro AI API Layer - Structured for Supabase integration
// Currently delegates to mocks but ready for real Supabase queries

import { supabase } from '@/lib/supabase.client';
import { 
  User, 
  Resume, 
  Application, 
  Invoice, 
  MetricPoint, 
  KPICard,
  PaginatedResponse 
} from '@/types';

// Import current mock implementations
import * as mockApi from '@/lib/mock';

// =============================================================================
// USER MANAGEMENT
// =============================================================================

export const getCurrentUser = async (): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    // If profile doesn't exist, create one
    if (error.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      return {
        id: user.id,
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role || 'user',
        plan: newProfile.plan || 'starter',
        avatarUrl: newProfile.avatar_url,
        createdAt: newProfile.created_at,
      };
    }
    throw error;
  }
  
  return {
    id: user.id,
    name: profile.name,
    email: profile.email,
    role: profile.role || 'user',
    plan: profile.plan || 'starter',
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
  };
};

export const updateUserPlan = async (plan: User['plan']): Promise<User> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .update({ plan, updated_at: new Date().toISOString() })
  //   .eq('id', user.id)
  //   .select()
  //   .single();
  // 
  // return transformProfileToUser(profile);

  return mockApi.updateUserPlan(plan);
};

// =============================================================================
// RESUME MANAGEMENT
// =============================================================================

export const listResumes = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Resume>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  let query = supabase
    .from('resumes')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  
  if (params?.search) {
    query = query.ilike('title', `%${params.search}%`);
  }
  
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  
  return {
    data: data.map(transformResumeFromDB),
    total: count || 0,
    page,
    limit
  };
};

export const getResume = async (id: string): Promise<Resume | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return transformResumeFromDB(data);
};

export const upsertResume = async (resume: Partial<Resume>): Promise<Resume> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const resumeData = {
  //   id: resume.id,
  //   user_id: user.id,
  //   title: resume.title,
  //   content: resume.content || {},
  //   ats_score: resume.atsScore || 0,
  //   language: resume.language || 'en',
  //   updated_at: new Date().toISOString(),
  //   ...(resume.id ? {} : { created_at: new Date().toISOString() })
  // };
  // 
  // const { data, error } = await supabase
  //   .from('resumes')
  //   .upsert(resumeData)
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return transformResumeFromDB(data);

  // For now, delegate to mock
  if (resume.id) {
    // Update existing (mock doesn't have update, so we'll simulate)
    const existing = await mockApi.getResume(resume.id);
    if (!existing) throw new Error('Resume not found');
    return { ...existing, ...resume } as Resume;
  } else {
    // Create new
    const newResume: Resume = {
      id: Date.now().toString(),
      title: resume.title || 'Untitled Resume',
      atsScore: resume.atsScore || 0,
      language: resume.language || 'en',
      lastImprovedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newResume;
  }
};

export const deleteResume = async (id: string): Promise<void> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const { error } = await supabase
  //   .from('resumes')
  //   .delete()
  //   .eq('id', id)
  //   .eq('user_id', user.id);
  // 
  // if (error) throw error;

  return mockApi.deleteResume(id);
};

export const improveResumeAI = async (id: string): Promise<Resume> => {
  // TODO: Replace with AI service integration
  // This would typically call an AI service/edge function
  // const { data } = await supabase.functions.invoke('improve-resume', {
  //   body: { resumeId: id }
  // });
  // 
  // return data;

  return mockApi.improveResumeAI(id);
};

export const duplicateResume = async (id: string): Promise<Resume> => {
  // TODO: Implement with Supabase
  // const original = await getResume(id);
  // if (!original) throw new Error('Resume not found');
  // 
  // const duplicate = {
  //   ...original,
  //   id: undefined, // Let DB generate new ID
  //   title: `${original.title} (Copy)`,
  // };
  // 
  // return upsertResume(duplicate);

  return mockApi.duplicateResume(id);
};

// =============================================================================
// APPLICATION TRACKING
// =============================================================================

export const listApplications = async (params?: {
  status?: string;
  search?: string;
}): Promise<Application[]> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // let query = supabase
  //   .from('applications')
  //   .select('*')
  //   .eq('user_id', user.id)
  //   .order('updated_at', { ascending: false });
  // 
  // if (params?.status) {
  //   query = query.eq('status', params.status);
  // }
  // 
  // if (params?.search) {
  //   query = query.or(`company.ilike.%${params.search}%,role.ilike.%${params.search}%`);
  // }
  // 
  // const { data, error } = await query;
  // if (error) throw error;
  // 
  // return data.map(transformApplicationFromDB);

  return mockApi.listApplications(params);
};

export const upsertApplication = async (application: Partial<Application>): Promise<Application> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const appData = {
  //   id: application.id,
  //   user_id: user.id,
  //   company: application.company,
  //   role: application.role,
  //   status: application.status || 'saved',
  //   link: application.link,
  //   salary_range: application.salaryRange,
  //   notes: application.notes,
  //   applied_at: application.appliedAt,
  //   updated_at: new Date().toISOString(),
  //   ...(application.id ? {} : { created_at: new Date().toISOString() })
  // };
  // 
  // const { data, error } = await supabase
  //   .from('applications')
  //   .upsert(appData)
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return transformApplicationFromDB(data);

  // Mock implementation for now
  const newApp: Application = {
    id: application.id || Date.now().toString(),
    company: application.company || '',
    role: application.role || '',
    status: application.status || 'saved',
    link: application.link,
    salaryRange: application.salaryRange,
    notes: application.notes,
    appliedAt: application.appliedAt,
    createdAt: application.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newApp;
};

export const moveApplication = async (id: string, status: Application['status']): Promise<Application> => {
  // TODO: Replace with Supabase query
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const updateData: any = {
  //   status,
  //   updated_at: new Date().toISOString()
  // };
  // 
  // if (status === 'applied' && !application.appliedAt) {
  //   updateData.applied_at = new Date().toISOString();
  // }
  // 
  // const { data, error } = await supabase
  //   .from('applications')
  //   .update(updateData)
  //   .eq('id', id)
  //   .eq('user_id', user.id)
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return transformApplicationFromDB(data);

  return mockApi.moveApplication(id, status);
};

// =============================================================================
// ANALYTICS & METRICS
// =============================================================================

export const getKPIs = async (): Promise<KPICard[]> => {
  // TODO: Replace with Supabase aggregation queries
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const [resumesData, applicationsData] = await Promise.all([
  //   supabase.from('resumes').select('ats_score').eq('user_id', user.id),
  //   supabase.from('applications').select('status, created_at').eq('user_id', user.id)
  // ]);
  // 
  // // Calculate KPIs from real data
  // const avgAtsScore = resumesData.data?.length 
  //   ? Math.round(resumesData.data.reduce((sum, r) => sum + r.ats_score, 0) / resumesData.data.length)
  //   : 0;
  // 
  // // Return structured KPIs...

  return mockApi.getKPIs();
};

export const getMetrics = async (range: '7d' | '30d' | '90d' = '30d'): Promise<{
  applications: MetricPoint[];
  interviews: MetricPoint[];
}> => {
  // TODO: Replace with Supabase time-series queries
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  // const startDate = new Date();
  // startDate.setDate(startDate.getDate() - days);
  // 
  // const { data: applications } = await supabase
  //   .from('applications')
  //   .select('created_at, status')
  //   .eq('user_id', user.id)
  //   .gte('created_at', startDate.toISOString());
  // 
  // // Process data into MetricPoint arrays...

  return mockApi.getMetrics(range);
};

// =============================================================================
// BILLING & INVOICES
// =============================================================================

export const getInvoices = async (): Promise<Invoice[]> => {
  // TODO: Replace with Supabase query or Stripe integration
  // This might come from a separate billing table or Stripe API
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) throw new Error('Not authenticated');
  // 
  // const { data, error } = await supabase
  //   .from('invoices')
  //   .select('*')
  //   .eq('user_id', user.id)
  //   .order('created_at', { ascending: false });
  // 
  // if (error) throw error;
  // return data.map(transformInvoiceFromDB);

  return mockApi.getInvoices();
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const transformResumeFromDB = (dbResume: any): Resume => ({
  id: dbResume.id,
  title: dbResume.title,
  atsScore: dbResume.ats_score || 0,
  language: dbResume.language || 'en',
  lastImprovedAt: dbResume.last_improved || dbResume.updated_at,
  createdAt: dbResume.created_at,
  updatedAt: dbResume.updated_at,
});

const transformApplicationFromDB = (dbApp: any): Application => ({
  id: dbApp.id,
  company: dbApp.company,
  role: dbApp.role,
  status: dbApp.status,
  link: dbApp.link,
  salaryRange: dbApp.salary_range,
  notes: dbApp.notes,
  appliedAt: dbApp.applied_at,
  createdAt: dbApp.created_at,
  updatedAt: dbApp.updated_at,
});