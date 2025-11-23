-- ============================================
-- MIGRATION: Dodanie systemu przedziałów cenowych
-- ============================================
-- Data: 2024-11-20
-- Opis: Dodaje tabelę court_pricing dla zarządzania cennikami
--       z różnymi przedziałami godzinowymi i dniami tygodnia

-- ============================================
-- 1. Tworzenie tabeli court_pricing
-- ============================================
CREATE TABLE IF NOT EXISTS court_pricing (
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
-- 2. Dodanie indeksów
-- ============================================
CREATE INDEX IF NOT EXISTS idx_court_pricing_court_id ON court_pricing(court_id);

-- ============================================
-- 3. Włączenie Row Level Security
-- ============================================
ALTER TABLE court_pricing ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Tworzenie polityk RLS
-- ============================================

-- Usuwamy istniejące polityki jeśli istnieją
DROP POLICY IF EXISTS "Users can view own court pricing" ON court_pricing;
DROP POLICY IF EXISTS "Users can insert own court pricing" ON court_pricing;
DROP POLICY IF EXISTS "Users can update own court pricing" ON court_pricing;
DROP POLICY IF EXISTS "Users can delete own court pricing" ON court_pricing;

-- Tworzenie nowych polityk
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

-- ============================================
-- 5. Trigger dla updated_at
-- ============================================

-- Dodajemy trigger dla aktualizacji updated_at
DROP TRIGGER IF EXISTS update_court_pricing_updated_at ON court_pricing;

CREATE TRIGGER update_court_pricing_updated_at
    BEFORE UPDATE ON court_pricing
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Przykładowe dane (opcjonalnie)
-- ============================================

-- Możesz odkomentować poniższy kod aby dodać przykładowe przedziały cenowe
-- Zastąp 'YOUR_COURT_ID' rzeczywistym ID kortu

/*
-- Przykładowy cennik dla kortu
INSERT INTO court_pricing (court_id, name, day_type, start_time, end_time, price_per_hour) VALUES
    ('YOUR_COURT_ID', 'Rano (6:00-14:00)', 'weekday', '06:00', '14:00', 180.00),
    ('YOUR_COURT_ID', 'Popołudnie/Wieczór (14:00-23:00)', 'weekday', '14:00', '23:00', 240.00),
    ('YOUR_COURT_ID', 'Weekendy', 'weekend', '06:00', '23:00', 180.00);
*/

-- ============================================
-- INSTRUKCJE
-- ============================================
-- 1. Zaloguj się do Supabase Dashboard
-- 2. Przejdź do SQL Editor
-- 3. Wklej i uruchom cały ten skrypt
-- 4. Sprawdź czy wszystko przebiegło pomyślnie
-- 5. Odśwież aplikację i przejdź do Ustawienia → Kluby/Korty
-- 6. Dodaj przedziały cenowe do swoich kortów

-- ============================================
-- WERYFIKACJA
-- ============================================
-- Sprawdź czy tabela została utworzona:
-- SELECT * FROM court_pricing;

-- Sprawdź polityki RLS:
-- SELECT * FROM pg_policies WHERE tablename = 'court_pricing';



