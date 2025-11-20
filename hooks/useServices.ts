'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/types'
import { toast } from 'sonner'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Błąd pobierania usług')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData: Omit<Service, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('services')
        .insert([{ ...serviceData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setServices(prev => [data, ...prev])
      toast.success('Usługa została utworzona')
      return data
    } catch (error) {
      console.error('Error creating service:', error)
      toast.error('Błąd tworzenia usługi')
      throw error
    }
  }

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setServices(prev => prev.map(s => s.id === id ? data : s))
      toast.success('Usługa została zaktualizowana')
      return data
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error('Błąd aktualizacji usługi')
      throw error
    }
  }

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Usługa została usunięta')
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Błąd usuwania usługi')
      throw error
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  }
}

