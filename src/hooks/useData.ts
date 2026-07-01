import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { localISO } from '../lib/utils'
import type {
  Appointment,
  Barber,
  Call,
  Conversation,
  Customer,
  Message,
  Service,
  Settings,
} from '../types'

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      const { data, error } = await supabase.from('customers').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}

export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: ['appointments', 'date', date],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, customers(name)')
        .eq('date', date)
        .order('time')
      if (error) throw error
      return data
    },
  })
}

export function useAllAppointments() {
  return useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, customers(name)')
        .order('date', { ascending: false })
        .order('time', { ascending: false })
        .limit(200)
      if (error) throw error
      return data
    },
  })
}

export function useRecentAppointments(limit = 6) {
  return useQuery({
    queryKey: ['appointments', 'recent', limit],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, customers(name)')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data
    },
  })
}

export function useCustomerAppointments(customerId: string | null) {
  return useQuery({
    queryKey: ['appointments', 'customer', customerId],
    enabled: !!customerId,
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_id', customerId!)
        .order('date', { ascending: false })
        .limit(10)
      if (error) throw error
      return data
    },
  })
}

export function useCalls() {
  return useQuery({
    queryKey: ['calls'],
    queryFn: async (): Promise<Call[]> => {
      const { data, error } = await supabase
        .from('calls')
        .select('*, customers(name)')
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data
    },
  })
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, customers(name, phone)')
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data
    },
  })
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId!)
        .order('created_at')
      if (error) throw error
      return data
    },
  })
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase.from('services').select('*').order('price')
      if (error) throw error
      return data
    },
  })
}

export function useBarbers() {
  return useQuery({
    queryKey: ['barbers'],
    queryFn: async (): Promise<Barber[]> => {
      const { data, error } = await supabase.from('barbers').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Settings | null> => {
      const { data, error } = await supabase.from('settings').select('*').maybeSingle()
      if (error) throw error
      return data
    },
  })
}

export interface Kpis {
  today: number
  customers: number
  aiBookings: number
  aiCalls: number
}

export function useKpis() {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: async (): Promise<Kpis> => {
      const today = localISO()
      const [t, c, ai, calls] = await Promise.all([
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('date', today)
          .neq('status', 'cancelada'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .in('source', ['whatsapp', 'llamada']),
        supabase.from('calls').select('id', { count: 'exact', head: true }),
      ])
      return {
        today: t.count ?? 0,
        customers: c.count ?? 0,
        aiBookings: ai.count ?? 0,
        aiCalls: calls.count ?? 0,
      }
    },
  })
}
