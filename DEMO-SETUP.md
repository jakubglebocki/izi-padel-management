# 🎾 Konfiguracja Konta Demo

## Dane logowania Demo

**Email:** `demo@izipadel.pl`  
**Hasło:** `DemoTrener2024!`

## Krok 1: Utwórz użytkownika Demo w Supabase

### Opcja A: Przez Supabase Dashboard (zalecane)

1. Zaloguj się do [Supabase Dashboard](https://app.supabase.com)
2. Wybierz swój projekt IZI Padel Management
3. Przejdź do **Authentication** → **Users**
4. Kliknij **"Add user"** → **"Create new user"**
5. Wprowadź dane:
   - **Email:** `demo@izipadel.pl`
   - **Password:** `DemoTrener2024!`
   - **Auto Confirm User:** ✅ (zaznacz, żeby od razu aktywować konto)
6. Kliknij **"Create user"**

### Opcja B: Przez Rejestrację w Aplikacji

1. Uruchom aplikację (`npm run dev`)
2. Przejdź na stronę rejestracji: `http://localhost:3000/register`
3. Zarejestruj konto z danymi:
   - Email: `demo@izipadel.pl`
   - Hasło: `DemoTrener2024!`
4. Jeśli wymagana jest weryfikacja email, zatwierdź ją w Supabase Dashboard

## Krok 2: Uzupełnij profil Demo (opcjonalnie)

Po utworzeniu użytkownika, możesz uzupełnić jego profil w bazie danych:

```sql
-- Znajdź ID użytkownika demo
SELECT id FROM auth.users WHERE email = 'demo@izipadel.pl';

-- Uzupełnij profil (podmień 'USER_ID' na rzeczywisty UUID)
UPDATE profiles 
SET 
  full_name = 'Demo Trener',
  phone = '+48 123 456 789',
  business_name = 'IZI Padel Academy',
  updated_at = NOW()
WHERE id = 'USER_ID';
```

## Krok 3: Dodaj przykładowe dane (opcjonalnie)

Możesz dodać przykładowe dane dla konta demo:

```sql
-- Znajdź ID użytkownika demo
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@izipadel.pl';

  -- Dodaj przykładowe korty
  INSERT INTO courts (user_id, name, location, hourly_rate) VALUES
    (demo_user_id, 'Kort 1', 'Główny korty indoor', 100.00),
    (demo_user_id, 'Kort 2', 'Kort outdoor', 80.00);

  -- Dodaj przykładowych klientów
  INSERT INTO clients (user_id, full_name, email, phone) VALUES
    (demo_user_id, 'Jan Kowalski', 'jan.kowalski@example.com', '+48 600 111 222'),
    (demo_user_id, 'Anna Nowak', 'anna.nowak@example.com', '+48 600 333 444'),
    (demo_user_id, 'Piotr Wiśniewski', 'piotr.w@example.com', '+48 600 555 666');

  -- Dodaj przykładowe usługi
  INSERT INTO services (user_id, name, type, duration, price) VALUES
    (demo_user_id, 'Trening indywidualny', 'individual', 60, 150.00),
    (demo_user_id, 'Trening grupowy (4 os)', 'group', 90, 200.00),
    (demo_user_id, 'Pakiet 10 treningów', 'package', 600, 1400.00);

END $$;
```

## Krok 4: Dodaj kluby/korty (opcjonalnie)

Po zalogowaniu dodaj swoje korty w ustawieniach:

1. Przejdź do **Ustawienia** (w menu bocznym)
2. Wybierz zakładkę **"Kluby/Korty"**
3. Kliknij **"Dodaj klub/kort"**
4. Wprowadź dane:
   - Nazwa: np. "Kort 1 - Indoor"
   - Cena za godzinę: np. 120 zł (cena domyślna)
   - Wybierz kolor
   - Zaznacz "Kort aktywny"
5. Kliknij **"Dodaj kort"**

**Przykładowe korty:**
- Kort 1 Indoor - 120 zł/h (niebieski)
- Kort 2 Outdoor - 100 zł/h (zielony)
- Kort 3 Indoor - 120 zł/h (fioletowy)

### Dodawanie przedziałów cenowych

Po utworzeniu kortu możesz dodać różne ceny dla różnych godzin i dni:

1. W liście kortów kliknij przycisk **"X przedziałów"** przy wybranym korcie
2. Kliknij **"Dodaj przedział"**
3. Wprowadź dane:
   - Nazwa: np. "Rano (6:00-14:00)"
   - Typ dni: Dni powszednie / Weekendy / Wszystkie dni
   - Godzina od: np. 06:00
   - Godzina do: np. 14:00
   - Cena za godzinę: np. 180 zł
4. Kliknij **"Dodaj przedział"**

**Przykładowe przedziały (jak na obrazku):**

**Kort 1 - Indoor:**
- Rano (6:00-14:00) - Dni powszednie - 180 zł/h
- Popoludnie/Wieczór (14:00-23:00) - Dni powszednie - 240 zł/h  
- Weekendy - Weekendy (6:00-23:00) - 180 zł/h

**Korzyści:**
- System automatycznie dobierze odpowiednią cenę podczas tworzenia usługi
- Różne ceny dla różnych pór dnia i dni tygodnia
- Pełna elastyczność w zarządzaniu cennikiem

## Krok 5: Testowanie

1. Otwórz aplikację: `http://localhost:3000/login`
2. Kliknij przycisk **"🎾 Demo - Zaloguj jako Trener"**
3. Zostaniesz automatycznie zalogowany!
4. Przejdź do **Ustawienia → Kluby/Korty** i dodaj swoje korty
5. Następnie w **Usługi → Dodaj usługę** wybierz kort i zobacz podsumowanie finansowe

## Bezpieczeństwo

⚠️ **WAŻNE:** To konto jest tylko do celów demonstracyjnych. 

Dla produkcji:
- Usuń przycisk Demo Login z kodu
- Usuń konto demo lub zmień hasło
- Nigdy nie wrzucaj danych logowania demo do publicznego repozytorium

## Usunięcie funkcji Demo (produkcja)

Kiedy będziesz gotowy do wdrożenia produkcyjnego, usuń:

1. Funkcję `handleDemoLogin` z `app/(auth)/login/page.tsx`
2. Przycisk "Demo - Zaloguj jako Trener" z UI
3. Użytkownika demo z Supabase

---

**Gotowe!** 🎾 Teraz możesz łatwo testować aplikację jednym kliknięciem!

