import { useEffect, useState } from 'react';
import { supabase, type KoreScore } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';

export function useScore() {
    const { user } = useAuth();
    const [score, setScore] = useState<KoreScore | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setScore(null);
            setLoading(false);
            return;
        }

        // Initial fetch
        const fetchScore = async () => {
            try {
                const { data, error } = await supabase
                    .from('kore_scores')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;
                setScore(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScore();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('kore_scores_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'kore_scores',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
                        setScore(payload.new as KoreScore);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return { score, loading, error };
}
