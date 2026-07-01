export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  visits: number
  last_visit: string | null
  status: 'activo' | 'inactivo'
  created_at: string
}

export interface Appointment {
  id: string
  customer_id: string
  service: string
  date: string
  time: string
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  source: 'whatsapp' | 'llamada' | 'manual'
  created_at: string
  customers?: { name: string } | null
}

export interface Conversation {
  id: string
  customer_id: string | null
  channel: string
  created_at: string
  customers?: { name: string; phone: string } | null
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Call {
  id: string
  customer_id: string | null
  status: string
  summary: string | null
  duration_seconds: number | null
  created_at: string
  customers?: { name: string } | null
}

export interface Service {
  id: string
  name: string
  duration_min: number
  price: number
}

export interface Barber {
  id: string
  name: string
  active: boolean
}

export interface Settings {
  id: number
  business_name: string
  open_time: string
  close_time: string
  slot_minutes: number
}
