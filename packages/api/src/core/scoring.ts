import { createCommandCenterClient } from '../supabase/client';

export interface DomainScores {
    financial_mastery?: number;
    business_growth?: number;
    health_vitality?: number;
    relationships?: number;
    personal_development?: number;
    spiritual_alignment?: number;
}

export interface KoreScore extends Required<DomainScores> {
    user_id: string;
    overall_score: number;
    updated_at: string;
}

export interface ScoreSnapshot {
    id: string;
    user_id: string;
    date: string;
    financial_mastery: number;
    business_growth: number;
    health_vitality: number;
    relationships: number;
    personal_development: number;
    spiritual_alignment: number;
    overall_score: number;
    created_at: string;
}

/**
 * Update user's K0RE Score
 */
export async function updateScore(scores: DomainScores): Promise<KoreScore> {
    const supabase = createCommandCenterClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-score`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scores }),
        }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data;
}

/**
 * Get score history for trend charts
 */
export async function getScoreHistory(days: number = 30): Promise<ScoreSnapshot[]> {
    const supabase = createCommandCenterClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-score-history?days=${days}`,
        {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
        }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data;
}

/**
 * Get current score directly from database (faster for dashboard)
 */
export async function getCurrentScore(): Promise<KoreScore | null> {
    const supabase = createCommandCenterClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('kore_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching current score:', error);
        return null;
    }

    return data;
}
