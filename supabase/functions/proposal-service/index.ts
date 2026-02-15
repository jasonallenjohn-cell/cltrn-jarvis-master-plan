
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { title, description, source = 'api', priority = 1, metadata = {} } = await req.json();

        // 1. Create Proposal
        const { data: proposal, error: proposalError } = await supabase
            .from('ops_proposals')
            .insert({
                title,
                description,
                source,
                status: 'approved', // Auto-approve for demo/MVP
                priority,
                metadata
            })
            .select()
            .single();

        if (proposalError) throw proposalError;

        // 2. Create Mission (since auto-approved)
        const { data: mission, error: missionError } = await supabase
            .from('ops_missions')
            .insert({
                proposal_id: proposal.id,
                name: title,
                status: 'queued',
                metadata
            })
            .select()
            .single();

        if (missionError) throw missionError;

        // 3. Create Steps (Basic Routing Logic)
        // Simple Keyword matching to assign agent
        let targetAgent = 'agent-chief'; // Default
        let action = 'analyze_request';

        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('property') || lowerTitle.includes('deal')) targetAgent = 'agent-broker';
        if (lowerTitle.includes('feasibility') || lowerTitle.includes('build')) targetAgent = 'agent-builder';
        if (lowerTitle.includes('investor') || lowerTitle.includes('financial')) targetAgent = 'agent-advisor';
        if (lowerTitle.includes('memo') || lowerTitle.includes('email')) targetAgent = 'agent-creator';
        if (lowerTitle.includes('prospect') || lowerTitle.includes('lead')) targetAgent = 'agent-prospector';

        // Create single step for now
        await supabase.from('ops_mission_steps').insert({
            mission_id: mission.id,
            step_order: 1,
            agent_slug: targetAgent,
            action: action,
            payload: { original_request: description, ...metadata },
            status: 'queued'
        });

        return new Response(JSON.stringify({
            proposal_id: proposal.id,
            mission_id: mission.id,
            assigned_agent: targetAgent
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
