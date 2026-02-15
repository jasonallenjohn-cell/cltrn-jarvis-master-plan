import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature');
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !endpointSecret) {
        return new Response('Webhook Error: Missing signature or secret', { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret, undefined, cryptoProvider);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing event: ${event.type}`);

    try {
        switch (event.type) {
            case 'product.created':
            case 'product.updated':
                await upsertProduct(supabase, event.data.object);
                break;
            case 'price.created':
            case 'price.updated':
                await upsertPrice(supabase, event.data.object);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await upsertSubscription(supabase, event.data.object);
                break;
            case 'checkout.session.completed':
                const session = event.data.object;
                if (session.mode === 'subscription') {
                    const subscriptionId = session.subscription as string;
                    // Subscription handling is mainly done via subscription.updated events, 
                    // but we might want to ensure customer mapping here if needed.
                }
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error: any) {
        console.error(`Error processing event ${event.type}: ${error.message}`);
        return new Response(`Processing Error: ${error.message}`, { status: 500 });
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
});

async function upsertProduct(supabase: any, product: any) {
    const { error } = await supabase.from('products').upsert({
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description,
        image: product.images?.[0] ?? null,
        metadata: product.metadata,
    });
    if (error) throw error;
}

async function upsertPrice(supabase: any, price: any) {
    const { error } = await supabase.from('prices').upsert({
        id: price.id,
        product_id: price.product,
        active: price.active,
        currency: price.currency,
        type: price.type,
        unit_amount: price.unit_amount,
        interval: price.recurring?.interval,
        interval_count: price.recurring?.interval_count,
        trial_period_days: price.recurring?.trial_period_days,
    });
    if (error) throw error;
}

async function upsertSubscription(supabase: any, subscription: any) {
    const { error: customerError, data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (customerError || !customerData) {
        console.error(`Customer lookup failed for ${subscription.customer}`);
        return; // Can't link without user ID
    }

    const { error } = await supabase.from('subscriptions').upsert({
        id: subscription.id,
        user_id: customerData.id,
        status: subscription.status,
        metadata: subscription.metadata,
        price_id: subscription.items.data[0].price.id,
        quantity: subscription.items.data[0].quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    });
    if (error) throw error;
}
