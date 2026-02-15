export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          investor_id: string | null
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          investor_id?: string | null
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          investor_id?: string | null
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          action_type: string
          admin_email: string
          admin_id: string | null
          admin_name: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_name: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          action_type: string
          admin_email: string
          admin_id?: string | null
          admin_name: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          admin_email?: string
          admin_id?: string | null
          admin_name?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_name?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_invites: {
        Row: {
          accepted_at: string | null
          assigned_deals: string[] | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invite_token: string
          invited_by: string | null
          role: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_deals?: string[] | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invite_token: string
          invited_by?: string | null
          role?: string
        }
        Update: {
          accepted_at?: string | null
          assigned_deals?: string[] | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          assigned_deals: string[] | null
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          invited_by: string | null
          is_active: boolean | null
          last_login_at: string | null
          name: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          assigned_deals?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          name: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_deals?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          name?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      borrowers: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          created_at: string | null
          credit_score: number | null
          email: string | null
          id: string
          id_verified: boolean | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          credit_score?: number | null
          email?: string | null
          id?: string
          id_verified?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          credit_score?: number | null
          email?: string | null
          id?: string
          id_verified?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          admin_id: string | null
          conversation_id: string | null
          id: string
          investor_id: string | null
          joined_at: string | null
          last_read_at: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          admin_id?: string | null
          conversation_id?: string | null
          id?: string
          investor_id?: string | null
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          admin_id?: string | null
          conversation_id?: string | null
          id?: string
          investor_id?: string | null
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          active_financial_model_id: string | null
          actual_completion_date: string | null
          address: string
          affordable_units: number | null
          annual_cash_flow: number | null
          annual_noi: number | null
          city: string
          cmhc_mortgage: number | null
          created_at: string | null
          deal_type: string | null
          description: string | null
          equity_takeout: number | null
          featured_image: string | null
          gallery_images: string[] | null
          google_drive_folder_id: string | null
          google_drive_folder_url: string | null
          highlights: string[] | null
          id: string
          is_featured: boolean | null
          is_visible: boolean | null
          name: string
          offering_date: string | null
          projected_close_date: string | null
          projected_completion_date: string | null
          projected_hold_period: number | null
          property_type: string
          province: string | null
          purchase_price: number | null
          share_price: number | null
          shares_available: number | null
          slug: string
          status: string | null
          target_cash_on_cash: number | null
          target_equity_multiple: number | null
          target_irr: number | null
          total_equity_raise: number | null
          total_gfa: number | null
          total_project_cost: number | null
          total_shares: number | null
          total_units: number | null
          updated_at: string | null
        }
        Insert: {
          active_financial_model_id?: string | null
          actual_completion_date?: string | null
          address: string
          affordable_units?: number | null
          annual_cash_flow?: number | null
          annual_noi?: number | null
          city: string
          cmhc_mortgage?: number | null
          created_at?: string | null
          deal_type?: string | null
          description?: string | null
          equity_takeout?: number | null
          featured_image?: string | null
          gallery_images?: string[] | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          highlights?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          name: string
          offering_date?: string | null
          projected_close_date?: string | null
          projected_completion_date?: string | null
          projected_hold_period?: number | null
          property_type: string
          province?: string | null
          purchase_price?: number | null
          share_price?: number | null
          shares_available?: number | null
          slug: string
          status?: string | null
          target_cash_on_cash?: number | null
          target_equity_multiple?: number | null
          target_irr?: number | null
          total_equity_raise?: number | null
          total_gfa?: number | null
          total_project_cost?: number | null
          total_shares?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Update: {
          active_financial_model_id?: string | null
          actual_completion_date?: string | null
          address?: string
          affordable_units?: number | null
          annual_cash_flow?: number | null
          annual_noi?: number | null
          city?: string
          cmhc_mortgage?: number | null
          created_at?: string | null
          deal_type?: string | null
          description?: string | null
          equity_takeout?: number | null
          featured_image?: string | null
          gallery_images?: string[] | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          highlights?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_visible?: boolean | null
          name?: string
          offering_date?: string | null
          projected_close_date?: string | null
          projected_completion_date?: string | null
          projected_hold_period?: number | null
          property_type?: string
          province?: string | null
          purchase_price?: number | null
          share_price?: number | null
          shares_available?: number | null
          slug?: string
          status?: string | null
          target_cash_on_cash?: number | null
          target_equity_multiple?: number | null
          target_irr?: number | null
          total_equity_raise?: number | null
          total_gfa?: number | null
          total_project_cost?: number | null
          total_shares?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_active_financial_model_id_fkey"
            columns: ["active_financial_model_id"]
            isOneToOne: false
            referencedRelation: "financial_models"
            referencedColumns: ["id"]
          },
        ]
      }
      distributions: {
        Row: {
          amount: number
          created_at: string | null
          deal_id: string | null
          description: string | null
          distribution_date: string
          distribution_type: string | null
          id: string
          investment_id: string | null
          investor_id: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          distribution_date: string
          distribution_type?: string | null
          id?: string
          investment_id?: string | null
          investor_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          distribution_date?: string
          distribution_type?: string | null
          id?: string
          investment_id?: string | null
          investor_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          deal_id: string | null
          description: string | null
          document_type: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_public: boolean | null
          name: string
          upload_date: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          document_type: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_public?: boolean | null
          name: string
          upload_date?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          document_type?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          name?: string
          upload_date?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_preferences: {
        Row: {
          created_at: string | null
          deal_updates: boolean | null
          distribution_notices: boolean | null
          id: string
          investor_id: string | null
          marketing: boolean | null
          new_documents: boolean | null
          newsletter: boolean | null
          updated_at: string | null
          video_messages: boolean | null
        }
        Insert: {
          created_at?: string | null
          deal_updates?: boolean | null
          distribution_notices?: boolean | null
          id?: string
          investor_id?: string | null
          marketing?: boolean | null
          new_documents?: boolean | null
          newsletter?: boolean | null
          updated_at?: string | null
          video_messages?: boolean | null
        }
        Update: {
          created_at?: string | null
          deal_updates?: boolean | null
          distribution_notices?: boolean | null
          id?: string
          investor_id?: string | null
          marketing?: boolean | null
          new_documents?: boolean | null
          newsletter?: boolean | null
          updated_at?: string | null
          video_messages?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "email_preferences_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: true
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_models: {
        Row: {
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          google_drive_file_id: string | null
          google_drive_pdf_id: string | null
          id: string
          inputs: Json | null
          name: string
          outputs_cache: Json | null
          status: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          google_drive_file_id?: string | null
          google_drive_pdf_id?: string | null
          id?: string
          inputs?: Json | null
          name?: string
          outputs_cache?: Json | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          google_drive_file_id?: string | null
          google_drive_pdf_id?: string | null
          id?: string
          inputs?: Json | null
          name?: string
          outputs_cache?: Json | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_models_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_memos: {
        Row: {
          deal_id: string
          drive_file_id: string | null
          file_name: string
          file_url: string | null
          generated_at: string | null
          id: string
          version: number
        }
        Insert: {
          deal_id: string
          drive_file_id?: string | null
          file_name: string
          file_url?: string | null
          generated_at?: string | null
          id?: string
          version?: number
        }
        Update: {
          deal_id?: string
          drive_file_id?: string | null
          file_name?: string
          file_url?: string | null
          generated_at?: string | null
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "generated_memos_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          deal_id: string | null
          id: string
          investor_id: string | null
          message: string | null
          responded_at: string | null
          responded_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          investor_id?: string | null
          message?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          investor_id?: string | null
          message?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          commitment_date: string | null
          created_at: string | null
          deal_id: string | null
          exit_amount: number | null
          exit_date: string | null
          funding_date: string | null
          id: string
          investor_id: string | null
          notes: string | null
          ownership_percentage: number | null
          share_price: number
          shares: number
          status: string | null
          total_distributions: number | null
          total_invested: number
          updated_at: string | null
        }
        Insert: {
          commitment_date?: string | null
          created_at?: string | null
          deal_id?: string | null
          exit_amount?: number | null
          exit_date?: string | null
          funding_date?: string | null
          id?: string
          investor_id?: string | null
          notes?: string | null
          ownership_percentage?: number | null
          share_price: number
          shares: number
          status?: string | null
          total_distributions?: number | null
          total_invested: number
          updated_at?: string | null
        }
        Update: {
          commitment_date?: string | null
          created_at?: string | null
          deal_id?: string | null
          exit_amount?: number | null
          exit_date?: string | null
          funding_date?: string | null
          id?: string
          investor_id?: string | null
          notes?: string | null
          ownership_percentage?: number | null
          share_price?: number
          shares?: number
          status?: string | null
          total_distributions?: number | null
          total_invested?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          accredited: boolean | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          investor_type: string | null
          is_active: boolean | null
          last_name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accredited?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          investor_type?: string | null
          is_active?: boolean | null
          last_name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accredited?: boolean | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          investor_type?: string | null
          is_active?: boolean | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loan_investor_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          loan_investor_id: string
          loan_payment_id: string
          paid_date: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          loan_investor_id: string
          loan_payment_id: string
          paid_date?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          loan_investor_id?: string
          loan_payment_id?: string
          paid_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_investor_payments_loan_investor_id_fkey"
            columns: ["loan_investor_id"]
            isOneToOne: false
            referencedRelation: "loan_investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_investor_payments_loan_payment_id_fkey"
            columns: ["loan_payment_id"]
            isOneToOne: false
            referencedRelation: "loan_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_investors: {
        Row: {
          created_at: string | null
          funded_date: string | null
          id: string
          investment_amount: number
          investor_id: string
          loan_id: string
          monthly_payment_share: number | null
          notes: string | null
          share_percent: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          funded_date?: string | null
          id?: string
          investment_amount: number
          investor_id: string
          loan_id: string
          monthly_payment_share?: number | null
          notes?: string | null
          share_percent: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          funded_date?: string | null
          id?: string
          investment_amount?: number
          investor_id?: string
          loan_id?: string
          monthly_payment_share?: number | null
          notes?: string | null
          share_percent?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_investors_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_investors_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_payments: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          interest_amount: number | null
          loan_id: string
          notes: string | null
          paid_amount: number | null
          paid_date: string | null
          payment_number: number
          principal_amount: number | null
          status: string
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          interest_amount?: number | null
          loan_id: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_number: number
          principal_amount?: number | null
          status?: string
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          interest_amount?: number | null
          loan_id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_number?: number
          principal_amount?: number | null
          status?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          amortization_months: number | null
          appraisal_value: number | null
          borrower_id: string | null
          collateral_description: string | null
          created_at: string | null
          date_of_advance: string | null
          deal_id: string | null
          estimated_market_value: number | null
          existing_1st_lender: string | null
          existing_1st_mortgage: number | null
          existing_2nd_lender: string | null
          existing_2nd_mortgage: number | null
          exit_strategy: string | null
          google_drive_folder_id: string | null
          google_drive_folder_url: string | null
          gross_advance: number | null
          guarantor_contact: string | null
          guarantor_name: string | null
          id: string
          interest_adjustment: number | null
          interest_rate: number | null
          investor_pool_amount: number | null
          investor_pool_percent: number | null
          is_syndicated: boolean | null
          lender_fee: number | null
          loan_amount: number | null
          loan_number: string | null
          loan_position: string | null
          ltv: number | null
          maturity_date: string | null
          monthly_payment: number | null
          net_advance: number | null
          notes: string | null
          payment_type: string | null
          personal_guarantee: boolean | null
          property_address: string
          property_type: string | null
          status: string
          term_months: number | null
          total_existing_debt: number | null
          trillium_share_amount: number | null
          trillium_share_percent: number | null
          updated_at: string | null
        }
        Insert: {
          amortization_months?: number | null
          appraisal_value?: number | null
          borrower_id?: string | null
          collateral_description?: string | null
          created_at?: string | null
          date_of_advance?: string | null
          deal_id?: string | null
          estimated_market_value?: number | null
          existing_1st_lender?: string | null
          existing_1st_mortgage?: number | null
          existing_2nd_lender?: string | null
          existing_2nd_mortgage?: number | null
          exit_strategy?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          gross_advance?: number | null
          guarantor_contact?: string | null
          guarantor_name?: string | null
          id?: string
          interest_adjustment?: number | null
          interest_rate?: number | null
          investor_pool_amount?: number | null
          investor_pool_percent?: number | null
          is_syndicated?: boolean | null
          lender_fee?: number | null
          loan_amount?: number | null
          loan_number?: string | null
          loan_position?: string | null
          ltv?: number | null
          maturity_date?: string | null
          monthly_payment?: number | null
          net_advance?: number | null
          notes?: string | null
          payment_type?: string | null
          personal_guarantee?: boolean | null
          property_address?: string
          property_type?: string | null
          status?: string
          term_months?: number | null
          total_existing_debt?: number | null
          trillium_share_amount?: number | null
          trillium_share_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          amortization_months?: number | null
          appraisal_value?: number | null
          borrower_id?: string | null
          collateral_description?: string | null
          created_at?: string | null
          date_of_advance?: string | null
          deal_id?: string | null
          estimated_market_value?: number | null
          existing_1st_lender?: string | null
          existing_1st_mortgage?: number | null
          existing_2nd_lender?: string | null
          existing_2nd_mortgage?: number | null
          exit_strategy?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          gross_advance?: number | null
          guarantor_contact?: string | null
          guarantor_name?: string | null
          id?: string
          interest_adjustment?: number | null
          interest_rate?: number | null
          investor_pool_amount?: number | null
          investor_pool_percent?: number | null
          is_syndicated?: boolean | null
          lender_fee?: number | null
          loan_amount?: number | null
          loan_number?: string | null
          loan_position?: string | null
          ltv?: number | null
          maturity_date?: string | null
          monthly_payment?: number | null
          net_advance?: number | null
          notes?: string | null
          payment_type?: string | null
          personal_guarantee?: boolean | null
          property_address?: string
          property_type?: string | null
          status?: string
          term_months?: number | null
          total_existing_debt?: number | null
          trillium_share_amount?: number | null
          trillium_share_percent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "borrowers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgage_summaries: {
        Row: {
          address: string
          appraisal_value: number | null
          created_at: string | null
          date_of_advance: string | null
          deal_id: string | null
          estimated_market_value: number | null
          existing_1st_mortgage: number | null
          existing_2nd_mortgage: number | null
          existing_lender_1st: string | null
          existing_lender_2nd: string | null
          exit_strategy: string | null
          id: string
          interest_adjustment: number | null
          lender_fee: number | null
          ltv: number | null
          notes: string | null
          payment: number | null
          property_type: string
          requested_2nd_mortgage: number | null
          requested_rate: number | null
          status: string
          term: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string
          appraisal_value?: number | null
          created_at?: string | null
          date_of_advance?: string | null
          deal_id?: string | null
          estimated_market_value?: number | null
          existing_1st_mortgage?: number | null
          existing_2nd_mortgage?: number | null
          existing_lender_1st?: string | null
          existing_lender_2nd?: string | null
          exit_strategy?: string | null
          id?: string
          interest_adjustment?: number | null
          lender_fee?: number | null
          ltv?: number | null
          notes?: string | null
          payment?: number | null
          property_type?: string
          requested_2nd_mortgage?: number | null
          requested_rate?: number | null
          status?: string
          term?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          appraisal_value?: number | null
          created_at?: string | null
          date_of_advance?: string | null
          deal_id?: string | null
          estimated_market_value?: number | null
          existing_1st_mortgage?: number | null
          existing_2nd_mortgage?: number | null
          existing_lender_1st?: string | null
          existing_lender_2nd?: string | null
          exit_strategy?: string | null
          id?: string
          interest_adjustment?: number | null
          lender_fee?: number | null
          ltv?: number | null
          notes?: string | null
          payment?: number | null
          property_type?: string
          requested_2nd_mortgage?: number | null
          requested_rate?: number | null
          status?: string
          term?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mortgage_summaries_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          investor_id: string | null
          is_read: boolean | null
          link_label: string | null
          link_url: string | null
          message: string | null
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investor_id?: string | null
          is_read?: boolean | null
          link_label?: string | null
          link_url?: string | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investor_id?: string | null
          is_read?: boolean | null
          link_label?: string | null
          link_url?: string | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_tokens: {
        Row: {
          access_token: string
          connected_by: string | null
          connected_email: string | null
          created_at: string | null
          expires_at: string
          id: string
          provider: string
          refresh_token: string
          scope: string | null
          token_type: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          connected_by?: string | null
          connected_email?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          provider: string
          refresh_token: string
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          connected_by?: string | null
          connected_email?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          provider?: string
          refresh_token?: string
          scope?: string | null
          token_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_tokens_connected_by_fkey"
            columns: ["connected_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ops_agent_log: {
        Row: {
          action: string
          agent: string
          created_at: string | null
          details: Json | null
          entity: string | null
          id: string
        }
        Insert: {
          action: string
          agent: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          id?: string
        }
        Update: {
          action?: string
          agent?: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          id?: string
        }
        Relationships: []
      }
      ops_dev_assessments: {
        Row: {
          address: string
          city: string | null
          client_name: string | null
          comps: Json | null
          construction_cost_est: number | null
          created_at: string | null
          deal_id: string | null
          entity: string | null
          financing: Json | null
          id: string
          lot_size_sqft: number | null
          market_rents: Json | null
          max_gfa: number | null
          max_units: number | null
          profit_est: number | null
          province: string | null
          recommendation: string | null
          revenue_est: number | null
          risks: string[] | null
          roi_est: number | null
          status: string | null
          total_project_cost_est: number | null
          unit_mix: Json | null
          updated_at: string | null
          zoning_current: string | null
          zoning_proposed: string | null
        }
        Insert: {
          address: string
          city?: string | null
          client_name?: string | null
          comps?: Json | null
          construction_cost_est?: number | null
          created_at?: string | null
          deal_id?: string | null
          entity?: string | null
          financing?: Json | null
          id?: string
          lot_size_sqft?: number | null
          market_rents?: Json | null
          max_gfa?: number | null
          max_units?: number | null
          profit_est?: number | null
          province?: string | null
          recommendation?: string | null
          revenue_est?: number | null
          risks?: string[] | null
          roi_est?: number | null
          status?: string | null
          total_project_cost_est?: number | null
          unit_mix?: Json | null
          updated_at?: string | null
          zoning_current?: string | null
          zoning_proposed?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          client_name?: string | null
          comps?: Json | null
          construction_cost_est?: number | null
          created_at?: string | null
          deal_id?: string | null
          entity?: string | null
          financing?: Json | null
          id?: string
          lot_size_sqft?: number | null
          market_rents?: Json | null
          max_gfa?: number | null
          max_units?: number | null
          profit_est?: number | null
          province?: string | null
          recommendation?: string | null
          revenue_est?: number | null
          risks?: string[] | null
          roi_est?: number | null
          status?: string | null
          total_project_cost_est?: number | null
          unit_mix?: Json | null
          updated_at?: string | null
          zoning_current?: string | null
          zoning_proposed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ops_dev_assessments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      ops_mortgage_leads: {
        Row: {
          amount_requested: number | null
          borrower_email: string | null
          borrower_name: string | null
          borrower_phone: string | null
          created_at: string | null
          deal_id: string | null
          id: string
          loan_id: string | null
          loan_type: string | null
          notes: string | null
          property_address: string | null
          property_type: string | null
          purpose: string | null
          qualification: Json | null
          raw_intake: Json | null
          risk_score: number | null
          risk_tier: string | null
          source: string | null
          source_ref: string | null
          status: string | null
          suggested_rate: number | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          amount_requested?: number | null
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          loan_id?: string | null
          loan_type?: string | null
          notes?: string | null
          property_address?: string | null
          property_type?: string | null
          purpose?: string | null
          qualification?: Json | null
          raw_intake?: Json | null
          risk_score?: number | null
          risk_tier?: string | null
          source?: string | null
          source_ref?: string | null
          status?: string | null
          suggested_rate?: number | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          amount_requested?: number | null
          borrower_email?: string | null
          borrower_name?: string | null
          borrower_phone?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          loan_id?: string | null
          loan_type?: string | null
          notes?: string | null
          property_address?: string | null
          property_type?: string | null
          purpose?: string | null
          qualification?: Json | null
          raw_intake?: Json | null
          risk_score?: number | null
          risk_tier?: string | null
          source?: string | null
          source_ref?: string | null
          status?: string | null
          suggested_rate?: number | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ops_mortgage_leads_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ops_mortgage_leads_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_agreements: {
        Row: {
          buyer_company: string | null
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string | null
          buyer_realtor_brokerage: string | null
          buyer_realtor_email: string | null
          buyer_realtor_name: string | null
          buyer_realtor_phone: string | null
          buyer_solicitor_email: string | null
          buyer_solicitor_firm: string | null
          buyer_solicitor_name: string | null
          buyer_solicitor_phone: string | null
          closing_date: string
          conditions: Json | null
          created_at: string | null
          deal_id: string | null
          deposit_amount: number | null
          deposit_due_date: string | null
          deposit_paid: boolean | null
          id: string
          notes: string | null
          property_address: string
          purchase_price: number
          seller_company: string | null
          seller_email: string | null
          seller_name: string
          seller_phone: string | null
          seller_realtor_brokerage: string | null
          seller_realtor_email: string | null
          seller_realtor_name: string | null
          seller_realtor_phone: string | null
          seller_solicitor_email: string | null
          seller_solicitor_firm: string | null
          seller_solicitor_name: string | null
          seller_solicitor_phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_company?: string | null
          buyer_email?: string | null
          buyer_name: string
          buyer_phone?: string | null
          buyer_realtor_brokerage?: string | null
          buyer_realtor_email?: string | null
          buyer_realtor_name?: string | null
          buyer_realtor_phone?: string | null
          buyer_solicitor_email?: string | null
          buyer_solicitor_firm?: string | null
          buyer_solicitor_name?: string | null
          buyer_solicitor_phone?: string | null
          closing_date: string
          conditions?: Json | null
          created_at?: string | null
          deal_id?: string | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean | null
          id?: string
          notes?: string | null
          property_address: string
          purchase_price: number
          seller_company?: string | null
          seller_email?: string | null
          seller_name: string
          seller_phone?: string | null
          seller_realtor_brokerage?: string | null
          seller_realtor_email?: string | null
          seller_realtor_name?: string | null
          seller_realtor_phone?: string | null
          seller_solicitor_email?: string | null
          seller_solicitor_firm?: string | null
          seller_solicitor_name?: string | null
          seller_solicitor_phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_company?: string | null
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          buyer_realtor_brokerage?: string | null
          buyer_realtor_email?: string | null
          buyer_realtor_name?: string | null
          buyer_realtor_phone?: string | null
          buyer_solicitor_email?: string | null
          buyer_solicitor_firm?: string | null
          buyer_solicitor_name?: string | null
          buyer_solicitor_phone?: string | null
          closing_date?: string
          conditions?: Json | null
          created_at?: string | null
          deal_id?: string | null
          deposit_amount?: number | null
          deposit_due_date?: string | null
          deposit_paid?: boolean | null
          id?: string
          notes?: string | null
          property_address?: string
          purchase_price?: number
          seller_company?: string | null
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string | null
          seller_realtor_brokerage?: string | null
          seller_realtor_email?: string | null
          seller_realtor_name?: string | null
          seller_realtor_phone?: string | null
          seller_solicitor_email?: string | null
          seller_solicitor_firm?: string | null
          seller_solicitor_name?: string | null
          seller_solicitor_phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_agreements_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_documents: {
        Row: {
          available_date: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          document_type: string
          downloaded_at: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          investor_id: string
          status: string
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          available_date?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          document_type?: string
          downloaded_at?: string | null
          file_name: string
          file_size?: number
          file_url: string
          id?: string
          investor_id: string
          status?: string
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          available_date?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          document_type?: string
          downloaded_at?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          investor_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_documents_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          attachments: string[] | null
          author_name: string | null
          content: string
          created_at: string | null
          deal_id: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          title: string
          update_type: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          author_name?: string | null
          content: string
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title: string
          update_type?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          author_name?: string | null
          content?: string
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          update_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "updates_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      video_recipients: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          investor_id: string | null
          sent_at: string | null
          video_id: string | null
          watched_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          investor_id?: string | null
          sent_at?: string | null
          video_id?: string | null
          watched_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          investor_id?: string | null
          sent_at?: string | null
          video_id?: string | null
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_recipients_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_recipients_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          investor_id: string | null
          last_watched_at: string | null
          video_id: string | null
          watched_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          investor_id?: string | null
          last_watched_at?: string | null
          video_id?: string | null
          watched_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          investor_id?: string | null
          last_watched_at?: string | null
          video_id?: string | null
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          deal_id: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          is_locked: boolean | null
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          uploader_name: string | null
          video_url: string
          views_count: number | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_locked?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          uploader_name?: string | null
          video_url: string
          views_count?: number | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          deal_id?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_locked?: boolean | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          uploader_name?: string | null
          video_url?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_recordings: {
        Row: {
          action_items: Json | null
          admin_user_id: string
          audio_url: string | null
          confidence: number | null
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          extracted_data: Json | null
          file_size_bytes: number | null
          id: string
          status: string
          summary: string | null
          tags: string[] | null
          title: string | null
          transaction_type: string | null
          transcript: string | null
          transcript_edited: string | null
          updated_at: string
        }
        Insert: {
          action_items?: Json | null
          admin_user_id: string
          audio_url?: string | null
          confidence?: number | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          extracted_data?: Json | null
          file_size_bytes?: number | null
          id?: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          transaction_type?: string | null
          transcript?: string | null
          transcript_edited?: string | null
          updated_at?: string
        }
        Update: {
          action_items?: Json | null
          admin_user_id?: string
          audio_url?: string | null
          confidence?: number | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          extracted_data?: Json | null
          file_size_bytes?: number | null
          id?: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          transaction_type?: string | null
          transcript?: string | null
          transcript_edited?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_recordings_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_admins: { Args: { user_uuid: string }; Returns: boolean }
      get_admin_role: { Args: { user_uuid: string }; Returns: string }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
      is_assigned_to_deal: {
        Args: { deal_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
      link_user_to_profile: { Args: never; Returns: Json }
      log_admin_action: {
        Args: {
          p_action: string
          p_action_type: string
          p_details?: Json
          p_resource_id?: string
          p_resource_name?: string
          p_resource_type?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
