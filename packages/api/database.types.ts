export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    created_at: string
                }
                Insert: {
                    id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                }
            },
            agent_runs: {
                Row: {
                    id: string
                    agent_name: string
                    trigger_type: 'manual' | 'scheduled' | 'reaction'
                    triggered_by: string | null
                    started_at: string
                    completed_at: string | null
                    status: 'running' | 'completed' | 'failed'
                    result: Json | null
                }
                Insert: {
                    id?: string
                    agent_name: string
                    trigger_type: 'manual' | 'scheduled' | 'reaction'
                    triggered_by?: string | null
                    started_at?: string
                    completed_at?: string | null
                    status: 'running' | 'completed' | 'failed'
                    result?: Json | null
                }
                Update: {
                    id?: string
                    agent_name?: string
                    trigger_type?: 'manual' | 'scheduled' | 'reaction'
                    triggered_by?: string | null
                    started_at?: string
                    completed_at?: string | null
                    status?: 'running' | 'completed' | 'failed'
                    result?: Json | null
                }
            }
        }
    }
}
