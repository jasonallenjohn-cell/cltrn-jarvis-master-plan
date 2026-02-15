
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface DomainScores {
    financial_mastery: number;
    business_growth: number;
    health_vitality: number;
    relationships: number;
    personal_development: number;
    spiritual_alignment: number;
}

export interface KoreScore extends DomainScores {
    user_id: string;
    overall_score: number;
    updated_at: string;
}

export class KoreScorer {
    private supabase: SupabaseClient;

    constructor(supabaseUrl: string, supabaseServiceKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    /**
     * Calculate the composite K0RE Score from domain inputs.
     * Currently uses a simple equal-weighted average, but can be expanded
     * to include sub-metrics and custom weighting logic.
     */
    public calculateScore(inputs: DomainScores): number {
        const {
            financial_mastery,
            business_growth,
            health_vitality,
            relationships,
            personal_development,
            spiritual_alignment,
        } = inputs;

        const total =
            financial_mastery +
            business_growth +
            health_vitality +
            relationships +
            personal_development +
            spiritual_alignment;

        return Math.round(total / 6);
    }

    /**
     * Update a user's K0RE Score in the database.
     * Also creates a daily snapshot for trend tracking.
     */
    public async updateUserScore(
        userId: string,
        newScores: Partial<DomainScores>
    ): Promise<KoreScore | null> {
        // 1. Fetch current scores to merge with updates
        const { data: current, error: fetchError } = await this.supabase
            .from('kore_scores')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
            console.error('Error fetching current scores:', fetchError);
            throw fetchError;
        }

        // Default to 0 if no record exists
        const baseScores: DomainScores = current || {
            financial_mastery: 0,
            business_growth: 0,
            health_vitality: 0,
            relationships: 0,
            personal_development: 0,
            spiritual_alignment: 0,
        };

        // Merge new scores
        const updatedScores: DomainScores = {
            ...baseScores,
            ...newScores,
        };

        // Recalculate overall score (database generated column handles this, but good to have in app logic too)
        const overall_score = this.calculateScore(updatedScores);

        // 2. Upsert the new score record
        const { data: savedScore, error: upsertError } = await this.supabase
            .from('kore_scores')
            .upsert({
                user_id: userId,
                ...updatedScores,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (upsertError) {
            console.error('Error updating scores:', upsertError);
            throw upsertError;
        }

        // 3. Create or update daily snapshot
        // We use ON CONFLICT DO UPDATE to ensure only one snapshot per day per user
        const today = new Date().toISOString().split('T')[0];

        const { error: snapshotError } = await this.supabase
            .from('kore_score_snapshots')
            .upsert({
                user_id: userId,
                date: today,
                ...updatedScores,
                overall_score, // Snapshot table needs this explicitly as it's not generated
            }, { onConflict: 'user_id, date' })

        if (snapshotError) {
            console.error('Error saving snapshot:', snapshotError);
            // We don't throw here to avoid blocking the main score update
        }

        return savedScore;
    }

    /**
     * Get score history for trend analysis
     */
    public async getScoreHistory(userId: string, days: number = 30): Promise<any[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await this.supabase
            .from('kore_score_snapshots')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching history:', error);
            throw error;
        }

        return data || [];
    }
}
