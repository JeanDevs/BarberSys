import { supabase } from './supabase'
import type { Appointment, Call, Customer } from '../types'

interface ChatResponse {
  conversation_id: string
  reply: string
  appointment: Appointment | null
  customer: Customer | null
}

export async function sendChatMessage(params: {
  phone: string
  message: string
  conversation_id?: string | null
}): Promise<ChatResponse> {
  const { data, error } = await supabase.functions.invoke('barberai-agent', {
    body: { action: 'chat', ...params },
  })
  if (error) throw error
  return data as ChatResponse
}

export async function simulateCallBooking(params: {
  name: string
  phone: string
  service: string
  date: string
  time: string
}): Promise<{ customer: Customer; appointment: Appointment; call: Call; summary: string }> {
  const { data, error } = await supabase.functions.invoke('barberai-agent', {
    body: { action: 'call_booking', ...params },
  })
  if (error) throw error
  return data
}

export async function sendOutreach(params: {
  customer_id: string
  channel: 'whatsapp' | 'llamada'
}): Promise<{ conversation_id?: string; message?: string; summary?: string }> {
  const { data, error } = await supabase.functions.invoke('barberai-agent', {
    body: { action: 'outreach', ...params },
  })
  if (error) throw error
  return data
}
