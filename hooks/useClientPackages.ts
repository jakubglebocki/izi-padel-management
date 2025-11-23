'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ClientPackage } from '@/types'
import { toast } from 'sonner'

export function useClientPackages(clientId?: string) {
  const [clientPackages, setClientPackages] = useState<ClientPackage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClientPackages = async () => {
    try {
      const supabase = createClient()
      setLoading(true)
      
      let query = supabase
        .from('client_packages')
        .select(`
          *,
          package:packages(*),
          client:clients(id, first_name, last_name)
        `)
        .order('purchase_date', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) throw error

      setClientPackages(data || [])
    } catch (error) {
      console.error('Error fetching client packages:', error)
      toast.error('Błąd pobierania pakietów klientów')
    } finally {
      setLoading(false)
    }
  }

  const purchasePackage = async (
    clientId: string,
    packageId: string,
    amountPaid?: number
  ) => {
    try {
      const supabase = createClient()
      
      // Get package details
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single()

      if (packageError) throw packageError

      // Calculate expiry date if validity_days is set
      let expiryDate = null
      if (packageData.validity_days) {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + packageData.validity_days)
        expiryDate = expiry.toISOString()
      }

      const { data, error } = await supabase
        .from('client_packages')
        .insert([{
          client_id: clientId,
          package_id: packageId,
          sessions_remaining: packageData.sessions_count,
          sessions_total: packageData.sessions_count,
          expiry_date: expiryDate,
          amount_paid: amountPaid || packageData.price,
          status: 'active'
        }])
        .select(`
          *,
          package:packages(*),
          client:clients(id, first_name, last_name)
        `)
        .single()

      if (error) throw error

      setClientPackages(prev => [data, ...prev])
      toast.success('Pakiet został zakupiony')
      return data
    } catch (error) {
      console.error('Error purchasing package:', error)
      toast.error('Błąd zakupu pakietu')
      throw error
    }
  }

  useEffect(() => {
    fetchClientPackages()
  }, [clientId])

  return {
    clientPackages,
    loading,
    purchasePackage,
    refetch: fetchClientPackages,
  }
}


