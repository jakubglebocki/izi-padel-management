# 🎾 IZI Padel Management

Kompleksowa aplikacja do zarządzania kortami padla, kalendarzem zajęć, klientami i przychodami dla trenerów i organizatorów.

## 🚀 Stack Technologiczny

- **Framework:** Next.js 14 (App Router)
- **Język:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Zustand / React Context
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner
- **Icons:** Lucide React
- **Dates:** date-fns

## 📋 Funkcje (MVP)

### ✅ Zaimplementowane
- [x] System autentykacji (login, register, reset password)
- [x] Główny layout z sidebar i nawigacją
- [x] Dashboard z podstawowymi statystykami
- [x] Konfiguracja Supabase i schemat bazy danych
- [x] Responsywny design (dark mode)

### 🔨 W trakcie
- [ ] CRUD usług z kalkulatorem cen
- [ ] CRUD klientów
- [ ] Kalendarz z rezerwacjami
- [ ] Zarządzanie kortami
- [ ] Raporty i statystyki
- [ ] Ustawienia użytkownika

### 🎯 Planowane (v2.0+)
- [ ] Płatności online
- [ ] Automatyczne przypomnienia SMS/Email
- [ ] Faktury i rachunki
- [ ] Portal dla klientów
- [ ] Aplikacja mobilna

## 🛠️ Instalacja

### Wymagania
- Node.js 18+
- npm lub yarn
- Konto Supabase

### Kroki

1. **Klonowanie repozytorium**
```bash
git clone https://github.com/TWOJE_USERNAME/izi-padel-management.git
cd izi-padel-management
```

2. **Instalacja zależności**
```bash
npm install
```

3. **Konfiguracja zmiennych środowiskowych**
Stwórz plik `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Konfiguracja bazy danych**
- Zaloguj się do panelu Supabase
- Przejdź do SQL Editor
- Uruchom skrypt `supabase-schema.sql`

5. **Uruchomienie aplikacji**
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## 📁 Struktura projektu

```
izi-padel-management/
├── app/
│   ├── (auth)/              # Strony autentykacji
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── (dashboard)/         # Strony dashboardu
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   ├── services/
│   │   ├── clients/
│   │   ├── bookings/
│   │   ├── reports/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (Sidebar, Header)
│   ├── calendar/
│   ├── forms/
│   └── charts/
├── lib/
│   ├── supabase/            # Supabase clients i typy
│   ├── utils.ts
│   └── validations.ts
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── public/
```

## 🗄️ Schemat bazy danych

Aplikacja używa następujących tabel:
- `profiles` - Profile użytkowników
- `courts` - Korty padla
- `services` - Szablony usług (treningi, pakiety, campy)
- `clients` - Baza klientów
- `bookings` - Rezerwacje
- `working_hours` - Godziny pracy
- `blocked_slots` - Zablokowane terminy

Więcej szczegółów w pliku `supabase-schema.sql`

## 🎨 Customizacja

### Kolory
Aplikacja używa ciemnego motywu z paletą kolorów:
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)

Kolory można dostosować w `app/globals.css`

### Komponenty UI
Wszystkie komponenty UI są w folderze `components/ui/` i mogą być łatwo dostosowane.

## 🧪 Testowanie

```bash
# Uruchom testy jednostkowe
npm run test

# Uruchom linter
npm run lint

# Sprawdź formatowanie
npm run format
```

## 📦 Deployment

### Vercel (Zalecane)
1. Push kodu na GitHub
2. Połącz repozytorium z Vercel
3. Dodaj zmienne środowiskowe
4. Deploy!

```bash
npm run build
```

### Inne platformy
Aplikacja może być hostowana na dowolnej platformie wspierającej Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## 📝 Zmienne środowiskowe

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=          # URL projektu Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Publiczny klucz anon

# Opcjonalne (dla production)
NEXT_PUBLIC_SITE_URL=              # URL produkcyjnej strony
```

## 🤝 Contributing

1. Fork projektu
2. Utwórz branch dla feature (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT.

## 📞 Kontakt

Jeśli masz pytania lub sugestie, skontaktuj się przez:
- Issues na GitHub
- Email: [twoj@email.pl]

## 🙏 Podziękowania

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for Padel Trainers**

🎾 Happy Managing! 🎾
