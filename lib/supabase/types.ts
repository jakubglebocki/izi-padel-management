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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          business_name: string | null
          avatar_url: string | null
          default_vat: number
          default_pit_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          business_name?: string | null
          avatar_url?: string | null
          default_vat?: number
          default_pit_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          business_name?: string | null
          avatar_url?: string | null
          default_vat?: number
          default_pit_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          user_id: string
          name: string
          hourly_rate: number | null
          is_active: boolean
          color: string | null
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          hourly_rate?: number | null
          is_active?: boolean
          color?: string | null
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          hourly_rate?: number | null
          is_active?: boolean
          color?: string | null
          display_order?: number | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          type: string
          duration_hours: number | null
          min_participants: number | null
          max_participants: number | null
          price_per_person: number | null
          target_profit_per_hour: number | null
          sessions_count: number | null
          is_active: boolean
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          type: string
          duration_hours?: number | null
          min_participants?: number | null
          max_participants?: number | null
          price_per_person?: number | null
          target_profit_per_hour?: number | null
          sessions_count?: number | null
          is_active?: boolean
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          type?: string
          duration_hours?: number | null
          min_participants?: number | null
          max_participants?: number | null
          price_per_person?: number | null
          target_profit_per_hour?: number | null
          sessions_count?: number | null
          is_active?: boolean
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string | null
          court_id: string | null
          client_id: string | null
          start_time: string
          end_time: string
          participants_count: number | null
          price_total: number | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id?: string | null
          court_id?: string | null
          client_id?: string | null
          start_time: string
          end_time: string
          participants_count?: number | null
          price_total?: number | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string | null
          court_id?: string | null
          client_id?: string | null
          start_time?: string
          end_time?: string
          participants_count?: number | null
          price_total?: number | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      working_hours: {
        Row: {
          id: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
        }
      }
      blocked_slots: {
        Row: {
          id: string
          user_id: string
          court_id: string | null
          start_time: string
          end_time: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id?: string | null
          start_time: string
          end_time: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string | null
          start_time?: string
          end_time?: string
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}

