# 🚀 Konfiguracja GitHub dla IZI Padel Management

## Opcja 1: Przez interfejs GitHub (Zalecane dla początkujących)

### Krok 1: Utwórz nowe repozytorium na GitHub
1. Przejdź do https://github.com/new
2. Nazwa repozytorium: `izi-padel-management`
3. Opis: `Kompleksowa aplikacja do zarządzania kortami padla`
4. Wybierz **Public** lub **Private**
5. **NIE** zaznaczaj żadnych opcji (README, .gitignore, license)
6. Kliknij **"Create repository"**

### Krok 2: Połącz lokalne repozytorium z GitHub
W terminalu PowerShell w folderze projektu wykonaj:

```powershell
# Dodaj remote (zamień YOUR_USERNAME na swoją nazwę użytkownika GitHub)
git remote add origin https://github.com/YOUR_USERNAME/izi-padel-management.git

# Zmień nazwę brancha na main (jeśli potrzeba)
git branch -M main

# Wypchnij kod na GitHub
git push -u origin main
```

### Krok 3: Weryfikacja
Odśwież stronę repozytorium na GitHub - powinien pojawić się kod!

---

## Opcja 2: Przez GitHub CLI (Dla zaawansowanych)

### Instalacja GitHub CLI
1. Pobierz z: https://cli.github.com/
2. Zainstaluj i uruchom ponownie terminal

### Autoryzacja
```powershell
gh auth login
```

### Utworzenie repozytorium
```powershell
# W folderze projektu
gh repo create izi-padel-management --public --source=. --remote=origin --push
```

---

## 🔐 Konfiguracja Secrets dla Vercel/Production

Po utworzeniu repozytorium, dodaj secrets w ustawieniach GitHub:

1. Przejdź do `Settings` → `Secrets and variables` → `Actions`
2. Dodaj następujące secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📦 Deploy na Vercel

### Automatyczny deploy z GitHub

1. Przejdź do https://vercel.com/
2. Kliknij **"New Project"**
3. Import z GitHub: wybierz `izi-padel-management`
4. Dodaj Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Kliknij **"Deploy"**

Vercel automatycznie zbuduje i wdroży aplikację!

### Automatyczne aktualizacje
Każdy push na branch `main` automatycznie wdroży nową wersję.

---

## 🗄️ Konfiguracja bazy danych Supabase

### Krok 1: Uruchom schemat SQL
1. Zaloguj się do https://supabase.com/dashboard
2. Wybierz swój projekt
3. Przejdź do `SQL Editor`
4. Utwórz nowy query
5. Skopiuj zawartość pliku `supabase-schema.sql`
6. Wklej i kliknij **"Run"**

### Krok 2: Włącz Email Auth
1. Przejdź do `Authentication` → `Providers`
2. Włącz **Email** provider
3. Opcjonalnie skonfiguruj email templates

### Krok 3: Sprawdź RLS (Row Level Security)
Wszystkie tabele powinny mieć włączone RLS z odpowiednimi politykami.

---

## ✅ Checklist po setupie

- [ ] Repozytorium utworzone na GitHub
- [ ] Kod wypchnięty na GitHub
- [ ] Schemat bazy danych uruchomiony w Supabase
- [ ] Email Auth włączony w Supabase
- [ ] Aplikacja wdrożona na Vercel
- [ ] Environment variables skonfigurowane
- [ ] Możesz się zalogować i zarejestrować

---

## 🐛 Troubleshooting

### Problem: `git push` wymaga autoryzacji
**Rozwiązanie:** Użyj Personal Access Token zamiast hasła:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Zaznacz `repo` scope
4. Użyj tokenu jako hasła przy push

### Problem: Build fails na Vercel
**Rozwiązanie:** 
- Sprawdź czy wszystkie env variables są dodane
- Sprawdź logi buildu w Vercel
- Upewnij się, że `npm run build` działa lokalnie

### Problem: Nie można się zalogować
**Rozwiązanie:**
- Sprawdź czy schemat SQL został uruchomiony
- Sprawdź czy Email Auth jest włączony w Supabase
- Sprawdź console w przeglądarce dla błędów

---

## 📝 Następne kroki

Po setupie możesz:
1. Dodać swoje korty w Ustawieniach
2. Utworzyć pierwsze usługi
3. Dodać klientów
4. Zaplanować zajęcia w kalendarzu

**Powodzenia! 🎾**

