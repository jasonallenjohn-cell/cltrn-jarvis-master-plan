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

        // Auth Check
        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { returnUrl } = await req.json();

        // Check if account already exists
        const { data: accountData } = await supabaseClient
            .from('connect_accounts')
            .select('stripe_account_id')
            .eq('user_id', user.id)
            .single();

        let accountId = accountData?.stripe_account_id;

        if (!accountId) {
            // Create Express Account
            const account = await stripe.accounts.create({
                type: 'express',
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: { supabase_id: user.id },
            });
            accountId = account.id;

            await supabaseClient.from('connect_accounts').upsert({
                user_id: user.id,
                stripe_account_id: accountId,
            });
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${returnUrl || 'http://localhost:3000/portal/creator'}?refresh=true`,
            return_url: `${returnUrl || 'http://localhost:3000/portal/creator'}?success=true`,
            type: 'account_onboarding',
        });

        return new Response(JSON.stringify({ url: accountLink.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
