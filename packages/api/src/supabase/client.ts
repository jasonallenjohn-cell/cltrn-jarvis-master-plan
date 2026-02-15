import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Project IDs
export const PROJECTS = {
    COMMAND_CENTER: 'lwnyvbibdjskbchexwra',
    TRILLIUM: 'qbxtimjhsvqsxoemheqc',
    ARTERIAL: 'ckrsbstgxzhplxgsciwq',
} as const;

// Environment variables for Command Center (primary auth project)
const COMMAND_CENTER_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${PROJECTS.COMMAND_CENTER}.supabase.co`;
const COMMAND_CENTER_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const COMMAND_CENTER_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Create a Supabase client for Command Center (primary auth project)
 * This is the main client for user authentication and profiles.
 * Using untyped client to avoid 'never' type issues with tables
 * not yet defined in Database types.
 */
export function createCommandCenterClient(serviceRole = false) {
    const key = serviceRole ? COMMAND_CENTER_SERVICE_ROLE_KEY : COMMAND_CENTER_ANON_KEY;

    return createSupabaseClient(COMMAND_CENTER_URL, key, {
        auth: {
            persistSession: !serviceRole,
            autoRefreshToken: !serviceRole,
        },
    });
}

/**
 * Create a Supabase client for Trillium (financial intelligence)
 * Credentials are read from Command Center's ops_config table
 */
export async function createTrilliumClient(serviceRole = false) {
    if (serviceRole) {
        // Read credentials from ops_config
        const commandClient = createCommandCenterClient(true);
        const { data: config } = await commandClient
            .from('ops_config')
            .select('key, value')
            .in('key', ['tr_supabase_url', 'tr_service_role_key'])
            .throwOnError();

        if (!config || config.length !== 2) {
            throw new Error('Failed to read Trillium credentials from ops_config');
        }

        const urlConfig = config.find((c: any) => c.key === 'tr_supabase_url');
        const keyConfig = config.find((c: any) => c.key === 'tr_service_role_key');

        return createSupabaseClient(
            urlConfig?.value || '',
            keyConfig?.value || '',
            { auth: { persistSession: false } }
        );
    }

    // For client-side, use environment variables
    const url = process.env.NEXT_PUBLIC_TRILLIUM_URL || `https://${PROJECTS.TRILLIUM}.supabase.co`;
    const key = process.env.NEXT_PUBLIC_TRILLIUM_ANON_KEY || '';

    return createSupabaseClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
    });
}

/**
 * Create a Supabase client for Arterial (health & bio-feedback)
 * Credentials are read from Command Center's ops_config table
 */
export async function createArterialClient(serviceRole = false) {
    if (serviceRole) {
        // Read credentials from ops_config
        const commandClient = createCommandCenterClient(true);
        const { data: config } = await commandClient
            .from('ops_config')
            .select('key, value')
            .in('key', ['art_supabase_url', 'art_service_role_key'])
            .throwOnError();

        if (!config || config.length !== 2) {
            throw new Error('Failed to read Arterial credentials from ops_config');
        }

        const urlConfig = config.find((c: any) => c.key === 'art_supabase_url');
        const keyConfig = config.find((c: any) => c.key === 'art_service_role_key');

        return createSupabaseClient(
            urlConfig?.value || '',
            keyConfig?.value || '',
            { auth: { persistSession: false } }
        );
    }

    // For client-side, use environment variables
    const url = process.env.NEXT_PUBLIC_ARTERIAL_URL || `https://${PROJECTS.ARTERIAL}.supabase.co`;
    const key = process.env.NEXT_PUBLIC_ARTERIAL_ANON_KEY || '';

    return createSupabaseClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
    });
}

/**
 * Create a client from ops_config dynamically
 * Useful for admin tools and service-to-service communication
 */
export async function createClientFromConfig(
    project: 'trillium' | 'arterial',
    serviceRole = true
) {
    if (project === 'trillium') {
        return createTrilliumClient(serviceRole);
    }
    return createArterialClient(serviceRole);
}

// Export a default client for convenience (Command Center)
export const supabase = createCommandCenterClient();
