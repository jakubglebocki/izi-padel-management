-- ============================================
-- MIGRATION: Add skill level and groups for clients
-- Date: 2024-11-21
-- ============================================

-- 1. Create groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add skill_level and group_id columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS skill_level TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE SET NULL;

-- 3. Add check constraint for skill_level
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_skill_level_check;
ALTER TABLE clients ADD CONSTRAINT clients_skill_level_check 
    CHECK (skill_level IS NULL OR skill_level IN ('beginner', 'intermediate', 'advanced', 'professional'));

-- 4. Add comments
COMMENT ON TABLE groups IS 'Training groups for organizing clients';
COMMENT ON COLUMN clients.skill_level IS 'Client skill level: beginner, intermediate, advanced, professional';
COMMENT ON COLUMN clients.group_id IS 'Training group assignment';

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON groups(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_group_id ON clients(group_id);
CREATE INDEX IF NOT EXISTS idx_clients_skill_level ON clients(skill_level);

-- 6. Enable RLS on groups table
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for groups
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

