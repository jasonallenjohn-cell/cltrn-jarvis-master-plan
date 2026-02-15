import { useEffect, useState } from 'react';
import { supabase, type Mission } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';

interface MissionWithSteps extends Mission {
    ops_mission_steps?: any[];
}

export function useMissions() {
    const { user } = useAuth();
    const [missions, setMissions] = useState<MissionWithSteps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setMissions([]);
            setLoading(false);
            return;
        }

        // Initial fetch
        const fetchMissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('ops_missions')
                    .select(`
                        *,
                        ops_mission_steps (*)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;
                setMissions(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('missions_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'ops_missions',
                },
                () => {
                    fetchMissions(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return { missions, loading, error };
}
