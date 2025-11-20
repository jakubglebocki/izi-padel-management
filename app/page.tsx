import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Users, TrendingUp, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎾</div>
            <span className="text-2xl font-bold text-white">IZI Padel Management</span>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/login">Zaloguj się</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">
                Zacznij za darmo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Zarządzaj swoimi kortami
            <span className="text-blue-400"> profesjonalnie</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Kompleksowa platforma do zarządzania treningami padla, kalendarzem zajęć,
            klientami i przychodami. Wszystko w jednym miejscu.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
              <Link href="/register">
                Rozpocznij teraz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <Link href="/login">
                Mam już konto
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-blue-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Inteligentny kalendarz</h3>
            <p className="text-slate-400">
              Zarządzaj rezerwacjami, blokuj terminy i planuj zajęcia z łatwością
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="bg-green-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Baza klientów</h3>
            <p className="text-slate-400">
              Śledź historię rezerwacji, preferencje i notatki dla każdego klienta
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="bg-orange-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-orange-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Raporty i statystyki</h3>
            <p className="text-slate-400">
              Analizuj przychody, wykorzystanie kortów i popularność usług
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="bg-purple-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Settings className="text-purple-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Kalkulator cen</h3>
            <p className="text-slate-400">
              Obliczaj optymalne ceny dla treningów, pakietów i campów
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur border border-blue-500/20 rounded-2xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gotowy aby zacząć?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Dołącz do trenerów, którzy zarządzają swoimi kortami profesjonalnie
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg">
            <Link href="/register">
              Utwórz darmowe konto
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center text-slate-400 text-sm">
            <p>© 2025 IZI Padel Management. Wszystkie prawa zastrzeżone.</p>
            <div className="flex gap-6">
              <Link href="/login" className="hover:text-white">
                Logowanie
              </Link>
              <Link href="/register" className="hover:text-white">
                Rejestracja
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
