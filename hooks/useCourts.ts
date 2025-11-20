'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Court, CourtPricing } from '@/types'
import { toast } from 'sonner'

export function useCourts() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourts = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('courts')
        .select(`
          *,
          pricing:court_pricing(*)
        `)
        .eq('user_id', user.id)
        .order('display_order', { ascending: true })

      if (error) throw error

      setCourts(data || [])
    } catch (error) {
      console.error('Error fetching courts:', error)
      toast.error('Błąd pobierania kortów')
    } finally {
      setLoading(false)
    }
  }

  const createCourt = async (courtData: Omit<Court, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('courts')
        .insert([{ ...courtData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setCourts(prev => [data, ...prev])
      toast.success('Kort został utworzony')
      return data
    } catch (error) {
      console.error('Error creating court:', error)
      toast.error('Błąd tworzenia kortu')
      throw error
    }
  }

  const updateCourt = async (id: string, courtData: Partial<Court>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('courts')
        .update(courtData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setCourts(prev => prev.map(c => c.id === id ? data : c))
      toast.success('Kort został zaktualizowany')
      return data
    } catch (error) {
      console.error('Error updating court:', error)
      toast.error('Błąd aktualizacji kortu')
      throw error
    }
  }

  const deleteCourt = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('courts')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCourts(prev => prev.filter(c => c.id !== id))
      toast.success('Kort został usunięty')
    } catch (error) {
      console.error('Error deleting court:', error)
      toast.error('Błąd usuwania kortu')
      throw error
    }
  }

  // Court Pricing functions
  const createCourtPricing = async (courtId: string, pricingData: Omit<CourtPricing, 'id' | 'court_id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('court_pricing')
        .insert([{ ...pricingData, court_id: courtId }])
        .select()
        .single()

      if (error) throw error

      // Update courts state to include new pricing
      setCourts(prev => prev.map(court => {
        if (court.id === courtId) {
          return {
            ...court,
            pricing: [...(court.pricing || []), data]
          }
        }
        return court
      }))

      toast.success('Cennik został dodany')
      return data
    } catch (error) {
      console.error('Error creating court pricing:', error)
      toast.error('Błąd dodawania cennika')
      throw error
    }
  }

  const updateCourtPricing = async (id: string, pricingData: Partial<CourtPricing>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('court_pricing')
        .update(pricingData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update courts state
      setCourts(prev => prev.map(court => ({
        ...court,
        pricing: court.pricing?.map(p => p.id === id ? data : p)
      })))

      toast.success('Cennik został zaktualizowany')
      return data
    } catch (error) {
      console.error('Error updating court pricing:', error)
      toast.error('Błąd aktualizacji cennika')
      throw error
    }
  }

  const deleteCourtPricing = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('court_pricing')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update courts state
      setCourts(prev => prev.map(court => ({
        ...court,
        pricing: court.pricing?.filter(p => p.id !== id)
      })))

      toast.success('Cennik został usunięty')
    } catch (error) {
      console.error('Error deleting court pricing:', error)
      toast.error('Błąd usuwania cennika')
      throw error
    }
  }

  useEffect(() => {
    fetchCourts()
  }, [])

  return {
    courts,
    loading,
    createCourt,
    updateCourt,
    deleteCourt,
    createCourtPricing,
    updateCourtPricing,
    deleteCourtPricing,
    refetch: fetchCourts,
  }
}

