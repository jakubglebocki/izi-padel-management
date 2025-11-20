'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Raporty i statystyki</h1>
        <p className="text-slate-400 mt-1">
          Analizuj swoje przychody i wydajność
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <CardTitle className="text-white">Raporty wkrótce!</CardTitle>
              <CardDescription className="text-slate-300">
                Przygotowujemy zaawansowane narzędzia analityczne
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Planowane raporty:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Przychody (dzień/tydzień/miesiąc/rok)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Wykorzystanie kortów</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Popularne usługi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Statystyki klientów</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Export do CSV/PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Wykresy i wizualizacje</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Preview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Przychody</CardTitle>
            <CardDescription className="text-slate-400">
              Analiza przychodów w czasie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Wkrótce dostępne</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Wykorzystanie kortów</CardTitle>
            <CardDescription className="text-slate-400">
              Statystyki zajętości kortów
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Wkrótce dostępne</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

