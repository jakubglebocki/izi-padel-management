'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GroupSession } from '@/types'
import { toast } from 'sonner'

export function useGroupSessions(groupId?: string) {
  const [sessions, setSessions] = useState<GroupSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      let query = supabase
        .from('group_sessions')
        .select(`
          *,
          group:groups(*),
          court:courts(*),
          attendance:attendance(
            *,
            client:clients(*)
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (groupId) {
        query = query.eq('group_id', groupId)
      }

      const { data, error} = await query

      if (error) throw error

      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Błąd pobierania sesji')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async (sessionData: Omit<GroupSession, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'attendance'>) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('group_sessions')
        .insert([{ ...sessionData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setSessions(prev => [...prev, data])
      toast.success('Trening został utworzony')
      return data
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Błąd tworzenia treningu')
      throw error
    }
  }

  const deleteSession = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('group_sessions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSessions(prev => prev.filter(s => s.id !== id))
      toast.success('Trening został usunięty')
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Błąd usuwania treningu')
      throw error
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [groupId])

  return {
    sessions,
    loading,
    createSession,
    deleteSession,
    refetch: fetchSessions,
  }
}

