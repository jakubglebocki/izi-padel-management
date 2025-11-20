# 🤝 Contributing to IZI Padel Management

Dziękujemy za zainteresowanie rozwojem projektu! 

## 📋 Jak możesz pomóc?

- 🐛 Zgłaszanie bugów
- 💡 Propozycje nowych funkcji
- 📝 Poprawa dokumentacji
- 💻 Dodawanie nowych features
- 🎨 Ulepszenia UI/UX

## 🚀 Proces rozwoju

### 1. Fork repozytorium
Kliknij przycisk "Fork" na górze strony GitHub.

### 2. Sklonuj swój fork
```bash
git clone https://github.com/YOUR_USERNAME/izi-padel-management.git
cd izi-padel-management
```

### 3. Utwórz branch dla feature
```bash
git checkout -b feature/nazwa-feature
```

Konwencja nazewnictwa branchy:
- `feature/nazwa` - nowe funkcje
- `fix/nazwa` - poprawki bugów
- `docs/nazwa` - zmiany w dokumentacji
- `refactor/nazwa` - refactoring kodu

### 4. Wykonaj zmiany
- Pisz czytelny kod
- Dodaj komentarze tam gdzie potrzeba
- Trzymaj się stylu kodu projektu
- Testuj swoje zmiany

### 5. Commit zmian
```bash
git add .
git commit -m "feat: dodaj nową funkcję XYZ"
```

Konwencja commitów (Conventional Commits):
- `feat:` - nowa funkcja
- `fix:` - poprawka buga
- `docs:` - zmiany w dokumentacji
- `style:` - formatowanie, brakujące średniki, etc.
- `refactor:` - refactoring kodu
- `test:` - dodanie testów
- `chore:` - aktualizacja zadań, konfiguracji, etc.

### 6. Push do swojego fork
```bash
git push origin feature/nazwa-feature
```

### 7. Utwórz Pull Request
1. Przejdź do swojego fork na GitHub
2. Kliknij "Compare & pull request"
3. Wypełnij template PR
4. Czekaj na review

## 🧪 Standardy kodu

### TypeScript
- Używaj strict mode
- Typuj wszystkie zmienne i funkcje
- Unikaj `any`

### React
- Używaj functional components
- Używaj hooks zamiast class components
- Komponenty w PascalCase
- Props w camelCase

### Styling
- Używaj Tailwind CSS utility classes
- Zachowaj spójność z istniejącym designem
- Dark mode first

### Struktura plików
```
feature/
├── components/
│   ├── FeatureComponent.tsx
│   └── FeatureSubComponent.tsx
├── hooks/
│   └── useFeature.ts
├── types/
│   └── feature.types.ts
└── utils/
    └── featureHelpers.ts
```

## 📝 Pull Request Template

```markdown
## 📝 Opis
Krótki opis co zostało zmienione i dlaczego.

## 🎯 Typ zmiany
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## ✅ Checklist
- [ ] Kod działa lokalnie
- [ ] Dodane testy (jeśli dotyczy)
- [ ] Zaktualizowana dokumentacja
- [ ] Brak konfliktów z main
- [ ] Testy przechodzą

## 📸 Screenshots (jeśli dotyczy)
Dodaj screenshots dla zmian UI.

## 🔗 Issues
Closes #123
```

## 🐛 Zgłaszanie bugów

Użyj GitHub Issues z template:

```markdown
## 🐛 Opis buga
Jasny opis co jest nie tak.

## 📋 Kroki do odtworzenia
1. Przejdź do '...'
2. Kliknij na '....'
3. Scroll do '....'
4. Zobacz błąd

## ✅ Oczekiwane zachowanie
Co powinno się stać.

## 📸 Screenshots
Jeśli dotyczy, dodaj screenshots.

## 🖥️ Środowisko
- OS: [np. Windows 11]
- Browser: [np. Chrome 120]
- Version: [np. 1.0.0]

## ℹ️ Dodatkowe informacje
Inne istotne informacje.
```

## 💡 Sugestie funkcji

Użyj GitHub Issues z label "enhancement":

```markdown
## 💡 Opis funkcji
Jasny opis funkcji.

## 🎯 Problem do rozwiązania
Jaki problem rozwiązuje ta funkcja?

## 📋 Proponowane rozwiązanie
Jak widzisz implementację?

## 🔄 Alternatywy
Jakie inne rozwiązania rozważałeś?

## 📸 Mockupy/Sketches
Jeśli masz wizualizację, dodaj ją tutaj.
```

## 🎨 Style Guide

### Nazewnictwo
- Komponenty: `PascalCase`
- Funkcje/zmienne: `camelCase`
- Stałe: `UPPER_SNAKE_CASE`
- Pliki: `kebab-case.tsx`
- Typy/Interfejsy: `PascalCase`

### Przykłady
```typescript
// ✅ Good
interface UserProfile {
  firstName: string
  lastName: string
}

const getUserData = async (userId: string) => {
  // ...
}

// ❌ Bad
interface user_profile {
  first_name: string
  last_name: string
}

const GetUserData = async (user_id: string) => {
  // ...
}
```

## 🧪 Testowanie

### Przed submitem PR
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build

# Tests (jeśli dostępne)
npm run test
```

## 📚 Zasoby

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## 🤔 Pytania?

Jeśli masz pytania:
1. Sprawdź [Issues](https://github.com/YOUR_USERNAME/izi-padel-management/issues)
2. Utwórz nowy Issue z pytaniem
3. Skontaktuj się przez email

## 📄 Licencja

Kontrybuując do tego projektu, zgadzasz się na udostępnienie swoich zmian na licencji MIT.

---

**Dziękujemy za wkład w rozwój IZI Padel Management! 🎾**

