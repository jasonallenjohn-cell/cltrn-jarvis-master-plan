import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SkillRunner, KoreScorer, MemoryManager } from '../_shared/core.ts';

// Example Skills (normally would be imported from a registry)
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const SentimentSkill = {
    name: 'sentiment-analysis',
    description: 'Analyze the sentiment of a text',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ sentiment: z.enum(['positive', 'negative', 'neutral']), score: z.number() }),
    run: async (ctx: any, input: any) => {
        // Mock implementation for now
        const score = Math.random();
        return {
            sentiment: score > 0.6 ? 'positive' : score > 0.4 ? 'neutral' : 'negative',
            score
        };
    }
};

const SummarizeSkill = {
    name: 'summarize',
    description: 'Summarize a long text',
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.object({ summary: z.string() }),
    run: async (ctx: any, input: any) => {
        return { summary: `Summary of: ${input.text.substring(0, 50)}...` };
    }
};

const SKILL_REGISTRY = {
    'sentiment-analysis': SentimentSkill,
    'summarize': SummarizeSkill,
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const { skillName, input } = await req.json();
        const skill = SKILL_REGISTRY[skillName as keyof typeof SKILL_REGISTRY];

        if (!skill) {
            return new Response(JSON.stringify({ error: `Skill '${skillName}' not found` }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Initialize Context
        const scorer = new KoreScorer(supabaseUrl, supabaseServiceKey);
        const memory = new MemoryManager(supabaseUrl, supabaseServiceKey, openaiKey);
        const context = {
            userId: user.id,
            scorer,
            memory,
            logger: (msg: string) => console.log(msg),
        };

        const runner = new SkillRunner(context);
        const result = await runner.execute(skill, input);

        return new Response(JSON.stringify({ success: true, data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
