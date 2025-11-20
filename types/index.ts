// Database Types
export interface Profile {
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

export interface Court {
  id: string
  user_id: string
  name: string
  hourly_rate: number | null
  is_active: boolean
  color: string | null
  display_order: number | null
  created_at: string
}

export type ServiceType = 'single' | 'package' | 'camp'

export interface Service {
  id: string
  user_id: string
  name: string
  description: string | null
  type: ServiceType
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

export interface Client {
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

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'

export interface Booking {
  id: string
  user_id: string
  service_id: string | null
  court_id: string | null
  client_id: string | null
  start_time: string
  end_time: string
  participants_count: number | null
  price_total: number | null
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
  // Relations
  service?: Service
  court?: Court
  client?: Client
}

export interface WorkingHours {
  id: string
  user_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface BlockedSlot {
  id: string
  user_id: string
  court_id: string | null
  start_time: string
  end_time: string
  reason: string | null
  created_at: string
}

// Form Types
export interface ServiceFormData {
  name: string
  description?: string
  type: ServiceType
  duration_hours?: number
  min_participants?: number
  max_participants?: number
  price_per_person?: number
  target_profit_per_hour?: number
  sessions_count?: number
  color?: string
}

export interface ClientFormData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  notes?: string
  tags?: string[]
}

export interface BookingFormData {
  service_id?: string
  court_id?: string
  client_id?: string
  start_time: Date
  end_time: Date
  participants_count?: number
  price_total?: number
  status: BookingStatus
  notes?: string
}

