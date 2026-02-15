import { createCommandCenterClient } from './client';
import type { Database } from '../types/command-center';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

const supabase = createCommandCenterClient();

/**
 * Sign in with magic link (passwordless email)
 */
export async function signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
    });

    if (error) throw error;
    return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
    });

    if (error) throw error;
    return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

/**
 * Get current session
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }

    return data;
}

/**
 * Create user profile (typically called after signup)
 */
export async function createUserProfile(profile: UserProfileInsert): Promise<UserProfile> {
    const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: UserProfileUpdate
): Promise<UserProfile> {
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get user profile by referral code
 */
export async function getUserByReferralCode(referralCode: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('referral_code', referralCode)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }

    return data;
}

/**
 * Update K0RE score
 */
export async function updateKoreScore(userId: string, score: number): Promise<UserProfile> {
    return updateUserProfile(userId, { kore_score: score });
}

/**
 * Update subscription tier
 */
export async function updateSubscriptionTier(
    userId: string,
    tier: 'observer' | 'operator' | 'commander' | 'architect' | 'enterprise'
): Promise<UserProfile> {
    return updateUserProfile(userId, { subscription_tier: tier });
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(
    userId: string,
    firstDreamData?: any
): Promise<UserProfile> {
    return updateUserProfile(userId, {
        onboarding_status: 'completed',
        onboarding_completed_at: new Date().toISOString(),
        first_dream_data: firstDreamData,
    });
}

/**
 * Get referral stats for a user
 */
export async function getReferralStats(userId: string) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, subscription_tier, created_at')
        .eq('referred_by', userId);

    if (error) throw error;

    return {
        totalReferrals: data.length,
        referrals: data,
    };
}
