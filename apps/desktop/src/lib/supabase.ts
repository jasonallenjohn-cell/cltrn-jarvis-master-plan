import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zolfyezvvzexslaudjbx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbGZ5ZXp2dnpleHNsYXVkamJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzMzNzQsImV4cCI6MjA4NjcwOTM3NH0.MTRChqs2Z_SSk2YDLqfZYAumFnCCL2o4rXKyc1q5E4w';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
});

// Helper types
export interface KoreScore {
    user_id: string;
    financial_mastery: number;
    business_growth: number;
    health_vitality: number;
    relationships: number;
    personal_development: number;
    spiritual_alignment: number;
    overall_score: number;
    updated_at: string;
}

export interface Memory {
    id: string;
    user_id: string;
    content: string;
    type: 'explicit' | 'observed' | 'derived';
    metadata: any;
    created_at: string;
}

export interface Mission {
    id: string;
    proposal_id: string;
    name: string;
    status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
    started_at?: string;
    completed_at?: string;
    result_summary?: string;
    metadata: any;
    created_at: string;
    updated_at: string;
}
