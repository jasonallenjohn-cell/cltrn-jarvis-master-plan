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
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          kore_score: number
          subscription_tier: 'observer' | 'operator' | 'commander' | 'architect' | 'enterprise'
          referral_code: string | null
          referred_by: string | null
          onboarding_status: 'pending' | 'in_progress' | 'completed'
          onboarding_completed_at: string | null
          first_dream_data: Json | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          kore_score?: number
          subscription_tier?: 'observer' | 'operator' | 'commander' | 'architect' | 'enterprise'
          referral_code?: string | null
          referred_by?: string | null
          onboarding_status?: 'pending' | 'in_progress' | 'completed'
          onboarding_completed_at?: string | null
          first_dream_data?: Json | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          kore_score?: number
          subscription_tier?: 'observer' | 'operator' | 'commander' | 'architect' | 'enterprise'
          referral_code?: string | null
          referred_by?: string | null
          onboarding_status?: 'pending' | 'in_progress' | 'completed'
          onboarding_completed_at?: string | null
          first_dream_data?: Json | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          type: string
          file_url: string
          shared_with: string[]
          created_by: string | null
          created_at: string
          status: 'active' | 'archived' | 'deleted'
        }
        Insert: {
          id?: string
          title: string
          type: string
          file_url: string
          shared_with?: string[]
          created_by?: string | null
          created_at?: string
          status?: 'active' | 'archived' | 'deleted'
        }
        Update: {
          id?: string
          title?: string
          type?: string
          file_url?: string
          shared_with?: string[]
          created_by?: string | null
          created_at?: string
          status?: 'active' | 'archived' | 'deleted'
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read_at?: string | null
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
    Views: {}
    Functions: {}
    Enums: {}
  }
}
