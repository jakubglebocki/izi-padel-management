'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react'
import type { Court, CourtPricing, DayType } from '@/types'

interface CourtPricingManagerProps {
  court: Court
  onCreatePricing: (courtId: string, pricing: Omit<CourtPricing, 'id' | 'court_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdatePricing: (id: string, pricing: Partial<CourtPricing>) => Promise<void>
  onDeletePricing: (id: string) => Promise<void>
}

const dayTypeLabels: Record<DayType, string> = {
  weekday: 'Dni powszednie',
  weekend: 'Weekendy',
  all: 'Wszystkie dni',
}

const dayTypeColors: Record<DayType, string> = {
  weekday: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  weekend: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  all: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export function CourtPricingManager({ court, onCreatePricing, onUpdatePricing, onDeletePricing }: CourtPricingManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPricing, setEditingPricing] = useState<CourtPricing | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Form state
  const [pricingName, setPricingName] = useState('')
  const [dayType, setDayType] = useState<DayType>('weekday')
  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('14:00')
  const [pricePerHour, setPricePerHour] = useState<number>(100)
  const [isActive, setIsActive] = useState(true)

  const resetForm = () => {
    setPricingName('')
    setDayType('weekday')
    setStartTime('06:00')
    setEndTime('14:00')
    setPricePerHour(100)
    setIsActive(true)
    setEditingPricing(null)
  }

  const handleOpenDialog = (pricing?: CourtPricing) => {
    if (pricing) {
      setEditingPricing(pricing)
      setPricingName(pricing.name)
      setDayType(pricing.day_type)
      setStartTime(pricing.start_time)
      setEndTime(pricing.end_time)
      setPricePerHour(pricing.price_per_hour)
      setIsActive(pricing.is_active)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setTimeout(resetForm, 200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const pricingData = {
        name: pricingName,
        day_type: dayType,
        start_time: startTime,
        end_time: endTime,
        price_per_hour: pricePerHour,
        is_active: isActive,
        display_order: court.pricing?.length || 0,
      }

      if (editingPricing) {
        await onUpdatePricing(editingPricing.id, pricingData)
      } else {
        await onCreatePricing(court.id, pricingData)
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving pricing:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (pricing: CourtPricing) => {
    if (!confirm(`Czy na pewno chcesz usunąć cennik "${pricing.name}"?`)) return
    await onDeletePricing(pricing.id)
  }

  const pricing = court.pricing || []

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">Cennik - {court.name}</CardTitle>
            <CardDescription className="text-slate-400">
              Zarządzaj przedziałami cenowymi dla tego kortu
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj przedział
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingPricing ? 'Edytuj przedział cenowy' : 'Dodaj przedział cenowy'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Ustaw cenę dla wybranego przedziału godzinowego
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricing-name" className="text-slate-200">
                      Nazwa przedziału *
                    </Label>
                    <Input
                      id="pricing-name"
                      value={pricingName}
                      onChange={(e) => setPricingName(e.target.value)}
                      placeholder="np. Rano (6:00-14:00)"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="day-type" className="text-slate-200">
                      Typ dni *
                    </Label>
                    <Select value={dayType} onValueChange={(value) => setDayType(value as DayType)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="weekday" className="text-white focus:bg-slate-700">
                          Dni powszednie (Pn-Pt)
                        </SelectItem>
                        <SelectItem value="weekend" className="text-white focus:bg-slate-700">
                          Weekendy (Sb-Nd)
                        </SelectItem>
                        <SelectItem value="all" className="text-white focus:bg-slate-700">
                          Wszystkie dni
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time" className="text-slate-200">
                        Godzina od *
                      </Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-time" className="text-slate-200">
                        Godzina do *
                      </Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-per-hour" className="text-slate-200">
                      Cena za godzinę (zł) *
                    </Label>
                    <Input
                      id="price-per-hour"
                      type="number"
                      step="0.01"
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(parseFloat(e.target.value))}
                      placeholder="100"
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="pricing-active"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                    />
                    <Label htmlFor="pricing-active" className="text-slate-200 cursor-pointer">
                      Przedział aktywny
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={formLoading}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {formLoading
                      ? 'Zapisywanie...'
                      : editingPricing
                      ? 'Zaktualizuj'
                      : 'Dodaj przedział'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {pricing.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Brak przedziałów cenowych</p>
            <p className="text-xs mt-1">Dodaj przedział cenowy dla tego kortu</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Nazwa</TableHead>
                <TableHead className="text-slate-400">Typ</TableHead>
                <TableHead className="text-slate-400">Godziny</TableHead>
                <TableHead className="text-slate-400">Cena/h</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-slate-700 hover:bg-slate-800/50"
                >
                  <TableCell className="text-white font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={dayTypeColors[p.day_type]}>
                      {dayTypeLabels[p.day_type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.start_time} - {p.end_time}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300 font-semibold">
                    {p.price_per_hour} zł
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.is_active
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }
                    >
                      {p.is_active ? 'Aktywny' : 'Nieaktywny'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(p)}
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

