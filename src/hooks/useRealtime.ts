import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { fmtDateLabel, fmtTime } from '../lib/utils'
import { useToast } from '../components/toast'
import type { Appointment, Call } from '../types'

const sourceLabel: Record<string, string> = {
  whatsapp: 'WhatsApp',
  llamada: 'Llamada IA',
  manual: 'Manual',
}

/** Live sync: any DB change refreshes queries; inserts fire demo-friendly toasts. */
export function useRealtimeSync() {
  const qc = useQueryClient()
  const toast = useToast()

  useEffect(() => {
    const channel = supabase
      .channel('barberai-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          qc.invalidateQueries()
          if (payload.eventType === 'INSERT') {
            const a = payload.new as Appointment
            toast({
              title: '💈 Nueva reserva creada',
              description: `${a.service} · ${fmtDateLabel(a.date)} ${fmtTime(a.time)} · vía ${sourceLabel[a.source] ?? a.source}`,
            })
          }
        },
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'calls' }, (payload) => {
        qc.invalidateQueries()
        const c = payload.new as Call
        toast({ title: '📞 Llamada IA registrada', description: c.summary ?? undefined })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        qc.invalidateQueries({ queryKey: ['messages'] })
        qc.invalidateQueries({ queryKey: ['conversations'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        qc.invalidateQueries({ queryKey: ['customers'] })
        qc.invalidateQueries({ queryKey: ['kpis'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        qc.invalidateQueries({ queryKey: ['conversations'] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc, toast])
}
