import { supabase } from '@/integrations/supabase/client';

// Cover Letter interface
export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  content: string;
  job_posting?: string;
  company?: string;
  role?: string;
  tone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCoverLetterData {
  title: string;
  content: string;
  job_posting?: string;
  company?: string;
  role?: string;
  tone?: string;
}

export interface UpdateCoverLetterData {
  title?: string;
  content?: string;
  job_posting?: string;
  company?: string;
  role?: string;
  tone?: string;
}

// List all cover letters for the current user
export async function listCoverLetters(): Promise<CoverLetter[]> {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cover letters: ${error.message}`);
  }

  return data || [];
}

// Get a single cover letter by ID
export async function getCoverLetter(id: string): Promise<CoverLetter | null> {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch cover letter: ${error.message}`);
  }

  return data;
}

// Create a new cover letter
export async function createCoverLetter(coverLetterData: CreateCoverLetterData): Promise<CoverLetter> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create cover letters');
  }

  const { data, error } = await supabase
    .from('cover_letters')
    .insert({
      user_id: user.id,
      tone: 'professional',
      ...coverLetterData,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create cover letter: ${error.message}`);
  }

  return data;
}

// Update an existing cover letter
export async function updateCoverLetter(id: string, coverLetterData: UpdateCoverLetterData): Promise<CoverLetter> {
  const { data, error } = await supabase
    .from('cover_letters')
    .update(coverLetterData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update cover letter: ${error.message}`);
  }

  return data;
}

// Delete a cover letter
export async function deleteCoverLetter(id: string): Promise<void> {
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete cover letter: ${error.message}`);
  }
}

// Generate cover letter with AI
export async function generateCoverLetterAI(
  jobPosting: string,
  resumeContent: any,
  company: string,
  role: string,
  tone: string = 'professional'
): Promise<{
  success: boolean;
  content?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
      body: {
        jobPosting,
        resumeContent,
        company,
        role,
        tone
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, content: data.content };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate cover letter' 
    };
  }
}