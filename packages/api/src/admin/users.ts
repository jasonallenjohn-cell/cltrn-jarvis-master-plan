import { createCommandCenterClient } from '../supabase/client';
import type { Database } from '../types/command-center';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

const supabase = createCommandCenterClient();

export interface UserFilters {
    search?: string;
    tier?: string;
    status?: string;
    joinDateFrom?: string;
    joinDateTo?: string;
}

export interface ScoreHistoryEntry {
    date: string;
    score: number;
}

/**
 * Get all users with optional filters
 */
export async function getAllUsers(filters?: UserFilters): Promise<UserProfile[]> {
    let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
    }

    if (filters?.tier) {
        query = query.eq('subscription_tier', filters.tier);
    }

    if (filters?.status) {
        query = query.eq('onboarding_status', filters.status);
    }

    if (filters?.joinDateFrom) {
        query = query.gte('created_at', filters.joinDateFrom);
    }

    if (filters?.joinDateTo) {
        query = query.lte('created_at', filters.joinDateTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

/**
 * Get user profile by ID (admin version with full access)
 */
export async function getAdminUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    return data;
}

/**
 * Update user profile (admin version)
 */
export async function updateAdminUserProfile(
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
 * Delete user (admin only)
 */
export async function deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

    if (error) throw error;
}

/**
 * Get K0RE Score history for a user
 * Note: This is a placeholder - you'll need to implement score tracking
 * in a separate table if you want historical data
 */
export async function getUserScoreHistory(userId: string): Promise<ScoreHistoryEntry[]> {
    // For now, return mock data
    // TODO: Implement actual score_history table
    const profile = await getAdminUserProfile(userId);

    if (!profile) return [];

    // Generate mock historical data based on current score
    const currentScore = profile.kore_score || 0;
    const history: ScoreHistoryEntry[] = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic score progression
        const variance = Math.floor(Math.random() * 10) - 5;
        const score = Math.max(0, Math.min(100, currentScore - (30 - i) * 2 + variance));

        history.push({
            date: date.toISOString().split('T')[0],
            score,
        });
    }

    return history;
}

/**
 * Get user statistics
 */
export async function getUserStats() {
    const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('onboarding_status', 'completed');

    const { count: pendingUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('onboarding_status', 'pending');

    return {
        total: totalUsers || 0,
        active: activeUsers || 0,
        pending: pendingUsers || 0,
    };
}
