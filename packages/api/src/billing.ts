import { createCommandCenterClient } from './supabase/client';

export async function createCheckoutSession(priceId: string, returnUrl?: string) {
    const supabase = createCommandCenterClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, returnUrl }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create session');

    // Provide redirect logic to caller
    return data;
}

export async function createPortalSession(returnUrl?: string) {
    const supabase = createCommandCenterClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-portal-session`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create portal session');

    return data;
}

export async function createConnectAccountLink(returnUrl?: string) {
    const supabase = createCommandCenterClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/connect-onboard`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create connect link');

    return data;
}

export async function createMarketplaceCheckout(priceId: string, creatorId: string, returnUrl?: string) {
    const supabase = createCommandCenterClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-marketplace-checkout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, creatorId, returnUrl }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create checkout');

    return data;
}

export async function getRevenueMetrics() {
    const supabase = createCommandCenterClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-revenue-metrics`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch metrics');

    return data;
}
