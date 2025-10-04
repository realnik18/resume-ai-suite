import { supabase } from '@/integrations/supabase/client';

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: any;
  ats_score: number;
  last_improved: string | null;
  last_exported: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeData {
  title: string;
  content?: any;
}

export interface UpdateResumeData {
  title?: string;
  content?: any;
}

// Get all resumes for the current user
export async function listResumes(): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`);
  }

  return data || [];
}

// Get a single resume by ID
export async function getResume(id: string): Promise<Resume | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }

  return data;
}

// Create a new resume
export async function createResume(resumeData: CreateResumeData): Promise<Resume> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      ...resumeData,
      user_id: user.id,
      content: resumeData.content || {
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        experience: [],
        education: [],
        skills: []
      }
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create resume: ${error.message}`);
  }

  return data;
}

// Update an existing resume
export async function updateResume(id: string, resumeData: UpdateResumeData): Promise<Resume> {
  const { data, error } = await supabase
    .from('resumes')
    .update(resumeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update resume: ${error.message}`);
  }

  return data;
}

// Delete a resume
export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete resume: ${error.message}`);
  }
}

// Duplicate a resume
export async function duplicateResume(id: string): Promise<Resume> {
  const original = await getResume(id);
  if (!original) {
    throw new Error('Resume not found');
  }

  return createResume({
    title: `${original.title} (Copy)`,
    content: original.content
  });
}

// Improve resume with AI
export async function improveResumeAI(resumeId: string, content: any): Promise<{
  success: boolean;
  improvements: string[];
  ats_score: number;
  keywords_added: string[];
}> {
  const { data, error } = await supabase.functions.invoke('improve-resume', {
    body: { resumeId, content }
  });

  if (error) {
    throw new Error(`Failed to improve resume: ${error.message}`);
  }

  return data;
}