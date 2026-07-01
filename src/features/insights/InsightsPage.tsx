import { Clock, Lightbulb, RefreshCcw, Sparkles, TrendingUp } from 'lucide-react'
import { useAllAppointments, useCalls } from '../../hooks/useData'
import { addDays, fmtTime, localISO, SLOTS } from '../../lib/utils'
import { Card, Skeleton } from '../../components/ui'

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function InsightsPage() {
  const appts = useAllAppointments()
  const calls = useCalls()

  const today = localISO()
  const data = (appts.data ?? []).filter((a) => a.status !== 'cancelada')

  const thisWeek = data.filter((a) => a.date > addDays(today, -7) && a.date <= today).length
  const lastWeek = data.filter((a) => a.date > addDays(today, -14) && a.date <= addDays(today, -7)).length
  const delta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 100

  const recovered = (calls.data ?? []).filter((c) => /reactivaci/i.test(c.summary ?? '')).length

  const hourCount = new Map<string, number>()
  data.forEach((a) => hourCount.set(fmtTime(a.time), (hourCount.get(fmtTime(a.time)) ?? 0) + 1))
  const peak = [...hourCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const bookedToday = new Set(
    data.filter((a) => a.date === today).map((a) => fmtTime(a.time)),
  )
  const freeToday = SLOTS.filter((s) => !bookedToday.has(s))

  // Demand per weekday (Mon–Sat)
  const dayCount = new Array(7).fill(0)
  data.forEach((a) => dayCount[new Date(a.date + 'T12:00:00').getDay()]++)
  const workdays = [1, 2, 3, 4, 5, 6]
  const slowest = workdays.reduce((min, d) => (dayCount[d] < dayCount[min] ? d : min), 1)

  // Last 14 days chart
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const perDay = days.map((d) => data.filter((a) => a.date === d).length)
  const max = Math.max(...perDay, 1)

  const cards = [
    {
      icon: TrendingUp,
      label: 'Reservas esta semana',
      value: `${delta >= 0 ? '+' : ''}${delta}%`,
      sub: `${thisWeek} vs ${lastWeek} la semana pasada`,
      color: delta >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10',
    },
    {
      icon: RefreshCcw,
      label: 'Clientes recuperados',
      value: String(recovered),
      sub: 'reactivados por la IA este mes',
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      icon: Clock,
      label: 'Hora pico',
      value: peak,
      sub: 'mayor demanda de reservas',
      color: 'text-violet-400 bg-violet-500/10',
    },
    {
      icon: Sparkles,
      label: 'Horas libres hoy',
      value: String(freeToday.length),
      sub: freeToday.slice(0, 3).join(', ') || 'agenda completa 🎉',
      color: 'text-amber-400 bg-amber-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Insights IA</h1>
        <p className="mt-1 text-sm text-zinc-500">Métricas y recomendaciones generadas con tus datos</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {appts.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : cards.map(({ icon: Icon, label, value, sub, color }) => (
              <Card key={label} className="p-5">
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={17} />
                </div>
                <p className="text-2xl font-bold text-zinc-100">{value}</p>
                <p className="mt-1 text-xs font-medium text-zinc-400">{label}</p>
                <p className="mt-0.5 text-[11px] text-zinc-600">{sub}</p>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-5 text-sm font-semibold text-zinc-100">Reservas · últimos 14 días</h2>
          <div className="flex h-40 items-end gap-1.5">
            {perDay.map((n, i) => (
              <div key={i} className="group relative flex-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600/60 to-blue-400/80 transition group-hover:from-blue-500 group-hover:to-blue-300"
                  style={{ height: `${Math.max((n / max) * 152, 4)}px` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-200 opacity-0 transition group-hover:opacity-100">
                  {n}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
            <span>hace 14 días</span>
            <span>hoy</span>
          </div>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-transparent p-5">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
            <Lightbulb size={17} />
          </div>
          <h2 className="text-sm font-semibold text-zinc-100">Recomendación IA</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            Los <span className="font-semibold text-blue-300">{WEEKDAYS[slowest].toLowerCase()}s</span>{' '}
            tienen poca demanda ({dayCount[slowest]} reservas registradas).
          </p>
          <div className="mt-3 rounded-lg border border-white/[0.08] bg-zinc-900/80 p-3">
            <p className="text-xs font-medium text-zinc-200">💡 Sugerencia</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Crea una promoción "{WEEKDAYS[slowest]} 2x1 en Corte + Barba" y deja que la IA la
              ofrezca automáticamente a clientes inactivos por WhatsApp.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
