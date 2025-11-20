'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useServices } from '@/hooks/useServices'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Calculator } from 'lucide-react'
import Link from 'next/link'
import type { ServiceType } from '@/types'

const serviceTypeOptions = [
  { value: 'single', label: 'Trening jednorazowy' },
  { value: 'package', label: 'Pakiet treningów' },
  { value: 'camp', label: 'Camp/Obóz' },
]

const colorOptions = [
  { value: '#3b82f6', label: 'Niebieski', color: 'bg-blue-500' },
  { value: '#10b981', label: 'Zielony', color: 'bg-green-500' },
  { value: '#f59e0b', label: 'Pomarańczowy', color: 'bg-orange-500' },
  { value: '#ef4444', label: 'Czerwony', color: 'bg-red-500' },
  { value: '#8b5cf6', label: 'Fioletowy', color: 'bg-purple-500' },
  { value: '#ec4899', label: 'Różowy', color: 'bg-pink-500' },
]

export default function NewServicePage() {
  const router = useRouter()
  const { createService } = useServices()
  const [loading, setLoading] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ServiceType>('single')
  const [durationHours, setDurationHours] = useState<number>(1.5)
  const [minParticipants, setMinParticipants] = useState<number>(1)
  const [maxParticipants, setMaxParticipants] = useState<number>(4)
  const [pricePerPerson, setPricePerPerson] = useState<number>(100)
  const [targetProfitPerHour, setTargetProfitPerHour] = useState<number>(200)
  const [sessionsCount, setSessionsCount] = useState<number>(10)
  const [color, setColor] = useState('#3b82f6')
  const [isActive, setIsActive] = useState(true)

  // Simple calculator
  const courtCostPerHour = 100 // Przykładowy koszt kortu
  const calculateRecommendedPrice = () => {
    const totalCost = courtCostPerHour * durationHours
    const targetRevenue = targetProfitPerHour * durationHours
    const totalPerSession = totalCost + targetRevenue
    const avgParticipants = (minParticipants + maxParticipants) / 2
    return Math.round(totalPerSession / avgParticipants)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createService({
        name,
        description: description || null,
        type,
        duration_hours: durationHours,
        min_participants: minParticipants,
        max_participants: maxParticipants,
        price_per_person: pricePerPerson,
        target_profit_per_hour: targetProfitPerHour,
        sessions_count: type === 'package' ? sessionsCount : null,
        color,
        is_active: isActive,
      })

      router.push('/services')
    } catch (error) {
      console.error('Error creating service:', error)
    } finally {
      setLoading(false)
    }
  }

  const recommendedPrice = calculateRecommendedPrice()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Link href="/services">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Nowa usługa</h1>
          <p className="text-slate-400 mt-1">
            Utwórz nową usługę lub pakiet treningowy
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Podstawowe informacje</CardTitle>
            <CardDescription className="text-slate-400">
              Nazwa i opis usługi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Nazwa usługi *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Trening indywidualny"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200">
                Opis (opcjonalnie)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dodaj opis usługi..."
                rows={3}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-200">
                  Typ usługi *
                </Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as ServiceType)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {serviceTypeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white focus:bg-slate-700"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-slate-200">
                  Kolor
                </Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {colorOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white focus:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${option.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Szczegóły usługi</CardTitle>
            <CardDescription className="text-slate-400">
              Czas trwania i liczba uczestników
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-slate-200">
                  Czas trwania (h)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  min="0.5"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minParticipants" className="text-slate-200">
                  Min. uczestników
                </Label>
                <Input
                  id="minParticipants"
                  type="number"
                  value={minParticipants}
                  onChange={(e) => setMinParticipants(parseInt(e.target.value))}
                  min="1"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-slate-200">
                  Max. uczestników
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  min="1"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {type === 'package' && (
              <div className="space-y-2">
                <Label htmlFor="sessionsCount" className="text-slate-200">
                  Liczba treningów w pakiecie
                </Label>
                <Input
                  id="sessionsCount"
                  type="number"
                  value={sessionsCount}
                  onChange={(e) => setSessionsCount(parseInt(e.target.value))}
                  min="1"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">Kalkulator ceny</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Ustal cenę na podstawie kosztów i zysku
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetProfit" className="text-slate-200">
                  Docelowy zysk/h (zł)
                </Label>
                <Input
                  id="targetProfit"
                  type="number"
                  value={targetProfitPerHour}
                  onChange={(e) => setTargetProfitPerHour(parseFloat(e.target.value))}
                  min="0"
                  step="10"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-200">
                  Cena za osobę (zł)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(parseFloat(e.target.value))}
                  min="0"
                  step="10"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calculator className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-400 mb-1">
                    Sugerowana cena
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {recommendedPrice} zł / osoba
                  </div>
                  <div className="text-xs text-slate-400">
                    Przy {minParticipants}-{maxParticipants} uczestnikach i {durationHours}h treningu
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Tworzenie...' : 'Utwórz usługę'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  )
}

