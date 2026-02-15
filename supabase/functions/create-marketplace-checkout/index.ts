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

        const authHeader = req.headers.get('Authorization')!;
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { priceId, creatorId, returnUrl } = await req.json();

        // Get Creator's Connect Account ID
        const { data: creatorAccount } = await supabaseClient
            .from('connect_accounts')
            .select('stripe_account_id, charges_enabled')
            .eq('user_id', creatorId)
            .single();

        if (!creatorAccount?.charges_enabled) {
            throw new Error('Creator is not ready to receive payments.');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: `${returnUrl || 'http://localhost:3000/portal/skills'}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl || 'http://localhost:3000/portal/skills'}?canceled=true`,
            payment_intent_data: {
                application_fee_amount: 3000, // 30% platform fee logic to be calculated dynamically in real app
                transfer_data: {
                    destination: creatorAccount.stripe_account_id,
                },
            },
            metadata: {
                buyerId: user.id,
                creatorId: creatorId
            },
        });

        return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
