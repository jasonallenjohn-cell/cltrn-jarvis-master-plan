import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

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

        // Admin Check
        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) throw new Error('Unauthorized');

        // In a real app, verify 'admin' role here via user metadata or a table lookup
        // const { data: profile } = await supabaseClient.from('user_profiles').select('role').eq('id', user.id).single();
        // if (profile.role !== 'admin') throw new Error('Forbidden');

        // Fetch Key Metrics
        const now = Math.floor(Date.now() / 1000);
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

        // 1. MRR (simplified: sum of active subscription prices)
        // Stripe doesn't give MRR directly without Sigma, so we calculate from active subscriptions
        let mrr = 0;
        const subscriptions = await stripe.subscriptions.list({
            status: 'active',
            limit: 100,
            expand: ['data.items.data.price']
        });

        for (const sub of subscriptions.data) {
            const price = sub.items.data[0].price;
            if (price.unit_amount) {
                mrr += (price.unit_amount / 100) * (price.interval === 'year' ? 1 / 12 : 1);
            }
        }

        // 2. GMV (Gross Merchandise Value) - Charges in last 30 days
        // Using PaymentIntents or Charges
        const charges = await stripe.charges.list({
            created: { gte: thirtyDaysAgo },
            limit: 100,
        });
        const gmv = charges.data.reduce((acc, charge) => acc + (charge.amount / 100), 0);

        // 3. Active Subscribers
        const activeSubscribers = subscriptions.data.length;

        // 4. Churn Rate (simplified placeholder)
        // To calculate real churn, we need canceled subs in period / total subs at start
        const canceledSubs = await stripe.subscriptions.list({
            status: 'canceled',
            created: { gte: thirtyDaysAgo },
            limit: 100,
        });
        const churnRate = activeSubscribers > 0 ? (canceledSubs.data.length / activeSubscribers) * 100 : 0;

        return new Response(JSON.stringify({
            mrr: mrr.toFixed(2),
            gmv: gmv.toFixed(2),
            activeSubscribers,
            churnRate: churnRate.toFixed(1)
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
