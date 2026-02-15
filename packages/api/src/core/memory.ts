import { createCommandCenterClient } from '../supabase/client';

export type MemoryType = 'explicit' | 'observed' | 'derived';

export interface Memory {
    id: string;
    user_id: string;
    content: string;
    type: MemoryType;
    metadata: any;
    similarity?: number;
    created_at: string;
}

/**
 * Add a new memory
 */
export async function addMemory(
    content: string,
    type: MemoryType = 'explicit',
    metadata: any = {}
): Promise<string> {
    const supabase = createCommandCenterClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/add-memory`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, type, metadata }),
        }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.id;
}

/**
 * Search memories semantically
 */
export async function searchMemories(
    query: string,
    limit: number = 5,
    threshold: number = 0.7
): Promise<Memory[]> {
    const supabase = createCommandCenterClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/search-memories`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, limit, threshold }),
        }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data;
}

/**
 * Get recent memories (no semantic search)
 */
export async function getRecentMemories(limit: number = 10): Promise<Memory[]> {
    const supabase = createCommandCenterClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching memories:', error);
        return [];
    }

    return data;
}
