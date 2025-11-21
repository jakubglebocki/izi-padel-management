'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Settings as SettingsIcon, Plus, Building2, Edit, Trash2, DollarSign, ChevronDown, ChevronUp, Clock, X, Upload, Image as ImageIcon, Users, Package as PackageIcon } from 'lucide-react'
import { useCourts } from '@/hooks/useCourts'
import { useGroups } from '@/hooks/useGroups'
import { usePackages } from '@/hooks/usePackages'
import { CourtPricingManager } from '@/components/courts/CourtPricingManager'
import { uploadCourtAvatar, deleteCourtAvatar } from '@/lib/supabase/upload'
import { createClient } from '@/lib/supabase/client'
import type { Court, CourtPricingFormData, DayType, CourtType } from '@/types'

export default function SettingsPage() {
  const { courts, loading: courtsLoading, createCourt, updateCourt, deleteCourt, createCourtPricing, updateCourtPricing, deleteCourtPricing } = useCourts()
  const { groups, loading: groupsLoading, createGroup } = useGroups()
  const { packages, loading: packagesLoading, createPackage, deletePackage } = usePackages()
  const [expandedCourtId, setExpandedCourtId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [groupFormLoading, setGroupFormLoading] = useState(false)
  const [packageFormLoading, setPackageFormLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Court form state
  const [clubName, setClubName] = useState('')
  const [courtType, setCourtType] = useState<CourtType>('double')
  const [courtColor, setCourtColor] = useState('#3b82f6')
  const [courtActive, setCourtActive] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Pricing slots state
  const [pricingSlots, setPricingSlots] = useState<CourtPricingFormData[]>([])
  const [showPricingForm, setShowPricingForm] = useState(false)
  
  // Group form state
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupColor, setGroupColor] = useState('#3b82f6')
  const [groupMaxParticipants, setGroupMaxParticipants] = useState<number>(10)
  
  // Package form state
  const [packageName, setPackageName] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [packageSessionsCount, setPackageSessionsCount] = useState<number>(4)
  const [packagePrice, setPackagePrice] = useState<number>(200)
  const [packageValidityDays, setPackageValidityDays] = useState<number | ''>('')
  
  // New pricing slot form state
  const [newPricingName, setNewPricingName] = useState('')
  const [newPricingDayType, setNewPricingDayType] = useState<DayType>('weekday')
  const [newPricingStartTime, setNewPricingStartTime] = useState('06:00')
  const [newPricingEndTime, setNewPricingEndTime] = useState('14:00')
  const [newPricingPrice, setNewPricingPrice] = useState<number>(100)

  const resetForm = () => {
    setClubName('')
    setCourtType('double')
    setCourtColor('#3b82f6')
    setCourtActive(true)
    setAvatarUrl(null)
    setAvatarFile(null)
    setPricingSlots([])
    setShowPricingForm(false)
    setEditingCourt(null)
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Proszę wybrać plik obrazu')
        return
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Plik jest za duży. Maksymalny rozmiar to 2MB')
        return
      }
      setAvatarFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarUrl(previewUrl)
    }
  }

  const handleRemoveAvatar = async () => {
    // If editing and there's an existing avatar URL, optionally delete from storage
    if (editingCourt && editingCourt.avatar_url && avatarUrl === editingCourt.avatar_url) {
      // Delete from storage
      await deleteCourtAvatar(editingCourt.avatar_url)
    }
    
    setAvatarFile(null)
    setAvatarUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const resetPricingForm = () => {
    setNewPricingName('')
    setNewPricingDayType('weekday')
    setNewPricingStartTime('06:00')
    setNewPricingEndTime('14:00')
    setNewPricingPrice(100)
  }
  
  const handleAddPricingSlot = () => {
    const newSlot: CourtPricingFormData = {
      name: newPricingName,
      day_type: newPricingDayType,
      start_time: newPricingStartTime,
      end_time: newPricingEndTime,
      price_per_hour: newPricingPrice,
      is_active: true,
      display_order: pricingSlots.length,
    }
    setPricingSlots([...pricingSlots, newSlot])
    resetPricingForm()
    setShowPricingForm(false)
  }
  
  const handleRemovePricingSlot = (index: number) => {
    setPricingSlots(pricingSlots.filter((_, i) => i !== index))
  }

  const handleOpenDialog = (court?: Court) => {
    if (court) {
      setEditingCourt(court)
      setClubName(court.club_name || '')
      setCourtType(court.court_type || 'double')
      setCourtColor(court.color || '#3b82f6')
      setCourtActive(court.is_active)
      setAvatarUrl(court.avatar_url || null)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setTimeout(resetForm, 200)
  }

  const handleSubmitCourt = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      let uploadedAvatarUrl = avatarUrl

      // Upload avatar if a new file was selected
      if (avatarFile) {
        setUploadingAvatar(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const uploadedUrl = await uploadCourtAvatar(avatarFile, user.id)
          if (uploadedUrl) {
            uploadedAvatarUrl = uploadedUrl
          }
        }
        setUploadingAvatar(false)
      }

      if (editingCourt) {
        await updateCourt(editingCourt.id, {
          club_name: clubName || null,
          name: clubName || 'Kort',
          court_type: courtType,
          hourly_rate: null,
          color: courtColor,
          avatar_url: uploadedAvatarUrl || null,
          is_active: courtActive,
        })
      } else {
        // Create court
        const newCourt = await createCourt({
          club_name: clubName || null,
          name: clubName || 'Kort',
          court_type: courtType,
          hourly_rate: null,
          color: courtColor,
          avatar_url: uploadedAvatarUrl || null,
          is_active: courtActive,
          display_order: courts.length,
        })
        
        // Create pricing slots if any
        if (pricingSlots.length > 0 && newCourt) {
          for (const slot of pricingSlots) {
            await createCourtPricing(newCourt.id, slot)
          }
        }
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving court:', error)
    } finally {
      setFormLoading(false)
      setUploadingAvatar(false)
    }
  }

  const handleDeleteCourt = async (court: Court) => {
    if (!confirm(`Czy na pewno chcesz usunąć kort "${court.name}"?`)) return
    await deleteCourt(court.id)
  }

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setGroupFormLoading(true)

    try {
      await createGroup({
        name: groupName,
        description: groupDescription || null,
        color: groupColor,
        max_participants: groupMaxParticipants,
        is_active: true,
      })

      // Reset form
      setGroupName('')
      setGroupDescription('')
      setGroupColor('#3b82f6')
      setGroupMaxParticipants(10)
      setIsGroupDialogOpen(false)
    } catch (error) {
      console.error('Error creating group:', error)
    } finally {
      setGroupFormLoading(false)
    }
  }

  const handleSubmitPackage = async (e: React.FormEvent) => {
    e.preventDefault()
    setPackageFormLoading(true)

    try {
      await createPackage({
        name: packageName,
        description: packageDescription || null,
        sessions_count: packageSessionsCount,
        price: packagePrice,
        validity_days: packageValidityDays || null,
        is_active: true,
      })

      // Reset form
      setPackageName('')
      setPackageDescription('')
      setPackageSessionsCount(4)
      setPackagePrice(200)
      setPackageValidityDays('')
      setIsPackageDialogOpen(false)
    } catch (error) {
      console.error('Error creating package:', error)
    } finally {
      setPackageFormLoading(false)
    }
  }

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć pakiet "${name}"?`)) return
    await deletePackage(id)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Ustawienia</h1>
        <p className="text-slate-400 mt-1">
          Zarządzaj ustawieniami swojego konta i aplikacji
        </p>
      </div>

      <Tabs defaultValue="courts" className="w-full">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="courts" className="data-[state=active]:bg-slate-700">
            <Building2 className="h-4 w-4 mr-2" />
            Kluby/Korty
          </TabsTrigger>
          <TabsTrigger value="groups" className="data-[state=active]:bg-slate-700">
            <Users className="h-4 w-4 mr-2" />
            Grupy
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-slate-700">
            <PackageIcon className="h-4 w-4 mr-2" />
            Pakiety
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-slate-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Finanse
          </TabsTrigger>
        </TabsList>

        {/* Courts Tab */}
        <TabsContent value="courts" className="space-y-4 mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Zarządzanie klubami/kortami</CardTitle>
                  <CardDescription className="text-slate-400">
                    Dodaj kluby i ustaw cenniki za godzinę kortu
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => handleOpenDialog()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj klub/kort
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmitCourt}>
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {editingCourt ? 'Edytuj klub/kort' : 'Dodaj nowy klub/kort'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          {editingCourt
                            ? 'Zaktualizuj informacje o klubie/korcie'
                            : 'Wprowadź dane nowego klubu/kortu'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        {/* Avatar Upload Section */}
                        <div className="space-y-2">
                          <Label className="text-slate-200">Awatar klubu</Label>
                          <div className="flex items-center gap-4">
                            {avatarUrl ? (
                              <div className="relative">
                                <img
                                  src={avatarUrl}
                                  alt="Avatar klubu"
                                  className="w-20 h-20 rounded-lg object-cover border-2 border-slate-700"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={handleRemoveAvatar}
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-slate-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                                className="hidden"
                                id="avatar-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {avatarUrl ? 'Zmień awatar' : 'Dodaj awatar'}
                              </Button>
                              <p className="text-xs text-slate-500 mt-2">
                                JPG, PNG, GIF. Maks. 2MB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club-name" className="text-slate-200">
                              Nazwa klubu *
                            </Label>
                            <Input
                              id="club-name"
                              value={clubName}
                              onChange={(e) => setClubName(e.target.value)}
                              placeholder="np. Fiesta Padel KK69"
                              required
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="court-type" className="text-slate-200">
                              Rodzaj kortu *
                            </Label>
                            <Select value={courtType} onValueChange={(value) => setCourtType(value as CourtType)}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="single" className="text-white focus:bg-slate-700">
                                  Single (pojedynczy)
                                </SelectItem>
                                <SelectItem value="double" className="text-white focus:bg-slate-700">
                                  Double (podwójny)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="court-color" className="text-slate-200">
                            Kolor
                          </Label>
                          <div className="flex gap-3 flex-wrap">
                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(
                              (color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setCourtColor(color)}
                                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                    courtColor === color
                                      ? 'border-white scale-110'
                                      : 'border-slate-700 hover:border-slate-500'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              )
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            id="court-active"
                            type="checkbox"
                            checked={courtActive}
                            onChange={(e) => setCourtActive(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                          />
                          <Label htmlFor="court-active" className="text-slate-200 cursor-pointer">
                            Kort aktywny
                          </Label>
                        </div>

                        {/* Pricing Slots Section */}
                        {!editingCourt && (
                          <div className="space-y-3 pt-4 border-t border-slate-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-slate-200">Przedziały cenowe *</Label>
                                <p className="text-xs text-slate-500 mt-1">
                                  Dodaj ceny dla różnych godzin i dni tygodnia
                                </p>
                              </div>
                              {!showPricingForm && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowPricingForm(true)}
                                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Dodaj przedział
                                </Button>
                              )}
                            </div>

                            {/* List of added pricing slots */}
                            {pricingSlots.length > 0 && (
                              <div className="space-y-2">
                                {pricingSlots.map((slot, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-3"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-400" />
                                        <span className="text-white font-medium text-sm">{slot.name}</span>
                                      </div>
                                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                        <span>
                                          {slot.day_type === 'weekday' && 'Dni powszednie'}
                                          {slot.day_type === 'weekend' && 'Weekendy'}
                                          {slot.day_type === 'all' && 'Wszystkie dni'}
                                        </span>
                                        <span>•</span>
                                        <span>{slot.start_time} - {slot.end_time}</span>
                                        <span>•</span>
                                        <span className="text-green-400 font-semibold">{slot.price_per_hour} zł/h</span>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleRemovePricingSlot(index)}
                                      className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add pricing slot form */}
                            {showPricingForm && (
                              <div className="space-y-3 bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-white">Nowy przedział cenowy</h4>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setShowPricingForm(false)
                                      resetPricingForm()
                                    }}
                                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-slate-300 text-xs">Nazwa *</Label>
                                  <Input
                                    value={newPricingName}
                                    onChange={(e) => setNewPricingName(e.target.value)}
                                    placeholder="np. Rano (6:00-14:00)"
                                    className="bg-slate-800 border-slate-600 text-white text-sm h-9"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-300 text-xs">Typ dni *</Label>
                                  <Select value={newPricingDayType} onValueChange={(value) => setNewPricingDayType(value as DayType)}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm h-9">
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

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-slate-300 text-xs">Od *</Label>
                                    <Input
                                      type="time"
                                      value={newPricingStartTime}
                                      onChange={(e) => setNewPricingStartTime(e.target.value)}
                                      className="bg-slate-800 border-slate-600 text-white text-sm h-9"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-slate-300 text-xs">Do *</Label>
                                    <Input
                                      type="time"
                                      value={newPricingEndTime}
                                      onChange={(e) => setNewPricingEndTime(e.target.value)}
                                      className="bg-slate-800 border-slate-600 text-white text-sm h-9"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-300 text-xs">Cena za godzinę (zł) *</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={newPricingPrice}
                                    onChange={(e) => setNewPricingPrice(parseFloat(e.target.value))}
                                    placeholder="100"
                                    className="bg-slate-800 border-slate-600 text-white text-sm h-9"
                                  />
                                </div>

                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleAddPricingSlot}
                                  disabled={!newPricingName}
                                  className="w-full bg-blue-600 hover:bg-blue-700 h-9"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Dodaj przedział
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
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
                            : editingCourt
                            ? 'Zaktualizuj'
                            : 'Dodaj kort'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {courtsLoading ? (
                <div className="text-center py-8 text-slate-400">Ładowanie kortów...</div>
              ) : courts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-1">Brak klubów/kortów</p>
                  <p className="text-sm mb-4">Dodaj swój pierwszy klub lub kort</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Klub</TableHead>
                      <TableHead className="text-slate-400">Cennik</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400 text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courts.map((court) => (
                      <React.Fragment key={court.id}>
                        <TableRow
                          className="border-slate-800 hover:bg-slate-800/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {court.avatar_url ? (
                                <img
                                  src={court.avatar_url}
                                  alt={court.club_name || court.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                                />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                                  style={{ backgroundColor: court.color || '#3b82f6' }}
                                >
                                  {(court.club_name || court.name).substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="text-white font-medium">
                                  {court.club_name || court.name}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {court.court_type === 'single' ? 'Single' : 'Double'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedCourtId(expandedCourtId === court.id ? null : court.id)}
                              className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              {expandedCourtId === court.id ? (
                                <ChevronUp className="h-4 w-4 mr-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mr-2" />
                              )}
                              {court.pricing?.length || 0} przedziałów
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                court.is_active
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }
                            >
                              {court.is_active ? 'Aktywny' : 'Nieaktywny'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(court)}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCourt(court)}
                                className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedCourtId === court.id && (
                          <TableRow className="border-slate-800">
                            <TableCell colSpan={4} className="p-6 bg-slate-900/50">
                              <CourtPricingManager
                                court={court}
                                onCreatePricing={createCourtPricing}
                                onUpdatePricing={updateCourtPricing}
                                onDeletePricing={deleteCourtPricing}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-600/10 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Building2 className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white mb-1">
                    💡 Wskazówka
                  </p>
                  <p>
                    Kluby/korty dodane tutaj będą dostępne podczas tworzenia usług. 
                    Cena za godzinę będzie automatycznie używana do kalkulacji kosztów.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4 mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Zarządzanie grupami treningowymi</CardTitle>
                  <CardDescription className="text-slate-400">
                    Organizuj klientów w grupy treningowe
                  </CardDescription>
                </div>
                <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj grupę
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <form onSubmit={handleSubmitGroup}>
                      <DialogHeader>
                        <DialogTitle className="text-white">Dodaj nową grupę</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Utwórz grupę treningową dla swoich klientów
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="group-name" className="text-slate-200">
                            Nazwa grupy *
                          </Label>
                          <Input
                            id="group-name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="np. Grupa Zaawansowana"
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="group-description" className="text-slate-200">
                            Opis
                          </Label>
                          <Textarea
                            id="group-description"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Opis grupy..."
                            rows={3}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="group-max-participants" className="text-slate-200">
                            Maksymalna liczba uczestników
                          </Label>
                          <Input
                            id="group-max-participants"
                            type="number"
                            min="1"
                            value={groupMaxParticipants}
                            onChange={(e) => setGroupMaxParticipants(parseInt(e.target.value))}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="group-color" className="text-slate-200">
                            Kolor
                          </Label>
                          <div className="flex gap-3 flex-wrap">
                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(
                              (color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setGroupColor(color)}
                                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                    groupColor === color
                                      ? 'border-white scale-110'
                                      : 'border-slate-700 hover:border-slate-500'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsGroupDialogOpen(false)}
                          disabled={groupFormLoading}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Anuluj
                        </Button>
                        <Button
                          type="submit"
                          disabled={groupFormLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {groupFormLoading ? 'Dodawanie...' : 'Dodaj grupę'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {groupsLoading ? (
                <div className="text-center py-8 text-slate-400">Ładowanie grup...</div>
              ) : groups.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-1">Brak grup</p>
                  <p className="text-sm mb-4">Dodaj swoją pierwszą grupę treningową</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Grupa</TableHead>
                      <TableHead className="text-slate-400">Opis</TableHead>
                      <TableHead className="text-slate-400">Max uczestników</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400 text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow
                        key={group.id}
                        className="border-slate-800 hover:bg-slate-800/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: group.color || '#3b82f6' }}
                            >
                              {group.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium">{group.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {group.description ? (
                            <span className="line-clamp-1">{group.description}</span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {group.max_participants || 'Bez limitu'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              group.is_active
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }
                          >
                            {group.is_active ? 'Aktywna' : 'Nieaktywna'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
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

          {/* Info Card */}
          <Card className="bg-purple-600/10 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Users className="h-5 w-5 text-purple-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white mb-1">
                    💡 Wskazówka
                  </p>
                  <p>
                    Grupy pozwalają organizować klientów według poziomu zaawansowania.
                    Możesz przypisać klientów do grup w sekcji Klienci.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-4 mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Zarządzanie pakietami</CardTitle>
                  <CardDescription className="text-slate-400">
                    Twórz pakiety treningów dla swoich klientów
                  </CardDescription>
                </div>
                <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj pakiet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <form onSubmit={handleSubmitPackage}>
                      <DialogHeader>
                        <DialogTitle className="text-white">Dodaj nowy pakiet</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Utwórz szablon pakietu treningów
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="package-name" className="text-slate-200">
                            Nazwa pakietu *
                          </Label>
                          <Input
                            id="package-name"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            placeholder="np. 4 Treningi"
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="package-description" className="text-slate-200">
                            Opis
                          </Label>
                          <Textarea
                            id="package-description"
                            value={packageDescription}
                            onChange={(e) => setPackageDescription(e.target.value)}
                            placeholder="Opis pakietu..."
                            rows={2}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="package-sessions" className="text-slate-200">
                              Liczba treningów *
                            </Label>
                            <Input
                              id="package-sessions"
                              type="number"
                              min="1"
                              value={packageSessionsCount}
                              onChange={(e) => setPackageSessionsCount(parseInt(e.target.value))}
                              required
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="package-price" className="text-slate-200">
                              Cena (zł) *
                            </Label>
                            <Input
                              id="package-price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={packagePrice}
                              onChange={(e) => setPackagePrice(parseFloat(e.target.value))}
                              required
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="package-validity" className="text-slate-200">
                            Ważność (dni)
                          </Label>
                          <Input
                            id="package-validity"
                            type="number"
                            min="1"
                            value={packageValidityDays}
                            onChange={(e) => setPackageValidityDays(e.target.value ? parseInt(e.target.value) : '')}
                            placeholder="Brak limitu"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                          <p className="text-xs text-slate-500">
                            Pozostaw puste dla pakietów bez daty wygaśnięcia
                          </p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPackageDialogOpen(false)}
                          disabled={packageFormLoading}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Anuluj
                        </Button>
                        <Button
                          type="submit"
                          disabled={packageFormLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {packageFormLoading ? 'Dodawanie...' : 'Dodaj pakiet'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {packagesLoading ? (
                <div className="text-center py-8 text-slate-400">Ładowanie pakietów...</div>
              ) : packages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <PackageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-1">Brak pakietów</p>
                  <p className="text-sm mb-4">Dodaj swój pierwszy pakiet treningów</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white text-lg">{pkg.name}</CardTitle>
                            {pkg.description && (
                              <CardDescription className="text-slate-400 mt-1">
                                {pkg.description}
                              </CardDescription>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                            className="text-slate-400 hover:text-red-400 hover:bg-slate-700 -mt-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Liczba treningów:</span>
                            <span className="text-white font-semibold">{pkg.sessions_count}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Cena:</span>
                            <span className="text-green-400 font-semibold text-lg">{pkg.price} zł</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Cena za trening:</span>
                            <span className="text-slate-300">{(pkg.price / pkg.sessions_count).toFixed(2)} zł</span>
                          </div>
                          {pkg.validity_days && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">Ważność:</span>
                              <span className="text-slate-300">{pkg.validity_days} dni</span>
                            </div>
                          )}
                          <Badge
                            variant="outline"
                            className={
                              pkg.is_active
                                ? 'bg-green-500/10 text-green-400 border-green-500/20 w-full justify-center'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20 w-full justify-center'
                            }
                          >
                            {pkg.is_active ? 'Aktywny' : 'Nieaktywny'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-green-600/10 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <PackageIcon className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white mb-1">
                    💡 Wskazówka
                  </p>
                  <p>
                    Pakiety pozwalają klientom kupować treningi z rabatem (np. 4 treningi za cenę 3.5).
                    Po zakupie pakietu, klient ma saldo treningów które jest automatycznie odejmowane po każdym odbytym treningu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
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
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4 mt-6">
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
          <Card className="bg-yellow-600/10 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <DollarSign className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white mb-1">
                    Funkcje w przygotowaniu
                  </p>
                  <p>
                    Pełne zarządzanie ustawieniami finansowymi, w tym automatyczne obliczanie podatków, 
                    będzie dostępne wkrótce.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}

