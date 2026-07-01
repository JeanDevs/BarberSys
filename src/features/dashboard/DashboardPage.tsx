import { Bot, CalendarDays, MessageCircle, Phone, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useCalls,
  useKpis,
  useAppointmentsByDate,
  useRecentAppointments,
} from '../../hooks/useData'
import { Badge, Card, Skeleton, statusBadgeColor } from '../../components/ui'
import { fmtDateLabel, fmtTime, localISO, timeAgo, SLOTS } from '../../lib/utils'

const kpiDefs = [
  { key: 'today', label: 'Reservas Hoy', icon: CalendarDays, color: 'text-blue-400 bg-blue-500/10' },
  { key: 'customers', label: 'Clientes', icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
  { key: 'aiBookings', label: 'Reservas IA', icon: Bot, color: 'text-violet-400 bg-violet-500/10' },
  { key: 'aiCalls', label: 'Llamadas IA', icon: Phone, color: 'text-amber-400 bg-amber-500/10' },
] as const

export default function DashboardPage() {
  const kpis = useKpis()
  const today = useAppointmentsByDate(localISO())
  const recent = useRecentAppointments(6)
  const calls = useCalls()

  const activity = [
    ...(recent.data ?? []).map((a) => ({
      id: `a-${a.id}`,
      icon: a.source === 'llamada' ? Phone : a.source === 'whatsapp' ? MessageCircle : CalendarDays,
      text: `Reserva ${a.status}: ${a.customers?.name ?? 'Cliente'} · ${a.service}`,
      when: a.created_at,
    })),
    ...(calls.data ?? []).slice(0, 4).map((c) => ({
      id: `c-${c.id}`,
      icon: Phone,
      text: `Llamada IA · ${c.customers?.name ?? 'Cliente'}`,
      when: c.created_at,
    })),
  ]
    .sort((x, y) => (x.when < y.when ? 1 : -1))
    .slice(0, 7)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">{fmtDateLabel(localISO())} · actualizado en tiempo real</p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 md:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Realtime
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiDefs.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="p-5">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon size={17} />
            </div>
            {kpis.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-zinc-100">{kpis.data?.[key] ?? 0}</p>
            )}
            <p className="mt-1 text-xs text-zinc-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Today's calendar */}
        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100">Calendario de hoy</h2>
            <Link to="/app/agenda" className="text-xs text-blue-400 hover:underline">
              Ver agenda →
            </Link>
          </div>
          <div className="space-y-1.5">
            {SLOTS.map((slot) => {
              const appt = today.data?.find((a) => fmtTime(a.time) === slot && a.status !== 'cancelada')
              return (
                <div
                  key={slot}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                    appt
                      ? 'border-blue-500/20 bg-blue-500/5'
                      : 'border-white/[0.04] bg-transparent'
                  }`}
                >
                  <span className="w-11 shrink-0 font-mono text-xs text-zinc-500">{slot}</span>
                  {appt ? (
                    <>
                      <span className="truncate font-medium text-zinc-200">
                        {appt.customers?.name ?? 'Cliente'}
                      </span>
                      <Badge color={statusBadgeColor(appt.status)} className="ml-auto shrink-0">
                        {appt.status}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-zinc-600">Libre</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent bookings */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-100">Últimas reservas</h2>
          <div className="space-y-3">
            {recent.isLoading &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            {(recent.data ?? []).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                  {(a.customers?.name ?? '?').slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {a.customers?.name ?? 'Cliente'}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {a.service} · {fmtDateLabel(a.date)} {fmtTime(a.time)}
                  </p>
                </div>
                <Badge color={statusBadgeColor(a.status)} className="shrink-0">
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-100">Actividad reciente</h2>
          <div className="space-y-4">
            {(kpis.isLoading || recent.isLoading) &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            {activity.map(({ id, icon: Icon, text, when }) => (
              <div key={id} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Icon size={13} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-zinc-300">{text}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">{timeAgo(when)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
