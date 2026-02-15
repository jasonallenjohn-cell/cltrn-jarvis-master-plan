import { useEffect, useState } from 'react';
import { supabase, type Memory } from '../lib/supabase';
import { useAuth } from '../lib/AuthProvider';

export function useMemories(limit = 10) {
    const { user } = useAuth();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setMemories([]);
            setLoading(false);
            return;
        }

        // Initial fetch
        const fetchMemories = async () => {
            try {
                const { data, error } = await supabase
                    .from('memories')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (error) throw error;
                setMemories(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('memories_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'memories',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setMemories((prev) => [payload.new as Memory, ...prev].slice(0, limit));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, limit]);

    const addMemory = async (content: string, type: 'explicit' | 'observed' | 'derived' = 'explicit') => {
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('memories')
            .insert({
                user_id: user.id,
                content,
                type,
                metadata: {},
            });

        if (error) throw error;
    };

    return { memories, loading, error, addMemory };
}
