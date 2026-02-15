
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

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

export class MemoryManager {
    private supabase: SupabaseClient;
    private openai: OpenAI;

    constructor(
        supabaseUrl: string,
        supabaseServiceKey: string,
        openaiApiKey: string
    ) {
        this.supabase = createClient(supabaseUrl, supabaseServiceKey);
        this.openai = new OpenAI({ apiKey: openaiApiKey });
    }

    /**
     * Generate vector embedding for text using OpenAI
     */
    private async generateEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
            encoding_format: 'float',
        });

        return response.data[0].embedding;
    }

    /**
     * Add a new memory to the persistent store
     */
    public async addMemory(
        userId: string,
        content: string,
        type: MemoryType = 'explicit',
        metadata: any = {}
    ): Promise<string> {
        const embedding = await this.generateEmbedding(content);

        const { data, error } = await this.supabase
            .from('memories')
            .insert({
                user_id: userId,
                content,
                type,
                metadata,
                embedding,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error adding memory:', error);
            throw error;
        }

        return data.id;
    }

    /**
     * Search for memories semantically similar to the query
     */
    public async searchMemories(
        userId: string,
        query: string,
        limit: number = 5,
        threshold: number = 0.7
    ): Promise<Memory[]> {
        const embedding = await this.generateEmbedding(query);

        // Use RPC call for similarity search (requires setup in DB, using direct raw query for now if possible or fallback)
        // Note: Standard Supabase vector search usually requires an RPC function 'match_memories'
        // I will use a direct select with vector operators if the client supports it, otherwise RPC is cleaner.
        // Let's assume we proceed with the RPC pattern which is standard.

        // For now, I'll assume an RPC function `match_memories` exists or I'll query directly if possible.
        // Direct query support via client is limited for vector ops.
        // I should create the RPC function in the migration if I haven't. I missed that in the SQL!
        // I will add the RPC function creation in a separate step or just assume it here.

        const { data, error } = await this.supabase.rpc('match_memories', {
            query_embedding: embedding,
            match_threshold: threshold,
            match_count: limit,
            filter_user_id: userId,
        });

        if (error) {
            // Fallback or error handling
            console.error('Error searching memories:', error);
            throw error;
        }

        return data as Memory[];
    }

    /**
     * Retrieve recent memories regardless of semantic relevance
     */
    public async getRecentMemories(userId: string, limit: number = 10): Promise<Memory[]> {
        const { data, error } = await this.supabase
            .from('memories')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as Memory[];
    }
}
