import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const AGENTS = [
    "agent-broker", "agent-builder", "agent-advisor", "agent-creator", "agent-healer", // Trillium
    "agent-prospector", "agent-cadence", "agent-intel", "agent-deal-closer", "agent-success", "agent-sales-ops", // Arterial
    "agent-chief" // Cross-Division
];

serve(async (req) => {
    try {
        // 1. Init Supabase
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Fetch Config for Cross-Project Calls (if needed)
        // const { data: config } = await supabase.from('ops_config').select('key, value');

        // 3. Orchestrate Agents
        const results = await Promise.allSettled(AGENTS.map(async (slug) => {
            // In a real deployed setup, these would be separate function URLs. 
            // For now, we simulate or call them if they existed.
            // Since existing agents are deployed "via Supabase MCP to Command Center", they are likely peer functions.
            // We can invoke them using `supabase.functions.invoke(slug, ...)`

            const { data, error } = await supabase.functions.invoke(slug, {
                body: { action: "heartbeat" }
            });

            if (error) throw error;
            return { slug, data };
        }));

        // 4. Process Reactions
        // Fetch recent events that haven't been processed (simulation: fetch last 1 minute events)
        // In production, we'd use a 'processed' flag or cursor.
        const { data: events } = await supabase
            .from('ops_events')
            .select('*')
            .gt('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
            .order('created_at', { ascending: false });

        // Fetch active reactions
        const { data: reactions } = await supabase
            .from('ops_reactions')
            .select('*')
            .eq('active', true);

        const triggeredProposals = [];

        if (events && reactions) {
            for (const event of events) {
                const match = reactions.find(r => r.trigger_event === `${event.agent_slug}.${event.event_type}`);
                if (match) {
                    // Trigger found! Create Proposal
                    const description = `Auto-triggered by ${match.trigger_event}`;

                    await supabase.from('ops_proposals').insert({
                        title: `Reaction: ${match.target_action} by ${match.target_agent}`,
                        description,
                        source: 'reaction',
                        status: 'pending',
                        metadata: {
                            trigger_event_id: event.id,
                            target_agent: match.target_agent,
                            target_action: match.target_action,
                            payload: match.payload_template || {}
                        }
                    });
                    triggeredProposals.push(match.trigger_event);
                }
            }
        }

        return new Response(JSON.stringify({
            status: "success",
            agents_pinged: results.length,
            reactions_triggered: triggeredProposals.length,
            results: results
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
