-- ============================================
-- MIGRATION: Dodanie club_name i court_type
-- ============================================
-- Data: 2024-11-20
-- Opis: Dodaje pola club_name (nazwa klubu) i court_type (rodzaj kortu)

-- Dodaj kolumnę club_name
ALTER TABLE courts ADD COLUMN IF NOT EXISTS club_name TEXT;

-- Dodaj kolumnę court_type
ALTER TABLE courts ADD COLUMN IF NOT EXISTS court_type TEXT DEFAULT 'double' CHECK (court_type IN ('single', 'double'));

-- Aktualizuj istniejące rekordy (opcjonalnie)
-- UPDATE courts SET court_type = 'double' WHERE court_type IS NULL;

-- Gotowe!



