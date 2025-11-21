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

export type CourtType = 'single' | 'double'

export interface Court {
  id: string
  user_id: string
  club_name: string | null
  name: string
  court_type: CourtType
  hourly_rate: number | null
  is_active: boolean
  color: string | null
  avatar_url: string | null
  display_order: number | null
  created_at: string
  pricing?: CourtPricing[]
}

export interface CourtFormData {
  club_name?: string
  name: string
  court_type?: CourtType
  hourly_rate?: number
  is_active?: boolean
  color?: string
  avatar_url?: string
  display_order?: number
}

export type DayType = 'weekday' | 'weekend' | 'all'

export interface CourtPricing {
  id: string
  court_id: string
  name: string
  day_type: DayType
  start_time: string
  end_time: string
  price_per_hour: number
  is_active: boolean
  display_order: number | null
  created_at: string
  updated_at: string
}

export interface CourtPricingFormData {
  name: string
  day_type: DayType
  start_time: string
  end_time: string
  price_per_hour: number
  is_active?: boolean
  display_order?: number
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

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional'
export type PackageStatus = 'active' | 'expired' | 'completed'
export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late'
export type RecurringPattern = 'weekly' | 'biweekly' | 'monthly' | null

export interface Group {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string | null
  max_participants: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Package {
  id: string
  user_id: string
  name: string
  description: string | null
  sessions_count: number
  price: number
  validity_days: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClientPackage {
  id: string
  client_id: string
  package_id: string
  sessions_remaining: number
  sessions_total: number
  purchase_date: string
  expiry_date: string | null
  amount_paid: number
  status: PackageStatus
  created_at: string
  updated_at: string
  // Relations
  package?: Package
  client?: Client
}

export interface GroupSession {
  id: string
  user_id: string
  group_id: string
  court_id: string | null
  date: string
  start_time: string
  end_time: string
  recurring_pattern: RecurringPattern
  recurring_day_of_week: number | null
  notes: string | null
  is_cancelled: boolean
  created_at: string
  updated_at: string
  // Relations
  group?: Group
  court?: Court
  attendance?: Attendance[]
}

export interface Attendance {
  id: string
  session_id: string
  client_id: string
  client_package_id: string | null
  status: AttendanceStatus
  checked_in_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Relations
  client?: Client
  session?: GroupSession
  client_package?: ClientPackage
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
  skill_level: SkillLevel | null
  group_id: string | null
  created_at: string
  updated_at: string
  // Relations
  group?: Group
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
  skill_level?: SkillLevel | null
  group_id?: string | null
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

