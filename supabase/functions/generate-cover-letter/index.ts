import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobPosting, resumeContent, company, role, tone } = await req.json();

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create prompt for cover letter generation
    const prompt = `Generate a professional cover letter based on the following information:

Job Posting:
${jobPosting}

Company: ${company}
Role: ${role}
Tone: ${tone}

Resume Information:
Name: ${resumeContent.personalInfo?.name || 'Applicant'}
Email: ${resumeContent.personalInfo?.email || ''}
Phone: ${resumeContent.personalInfo?.phone || ''}
Summary: ${resumeContent.summary || ''}

Work Experience:
${resumeContent.experience?.map((exp: any) => 
  `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
).join('\n') || 'No experience listed'}

Education:
${resumeContent.education?.map((edu: any) => 
  `- ${edu.degree} from ${edu.school} (${edu.year})`
).join('\n') || 'No education listed'}

Skills: ${resumeContent.skills?.join(', ') || 'No skills listed'}

Please generate a personalized cover letter that:
1. Addresses the specific role and company
2. Highlights relevant experience and skills from the resume
3. Matches the job requirements mentioned in the posting
4. Uses a ${tone} tone
5. Is properly formatted with appropriate paragraphs
6. Includes a compelling opening and strong closing
7. Is approximately 300-400 words

The cover letter should be professional, engaging, and tailored specifically to this job opportunity.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor and professional writer who specializes in creating compelling, personalized cover letters that help candidates stand out to employers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate cover letter' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Cover letter generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});