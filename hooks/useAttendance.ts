'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Attendance, AttendanceStatus } from '@/types'
import { toast } from 'sonner'

export function useAttendance() {
  const [loading, setLoading] = useState(false)

  const markAttendance = async (
    sessionId: string,
    clientId: string,
    clientPackageId: string | null,
    status: AttendanceStatus = 'present'
  ) => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          session_id: sessionId,
          client_id: clientId,
          client_package_id: clientPackageId,
          status: status,
          checked_in_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Obecność została zaznaczona')
      return data
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Błąd zaznaczania obecności')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeAttendance = async (attendanceId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId)

      if (error) throw error

      toast.success('Obecność została usunięta')
    } catch (error) {
      console.error('Error removing attendance:', error)
      toast.error('Błąd usuwania obecności')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    markAttendance,
    removeAttendance,
  }
}

