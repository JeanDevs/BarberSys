import { clsx, type ClassValue } from 'clsx'

/** Bookable slots (13:00/14:00 = lunch break) — mirrors the agent's availability tool */
export const SLOTS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00']

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Local ISO date (YYYY-MM-DD) — avoids UTC shift in the evening */
export function localISO(d = new Date()): string {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localISO(d)
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function fmtDateLabel(iso: string): string {
  const today = localISO()
  if (iso === today) return 'Hoy'
  if (iso === addDays(today, 1)) return 'Mañana'
  if (iso === addDays(today, -1)) return 'Ayer'
  const d = new Date(iso + 'T12:00:00')
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function fmtTime(t: string): string {
  return t.slice(0, 5)
}

export function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'hace un momento'
  const m = Math.floor(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'hace 1 día' : `hace ${d} días`
}
