import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");

    const { resumeId, content } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get current resume content
    const resumeContent = typeof content === 'string' ? content : JSON.stringify(content);

    // Generate improvement suggestions using GPT-5
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
            content: `You are an expert resume writer and ATS optimization specialist. Analyze the provided resume content and provide specific improvements to:
            1. Make it more ATS-friendly
            2. Improve keyword optimization
            3. Enhance impact statements with quantifiable results
            4. Improve overall structure and readability
            5. Suggest better action verbs and industry-specific terminology
            
            Return your response as a JSON object with:
            - "improved_content": The improved resume content
            - "suggestions": Array of specific improvement suggestions
            - "ats_score": Estimated ATS score (0-100)
            - "keywords_added": Array of important keywords that were added`
          },
          {
            role: 'user',
            content: `Please analyze and improve this resume content: ${resumeContent}`
          }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    let improvements;
    try {
      improvements = JSON.parse(aiResponse);
    } catch (e) {
      // If AI doesn't return valid JSON, create a structured response
      improvements = {
        improved_content: aiResponse,
        suggestions: ["Review the AI-generated improvements and apply relevant changes"],
        ats_score: 75,
        keywords_added: []
      };
    }

    // Update resume in database
    const { error: updateError } = await supabaseClient
      .from('resumes')
      .update({
        content: improvements.improved_content,
        ats_score: improvements.ats_score || 75,
        last_improved: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      improvements: improvements.suggestions || [],
      ats_score: improvements.ats_score || 75,
      keywords_added: improvements.keywords_added || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in improve-resume function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});