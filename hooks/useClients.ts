'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types'
import { toast } from 'sonner'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast.error('Błąd pobierania klientów')
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setClients(prev => [data, ...prev])
      toast.success('Klient został dodany')
      return data
    } catch (error) {
      console.error('Error creating client:', error)
      toast.error('Błąd dodawania klienta')
      throw error
    }
  }

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setClients(prev => prev.map(c => c.id === id ? data : c))
      toast.success('Klient został zaktualizowany')
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      toast.error('Błąd aktualizacji klienta')
      throw error
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error

      setClients(prev => prev.filter(c => c.id !== id))
      toast.success('Klient został usunięty')
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Błąd usuwania klienta')
      throw error
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  }
}

