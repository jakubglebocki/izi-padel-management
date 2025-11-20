'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Kalendarz</h1>
          <p className="text-slate-400 mt-1">
            Zarządzaj swoim harmonogramem zajęć
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nowa rezerwacja
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-blue-400" />
            <div>
              <CardTitle className="text-white">Kalendarz wkrótce!</CardTitle>
              <CardDescription className="text-slate-300">
                Pracujemy nad zaawansowanym widokiem kalendarza
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Planowane funkcje:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Widok tygodniowy i miesięczny</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Drag & drop rezerwacji</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Kolorowe bloki dla różnych usług</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Filtrowanie po kortach i statusach</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Blokowanie terminów (urlopy, przerwy)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Szybki podgląd szczegółów rezerwacji</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              W międzyczasie możesz zarządzać usługami i klientami, aby być gotowym na start kalendarza.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Temporary List View */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Nadchodzące zajęcia</CardTitle>
          <CardDescription className="text-slate-400">
            Lista zaplanowanych rezerwacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Brak zaplanowanych zajęć</p>
            <p className="text-sm">
              Dodaj swoją pierwszą rezerwację, gdy kalendarz będzie gotowy
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                Przygotuj się do pełnego kalendarza
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Zanim kalendarz będzie gotowy, upewnij się że masz:
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    ✓
                  </div>
                  Skonfigurowane korty w ustawieniach
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    ✓
                  </div>
                  Utworzone usługi i pakiety
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    ✓
                  </div>
                  Dodanych klientów do bazy
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

