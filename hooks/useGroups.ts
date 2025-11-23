'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Group } from '@/types'
import { toast } from 'sonner'

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGroups = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error

      setGroups(data || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Błąd pobierania grup')
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (groupData: Omit<Group, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('groups')
        .insert([{ ...groupData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      setGroups(prev => [...prev, data])
      toast.success('Grupa została utworzona')
      return data
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Błąd tworzenia grupy')
      throw error
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return {
    groups,
    loading,
    createGroup,
    refetch: fetchGroups,
  }
}


