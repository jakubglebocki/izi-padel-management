-- ============================================
-- MIGRATION: Add avatar_url to courts table
-- Date: 2024-11-21
-- ============================================

-- 1. Add avatar_url column to courts table
ALTER TABLE courts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Add comment
COMMENT ON COLUMN courts.avatar_url IS 'URL to club/court avatar image stored in Supabase Storage';

-- 3. Create storage bucket for court avatars (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('court-avatars', 'court-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies for court avatars
CREATE POLICY "Court avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'court-avatars');

CREATE POLICY "Authenticated users can upload court avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'court-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own court avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'court-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own court avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'court-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

