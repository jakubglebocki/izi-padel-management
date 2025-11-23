-- ============================================
-- MIGRATION: Groups, Packages & Attendance System
-- Date: 2024-11-21
-- ============================================

-- 1. Create groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    max_participants INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create packages table (szablon pakietu)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sessions_count INTEGER NOT NULL CHECK (sessions_count > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    validity_days INTEGER, -- ile dni pakiet jest ważny od zakupu (NULL = bez limitu)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create client_packages table (zakupione pakiety)
CREATE TABLE IF NOT EXISTS client_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    package_id UUID REFERENCES packages(id) ON DELETE RESTRICT NOT NULL,
    sessions_remaining INTEGER NOT NULL CHECK (sessions_remaining >= 0),
    sessions_total INTEGER NOT NULL CHECK (sessions_total > 0),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid >= 0),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create group_sessions table (zaplanowane treningi grupowe)
CREATE TABLE IF NOT EXISTS group_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    recurring_pattern TEXT, -- 'weekly', 'biweekly', 'monthly', NULL dla jednorazowych
    recurring_day_of_week INTEGER, -- 0-6 (0 = Niedziela)
    notes TEXT,
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create attendance table (obecność na treningach)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES group_sessions(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    client_package_id UUID REFERENCES client_packages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'excused', 'late')),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, client_id) -- Jeden klient może być zapisany tylko raz na trening
);

-- 6. Add skill_level and group_id to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS skill_level TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE SET NULL;

-- 7. Add check constraint for skill_level
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_skill_level_check;
ALTER TABLE clients ADD CONSTRAINT clients_skill_level_check 
    CHECK (skill_level IS NULL OR skill_level IN ('beginner', 'intermediate', 'advanced', 'professional'));

-- 8. Add comments
COMMENT ON TABLE groups IS 'Training groups for organizing clients';
COMMENT ON TABLE packages IS 'Package templates (e.g., 4 sessions for 200 PLN)';
COMMENT ON TABLE client_packages IS 'Purchased packages with remaining session balance';
COMMENT ON TABLE group_sessions IS 'Scheduled group training sessions';
COMMENT ON TABLE attendance IS 'Attendance tracking for group sessions';

COMMENT ON COLUMN clients.skill_level IS 'Client skill level: beginner, intermediate, advanced, professional';
COMMENT ON COLUMN clients.group_id IS 'Training group assignment';
COMMENT ON COLUMN client_packages.sessions_remaining IS 'Number of sessions left in the package';
COMMENT ON COLUMN client_packages.expiry_date IS 'Date when the package expires';
COMMENT ON COLUMN group_sessions.recurring_pattern IS 'Pattern for recurring sessions: weekly, biweekly, monthly';

-- 9. Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON groups(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON packages(user_id);
CREATE INDEX IF NOT EXISTS idx_client_packages_client_id ON client_packages(client_id);
CREATE INDEX IF NOT EXISTS idx_client_packages_package_id ON client_packages(package_id);
CREATE INDEX IF NOT EXISTS idx_client_packages_status ON client_packages(status);
CREATE INDEX IF NOT EXISTS idx_group_sessions_user_id ON group_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_group_id ON group_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_group_sessions_date ON group_sessions(date);
CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_client_id ON attendance(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_group_id ON clients(group_id);
CREATE INDEX IF NOT EXISTS idx_clients_skill_level ON clients(skill_level);

-- 10. Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies for groups
CREATE POLICY "Users can view own groups"
    ON groups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own groups"
    ON groups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own groups"
    ON groups FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own groups"
    ON groups FOR DELETE
    USING (auth.uid() = user_id);

-- 12. RLS Policies for packages
CREATE POLICY "Users can view own packages"
    ON packages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own packages"
    ON packages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own packages"
    ON packages FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own packages"
    ON packages FOR DELETE
    USING (auth.uid() = user_id);

-- 13. RLS Policies for client_packages
CREATE POLICY "Users can view client packages"
    ON client_packages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_packages.client_id
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert client packages"
    ON client_packages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_packages.client_id
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update client packages"
    ON client_packages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_packages.client_id
            AND clients.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete client packages"
    ON client_packages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM clients
            WHERE clients.id = client_packages.client_id
            AND clients.user_id = auth.uid()
        )
    );

-- 14. RLS Policies for group_sessions
CREATE POLICY "Users can view own group sessions"
    ON group_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own group sessions"
    ON group_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own group sessions"
    ON group_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own group sessions"
    ON group_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- 15. RLS Policies for attendance
CREATE POLICY "Users can view attendance for own sessions"
    ON attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM group_sessions
            WHERE group_sessions.id = attendance.session_id
            AND group_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert attendance for own sessions"
    ON attendance FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM group_sessions
            WHERE group_sessions.id = attendance.session_id
            AND group_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update attendance for own sessions"
    ON attendance FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM group_sessions
            WHERE group_sessions.id = attendance.session_id
            AND group_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete attendance for own sessions"
    ON attendance FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM group_sessions
            WHERE group_sessions.id = attendance.session_id
            AND group_sessions.user_id = auth.uid()
        )
    );

-- 16. Create function to automatically deduct session from package when marking attendance
CREATE OR REPLACE FUNCTION deduct_session_from_package()
RETURNS TRIGGER AS $$
BEGIN
    -- Only deduct if status is 'present' and there's a package assigned
    IF NEW.status = 'present' AND NEW.client_package_id IS NOT NULL THEN
        -- Decrease sessions_remaining
        UPDATE client_packages
        SET 
            sessions_remaining = sessions_remaining - 1,
            status = CASE 
                WHEN sessions_remaining - 1 = 0 THEN 'completed'
                ELSE status
            END,
            updated_at = NOW()
        WHERE id = NEW.client_package_id
        AND sessions_remaining > 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 17. Create trigger for automatic session deduction
DROP TRIGGER IF EXISTS trigger_deduct_session ON attendance;
CREATE TRIGGER trigger_deduct_session
    AFTER INSERT ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION deduct_session_from_package();

-- 18. Create function to restore session when removing attendance
CREATE OR REPLACE FUNCTION restore_session_to_package()
RETURNS TRIGGER AS $$
BEGIN
    -- Only restore if old status was 'present' and there was a package assigned
    IF OLD.status = 'present' AND OLD.client_package_id IS NOT NULL THEN
        -- Increase sessions_remaining
        UPDATE client_packages
        SET 
            sessions_remaining = sessions_remaining + 1,
            status = CASE 
                WHEN status = 'completed' AND sessions_remaining + 1 > 0 THEN 'active'
                ELSE status
            END,
            updated_at = NOW()
        WHERE id = OLD.client_package_id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 19. Create trigger for restoring sessions when deleting attendance
DROP TRIGGER IF EXISTS trigger_restore_session ON attendance;
CREATE TRIGGER trigger_restore_session
    BEFORE DELETE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION restore_session_to_package();


