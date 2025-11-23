'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Package } from '@/types'
import { toast } from 'sonner'

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPackages = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('user_id', user.id)
        .order('sessions_count', { ascending: true })

      if (error) throw error

      setPackages(data || [])
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast.error('Błąd pobierania pakietów')
    } finally {
      setLoading(false)
    }
  }

  const createPackage = async (packageData: Omit<Package, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('packages')
        .insert([{ ...packageData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setPackages(prev => [...prev, data])
      toast.success('Pakiet został utworzony')
      return data
    } catch (error) {
      console.error('Error creating package:', error)
      toast.error('Błąd tworzenia pakietu')
      throw error
    }
  }

  const updatePackage = async (id: string, packageData: Partial<Package>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('packages')
        .update(packageData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPackages(prev => prev.map(p => p.id === id ? data : p))
      toast.success('Pakiet został zaktualizowany')
      return data
    } catch (error) {
      console.error('Error updating package:', error)
      toast.error('Błąd aktualizacji pakietu')
      throw error
    }
  }

  const deletePackage = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPackages(prev => prev.filter(p => p.id !== id))
      toast.success('Pakiet został usunięty')
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error('Błąd usuwania pakietu')
      throw error
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  return {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    refetch: fetchPackages,
  }
}


