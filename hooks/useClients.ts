'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types'
import { toast } from 'sonner'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClients = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      console.log('🔐 Auth check:', { user: user?.id, email: user?.email, authError })
      
      if (!user) {
        console.error('❌ User not authenticated')
        toast.error('Musisz być zalogowany aby zobaczyć klientów')
        setClients([])
        return
      }

      console.log('📊 Fetching clients for user:', user.id)

      // First try with groups join
      let { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          group:groups!left(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('📋 Query result:', { dataCount: data?.length, error })

      // If error about missing table/relation, try without join
      if (error && (error.message?.includes('relation') || error.code === 'PGRST116' || error.message?.includes('does not exist'))) {
        console.log('⚠️ Groups table not found, fetching clients without join...')
        const result = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (result.error) {
          console.error('❌ Fallback query error:', result.error)
          throw result.error
        }
        data = result.data
        error = null
        console.log('✅ Fallback query success:', { dataCount: data?.length })
      }

      if (error) {
        console.error('❌ Query error:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('✅ Clients loaded:', data?.length || 0)
      setClients(data || [])
    } catch (error: any) {
      console.error('❌ Error fetching clients:', error)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      toast.error(`Błąd pobierania klientów: ${error?.message || 'Nieznany błąd'}`)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const createClientRecord = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = createClient()
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
      const supabase = createClient()
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
      const supabase = createClient()
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
    createClient: createClientRecord,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  }
}

