'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Ustawienia</h1>
        <p className="text-slate-400 mt-1">
          Zarządzaj ustawieniami swojego konta i aplikacji
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Profil użytkownika</CardTitle>
          <CardDescription className="text-slate-400">
            Twoje podstawowe informacje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-200">
                Imię i nazwisko
              </Label>
              <Input
                id="fullName"
                placeholder="Jan Kowalski"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-slate-200">
                Nazwa firmy
              </Label>
              <Input
                id="businessName"
                placeholder="Nazwa firmy"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                disabled
                className="bg-slate-800 border-slate-700 text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+48 123 456 789"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Zapisz zmiany
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courts Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Zarządzanie kortami</CardTitle>
          <CardDescription className="text-slate-400">
            Dodaj i skonfiguruj swoje korty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <SettingsIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Brak kortów</p>
            <p className="text-sm mt-1">Dodaj swój pierwszy kort</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              Dodaj kort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Ustawienia finansowe</CardTitle>
          <CardDescription className="text-slate-400">
            Domyślne stawki podatków
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vat" className="text-slate-200">
                Stawka VAT
              </Label>
              <Input
                id="vat"
                type="number"
                step="0.01"
                placeholder="23%"
                defaultValue="23"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pit" className="text-slate-200">
                Stawka PIT
              </Label>
              <Input
                id="pit"
                type="number"
                step="0.01"
                placeholder="23.9%"
                defaultValue="23.9"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Zapisz ustawienia
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-600/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <SettingsIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white mb-1">
                Funkcje w przygotowaniu
              </p>
              <p>
                Pełne zarządzanie ustawieniami, w tym godziny pracy, powiadomienia i integracje będą dostępne wkrótce.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

