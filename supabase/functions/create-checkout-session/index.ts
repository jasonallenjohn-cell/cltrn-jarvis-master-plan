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

        const { priceId, returnUrl } = await req.json();

        // Get or Create Stripe Customer
        const { data: customerData } = await supabaseClient
            .from('customers')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = customerData?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabase_id: user.id },
            });
            customerId = customer.id;
            await supabaseClient.from('customers').upsert({ id: user.id, stripe_customer_id: customerId });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${returnUrl || 'http://localhost:3000/portal'}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl || 'http://localhost:3000/pricing'}?canceled=true`,
            metadata: { userId: user.id },
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
