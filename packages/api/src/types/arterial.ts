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
      art_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          linkedin_url: string | null
          name: string
          notes: string | null
          phone: string | null
          prospect_id: string | null
          role_type: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          linkedin_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          prospect_id?: string | null
          role_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          linkedin_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          prospect_id?: string | null
          role_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "art_contacts_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "art_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      art_customer_health: {
        Row: {
          adoption_score: number | null
          champion_score: number | null
          created_at: string | null
          deal_id: string | null
          expansion_potential: boolean | null
          health_score: number | null
          id: string
          last_check: string | null
          last_login_at: string | null
          notes: string | null
          onboarding_status: string | null
          payment_score: number | null
          prospect_id: string | null
          risk_level: string | null
          scored_at: string | null
          seats_active: number | null
          seats_licensed: number | null
          support_score: number | null
          updated_at: string | null
          usage_score: number | null
        }
        Insert: {
          adoption_score?: number | null
          champion_score?: number | null
          created_at?: string | null
          deal_id?: string | null
          expansion_potential?: boolean | null
          health_score?: number | null
          id?: string
          last_check?: string | null
          last_login_at?: string | null
          notes?: string | null
          onboarding_status?: string | null
          payment_score?: number | null
          prospect_id?: string | null
          risk_level?: string | null
          scored_at?: string | null
          seats_active?: number | null
          seats_licensed?: number | null
          support_score?: number | null
          updated_at?: string | null
          usage_score?: number | null
        }
        Update: {
          adoption_score?: number | null
          champion_score?: number | null
          created_at?: string | null
          deal_id?: string | null
          expansion_potential?: boolean | null
          health_score?: number | null
          id?: string
          last_check?: string | null
          last_login_at?: string | null
          notes?: string | null
          onboarding_status?: string | null
          payment_score?: number | null
          prospect_id?: string | null
          risk_level?: string | null
          scored_at?: string | null
          seats_active?: number | null
          seats_licensed?: number | null
          support_score?: number | null
          updated_at?: string | null
          usage_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "art_customer_health_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "art_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_customer_health_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "art_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      art_deals: {
        Row: {
          annual_value: number | null
          close_date_est: string | null
          closed_at: string | null
          competitor: string | null
          contact_id: string | null
          created_at: string | null
          deal_type: string | null
          id: string
          last_activity_at: string | null
          loss_reason: string | null
          next_step: string | null
          next_step_date: string | null
          notes: string | null
          owner: string | null
          price_per_seat: number | null
          probability: number | null
          prospect_id: string | null
          seats: number | null
          stage: string
          title: string
          total_value: number | null
          updated_at: string | null
          weighted_value: number | null
        }
        Insert: {
          annual_value?: number | null
          close_date_est?: string | null
          closed_at?: string | null
          competitor?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_type?: string | null
          id?: string
          last_activity_at?: string | null
          loss_reason?: string | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          owner?: string | null
          price_per_seat?: number | null
          probability?: number | null
          prospect_id?: string | null
          seats?: number | null
          stage?: string
          title: string
          total_value?: number | null
          updated_at?: string | null
          weighted_value?: number | null
        }
        Update: {
          annual_value?: number | null
          close_date_est?: string | null
          closed_at?: string | null
          competitor?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_type?: string | null
          id?: string
          last_activity_at?: string | null
          loss_reason?: string | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          owner?: string | null
          price_per_seat?: number | null
          probability?: number | null
          prospect_id?: string | null
          seats?: number | null
          stage?: string
          title?: string
          total_value?: number | null
          updated_at?: string | null
          weighted_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "art_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "art_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_deals_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "art_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      art_meetings: {
        Row: {
          brief: Json | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          duration_minutes: number | null
          id: string
          intel_brief: Json | null
          location: string | null
          meeting_type: string | null
          next_steps: string | null
          notes: string | null
          outcome: string | null
          recording_url: string | null
          scheduled_at: string | null
          updated_at: string | null
        }
        Insert: {
          brief?: Json | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          duration_minutes?: number | null
          id?: string
          intel_brief?: Json | null
          location?: string | null
          meeting_type?: string | null
          next_steps?: string | null
          notes?: string | null
          outcome?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          updated_at?: string | null
        }
        Update: {
          brief?: Json | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          duration_minutes?: number | null
          id?: string
          intel_brief?: Json | null
          location?: string | null
          meeting_type?: string | null
          next_steps?: string | null
          notes?: string | null
          outcome?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "art_meetings_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "art_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_meetings_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "art_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      art_policies: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      art_prospects: {
        Row: {
          accessibility_score: number | null
          active_projects: number | null
          annual_revenue_est: number | null
          city: string | null
          company_name: string
          country: string | null
          created_at: string | null
          decision_makers: Json | null
          employee_count: number | null
          enriched_at: string | null
          fit_score: number | null
          icp_match: Json | null
          id: string
          industry: string | null
          notes: string | null
          overall_score: number | null
          property_types: string[] | null
          province: string | null
          source: string | null
          status: string | null
          tech_adoption: string | null
          tech_stack: string[] | null
          timing_score: number | null
          trigger_events: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accessibility_score?: number | null
          active_projects?: number | null
          annual_revenue_est?: number | null
          city?: string | null
          company_name: string
          country?: string | null
          created_at?: string | null
          decision_makers?: Json | null
          employee_count?: number | null
          enriched_at?: string | null
          fit_score?: number | null
          icp_match?: Json | null
          id?: string
          industry?: string | null
          notes?: string | null
          overall_score?: number | null
          property_types?: string[] | null
          province?: string | null
          source?: string | null
          status?: string | null
          tech_adoption?: string | null
          tech_stack?: string[] | null
          timing_score?: number | null
          trigger_events?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accessibility_score?: number | null
          active_projects?: number | null
          annual_revenue_est?: number | null
          city?: string | null
          company_name?: string
          country?: string | null
          created_at?: string | null
          decision_makers?: Json | null
          employee_count?: number | null
          enriched_at?: string | null
          fit_score?: number | null
          icp_match?: Json | null
          id?: string
          industry?: string | null
          notes?: string | null
          overall_score?: number | null
          property_types?: string[] | null
          province?: string | null
          source?: string | null
          status?: string | null
          tech_adoption?: string | null
          tech_stack?: string[] | null
          timing_score?: number | null
          trigger_events?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      art_sales_proposals: {
        Row: {
          annual_price: number | null
          created_at: string | null
          deal_id: string | null
          id: string
          monthly_price: number | null
          objection_prep: Json | null
          price_per_seat: number | null
          pricing_tier: string | null
          prospect_id: string | null
          roi_projection: Json | null
          seats: number | null
          sent_at: string | null
          status: string | null
          structure: string | null
          template_used: string | null
          total_value: number | null
          version: number | null
        }
        Insert: {
          annual_price?: number | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          monthly_price?: number | null
          objection_prep?: Json | null
          price_per_seat?: number | null
          pricing_tier?: string | null
          prospect_id?: string | null
          roi_projection?: Json | null
          seats?: number | null
          sent_at?: string | null
          status?: string | null
          structure?: string | null
          template_used?: string | null
          total_value?: number | null
          version?: number | null
        }
        Update: {
          annual_price?: number | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          monthly_price?: number | null
          objection_prep?: Json | null
          price_per_seat?: number | null
          pricing_tier?: string | null
          prospect_id?: string | null
          roi_projection?: Json | null
          seats?: number | null
          sent_at?: string | null
          status?: string | null
          structure?: string | null
          template_used?: string | null
          total_value?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "art_sales_proposals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "art_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_sales_proposals_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "art_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      art_sequence_enrollments: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          current_step: number | null
          deal_id: string | null
          engagement: Json | null
          enrolled_at: string | null
          id: string
          next_touch_at: string | null
          next_touch_date: string | null
          prospect_id: string | null
          sequence_id: string | null
          status: string | null
          touches: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          current_step?: number | null
          deal_id?: string | null
          engagement?: Json | null
          enrolled_at?: string | null
          id?: string
          next_touch_at?: string | null
          next_touch_date?: string | null
          prospect_id?: string | null
          sequence_id?: string | null
          status?: string | null
          touches?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          current_step?: number | null
          deal_id?: string | null
          engagement?: Json | null
          enrolled_at?: string | null
          id?: string
          next_touch_at?: string | null
          next_touch_date?: string | null
          prospect_id?: string | null
          sequence_id?: string | null
          status?: string | null
          touches?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "art_sequence_enrollments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "art_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_sequence_enrollments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "art_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_sequence_enrollments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "art_prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "art_sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "art_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      art_sequences: {
        Row: {
          created_at: string | null
          duration_days: number | null
          id: string
          is_active: boolean | null
          name: string
          sequence_type: string | null
          status: string | null
          steps: Json
          target_persona: string | null
          total_steps: number | null
          trigger_type: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          sequence_type?: string | null
          status?: string | null
          steps?: Json
          target_persona?: string | null
          total_steps?: number | null
          trigger_type?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          sequence_type?: string | null
          status?: string | null
          steps?: Json
          target_persona?: string | null
          total_steps?: number | null
          trigger_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
