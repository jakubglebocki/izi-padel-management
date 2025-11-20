-- IZI Padel Management - Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    business_name TEXT,
    avatar_url TEXT,
    default_vat DECIMAL(5,4) DEFAULT 0.23,
    default_pit_rate DECIMAL(5,4) DEFAULT 0.239,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURTS TABLE
-- ============================================
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    club_name TEXT,
    name TEXT NOT NULL,
    court_type TEXT DEFAULT 'double' CHECK (court_type IN ('single', 'double')),
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    color TEXT DEFAULT '#3b82f6',
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURT PRICING TABLE (Time-based pricing)
-- ============================================
CREATE TABLE court_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID REFERENCES courts(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    day_type TEXT NOT NULL CHECK (day_type IN ('weekday', 'weekend', 'all')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('single', 'package', 'camp')),
    duration_hours DECIMAL(5,2),
    min_participants INTEGER,
    max_participants INTEGER,
    price_per_person DECIMAL(10,2),
    target_profit_per_hour DECIMAL(10,2),
    sessions_count INTEGER,
    is_active BOOLEAN DEFAULT true,
    color TEXT DEFAULT '#10B981',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    participants_count INTEGER,
    price_total DECIMAL(10,2),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- WORKING HOURS TABLE
-- ============================================
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- ============================================
-- BLOCKED SLOTS TABLE
-- ============================================
CREATE TABLE blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_courts_user_id ON courts(user_id);
CREATE INDEX idx_court_pricing_court_id ON court_pricing(court_id);
CREATE INDEX idx_working_hours_user_id ON working_hours(user_id);
CREATE INDEX idx_blocked_slots_user_id ON blocked_slots(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Courts policies
CREATE POLICY "Users can view own courts"
    ON courts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own courts"
    ON courts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own courts"
    ON courts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own courts"
    ON courts FOR DELETE
    USING (auth.uid() = user_id);

-- Court pricing policies
CREATE POLICY "Users can view own court pricing"
    ON court_pricing FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM courts
            WHERE courts.id = court_pricing.court_id
            AND courts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own court pricing"
    ON court_pricing FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM courts
            WHERE courts.id = court_pricing.court_id
            AND courts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own court pricing"
    ON court_pricing FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM courts
            WHERE courts.id = court_pricing.court_id
            AND courts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own court pricing"
    ON court_pricing FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM courts
            WHERE courts.id = court_pricing.court_id
            AND courts.user_id = auth.uid()
        )
    );

-- Services policies
CREATE POLICY "Users can view own services"
    ON services FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own services"
    ON services FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services"
    ON services FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services"
    ON services FOR DELETE
    USING (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "Users can view own clients"
    ON clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
    ON clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
    ON clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
    ON clients FOR DELETE
    USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
    ON bookings FOR DELETE
    USING (auth.uid() = user_id);

-- Working hours policies
CREATE POLICY "Users can view own working hours"
    ON working_hours FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own working hours"
    ON working_hours FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own working hours"
    ON working_hours FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own working hours"
    ON working_hours FOR DELETE
    USING (auth.uid() = user_id);

-- Blocked slots policies
CREATE POLICY "Users can view own blocked slots"
    ON blocked_slots FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blocked slots"
    ON blocked_slots FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blocked slots"
    ON blocked_slots FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blocked slots"
    ON blocked_slots FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to insert sample data after creating a user

-- INSERT INTO courts (user_id, name, hourly_rate, color, display_order) VALUES
-- ('YOUR_USER_ID', 'Kort 1', 100.00, '#3b82f6', 1),
-- ('YOUR_USER_ID', 'Kort 2', 100.00, '#10b981', 2);

-- INSERT INTO services (user_id, name, type, duration_hours, min_participants, max_participants, price_per_person, color) VALUES
-- ('YOUR_USER_ID', 'Trening indywidualny', 'single', 1.5, 1, 1, 150.00, '#f59e0b'),
-- ('YOUR_USER_ID', 'Trening grupowy', 'single', 2.0, 2, 4, 80.00, '#10b981'),
-- ('YOUR_USER_ID', 'Pakiet 10 treningów', 'package', 1.5, 1, 1, 1200.00, '#8b5cf6');

COMMENT ON TABLE profiles IS 'User profiles with business settings';
COMMENT ON TABLE courts IS 'Padel courts managed by users';
COMMENT ON TABLE services IS 'Service templates (trainings, packages, camps)';
COMMENT ON TABLE clients IS 'Client database';
COMMENT ON TABLE bookings IS 'Booking/reservation records';
COMMENT ON TABLE working_hours IS 'Operating hours configuration';
COMMENT ON TABLE blocked_slots IS 'Blocked time slots (holidays, maintenance)';

