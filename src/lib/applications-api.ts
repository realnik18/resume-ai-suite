import { supabase } from '@/integrations/supabase/client';

// Application interface
export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  link?: string;
  salary_range?: string;
  notes?: string;
  applied_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationData {
  company: string;
  role: string;
  status?: Application['status'];
  link?: string;
  salary_range?: string;
  notes?: string;
  applied_at?: string;
}

export interface UpdateApplicationData {
  company?: string;
  role?: string;
  status?: Application['status'];
  link?: string;
  salary_range?: string;
  notes?: string;
  applied_at?: string;
}

// List all applications for the current user
export async function listApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return (data || []) as Application[];
}

// Get a single application by ID
export async function getApplication(id: string): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch application: ${error.message}`);
  }

  return data as Application;
}

// Create a new application
export async function createApplication(applicationData: CreateApplicationData): Promise<Application> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create applications');
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      ...applicationData,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create application: ${error.message}`);
  }

  return data as Application;
}

// Update an existing application
export async function updateApplication(id: string, applicationData: UpdateApplicationData): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .update(applicationData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  return data as Application;
}

// Delete an application
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete application: ${error.message}`);
  }
}

// Move application to a different status
export async function moveApplication(id: string, status: Application['status']): Promise<Application> {
  const updateData: UpdateApplicationData = { status };
  
  // If moving to applied status, set applied_at timestamp
  if (status === 'applied') {
    updateData.applied_at = new Date().toISOString();
  }

  return updateApplication(id, updateData);
}