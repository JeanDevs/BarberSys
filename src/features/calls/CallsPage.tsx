import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  CalendarCheck,
  Check,
  FileText,
  Phone,
  PhoneCall,
  PhoneIncoming,
} from 'lucide-react'
import { useCalls } from '../../hooks/useData'
import { simulateCallBooking } from '../../lib/agent'
import { supabase } from '../../lib/supabase'
import { addDays, fmtDateLabel, fmtTime, localISO, timeAgo, SLOTS } from '../../lib/utils'
import { Badge, Button, Card, Dialog, Skeleton } from '../../components/ui'

const personas = [
  { name: 'Ricardo Mena', phone: '+51 901 234 567', service: 'Corte Clásico' },
  { name: 'Fernando Paz', phone: '+51 902 345 678', service: 'Corte + Barba' },
  { name: 'Óscar Valdez', phone: '+51 903 456 789', service: 'Diseño / Fade' },
  { name: 'Matías Rojas', phone: '+51 904 567 890', service: 'Afeitado Premium' },
]

type Stage = 'ringing' | 'talking' | 'processing' | 'done'

const STEPS: { key: Stage; label: string; icon: typeof Phone }[] = [
  { key: 'ringing', label: 'Llamando…', icon: PhoneIncoming },
  { key: 'talking', label: 'IA hablando', icon: Bot },
  { key: 'processing', label: 'Resumen generado', icon: FileText },
  { key: 'done', label: 'Reserva creada', icon: CalendarCheck },
]

export default function CallsPage() {
  const calls = useCalls()
  const [simOpen, setSimOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Llamadas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            El agente de voz atiende, resume y agenda automáticamente
          </p>
        </div>
        <Button onClick={() => setSimOpen(true)}>
          <PhoneCall size={15} />
          Simular llamada entrante
        </Button>
      </div>

      <div className="space-y-3">
        {calls.isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {(calls.data ?? []).map((c) => (
          <Card key={c.id} className="flex gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Phone size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-zinc-100">
                  {c.customers?.name ?? 'Cliente'}
                </p>
                <Badge color="green">{c.status}</Badge>
                {c.duration_seconds && (
                  <span className="text-xs text-zinc-500">
                    {Math.floor(c.duration_seconds / 60)}m {c.duration_seconds % 60}s
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-600">{timeAgo(c.created_at)}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{c.summary}</p>
            </div>
          </Card>
        ))}
      </div>

      {simOpen && <CallSimulator onClose={() => setSimOpen(false)} />}
    </div>
  )
}

function CallSimulator({ onClose }: { onClose: () => void }) {
  const [persona] = useState(() => personas[Math.floor(Math.random() * personas.length)])
  const [slot, setSlot] = useState('12:00')
  const [stage, setStage] = useState<Stage>('ringing')
  const [visibleLines, setVisibleLines] = useState(0)
  const [summary, setSummary] = useState('')
  const bookedRef = useRef(false)
  const date = addDays(localISO(), 1)

  const script = [
    { who: 'ia', text: 'Barbería BarberAI, ¿en qué puedo ayudarte? 💈' },
    { who: 'cliente', text: `Hola, quiero reservar un ${persona.service.toLowerCase()} para mañana.` },
    { who: 'ia', text: `Claro que sí. Mañana tengo espacio a las ${slot}. ¿Te parece bien?` },
    { who: 'cliente', text: 'Sí, perfecto.' },
    { who: 'ia', text: '¿A nombre de quién registro la cita?' },
    { who: 'cliente', text: `${persona.name}.` },
    { who: 'ia', text: `Listo ${persona.name.split(' ')[0]}, tu cita quedó confirmada para mañana a las ${slot}. ¡Te esperamos!` },
  ]

  // Find a free slot for tomorrow, then ring
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date)
        .neq('status', 'cancelada')
      if (cancelled) return
      const taken = new Set((data ?? []).map((a) => a.time.slice(0, 5)))
      const free = SLOTS.find((s) => !taken.has(s))
      if (free) setSlot(free)
      setTimeout(() => !cancelled && setStage('talking'), 2000)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reveal transcript lines
  useEffect(() => {
    if (stage !== 'talking') return
    if (visibleLines >= script.length) {
      const t = setTimeout(() => setStage('processing'), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, visibleLines])

  // Create the real booking via the agent
  useEffect(() => {
    if (stage !== 'processing' || bookedRef.current) return
    bookedRef.current = true
    simulateCallBooking({
      name: persona.name,
      phone: persona.phone,
      service: persona.service,
      date,
      time: slot,
    })
      .then((res) => {
        setSummary(res.summary)
        setStage('done')
      })
      .catch(() => {
        setSummary('No se pudo registrar la llamada. Revisa la conexión con el agente.')
        setStage('done')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  const stageIndex = STEPS.findIndex((s) => s.key === stage)

  return (
    <Dialog open onClose={onClose} title="Llamada entrante — Agente de voz IA" wide>
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        {/* Timeline */}
        <div className="space-y-1">
          {STEPS.map(({ key, label, icon: Icon }, i) => {
            const done = i < stageIndex || stage === 'done'
            const active = i === stageIndex && stage !== 'done'
            return (
              <div key={key} className="flex items-center gap-3 py-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                    done
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      : active
                        ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                        : 'border-white/[0.08] text-zinc-600'
                  } ${active && key === 'ringing' ? 'pulse-ring' : ''}`}
                >
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span
                  className={`text-xs ${done ? 'text-emerald-400' : active ? 'font-medium text-zinc-100' : 'text-zinc-600'}`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {stage === 'ringing' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-10">
              <div className="pulse-ring flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                <PhoneIncoming size={26} />
              </div>
              <p className="text-sm font-medium text-zinc-100">{persona.phone}</p>
              <p className="text-xs text-zinc-500">Llamada entrante… la IA está contestando</p>
            </div>
          )}

          {(stage === 'talking' || stage === 'processing' || stage === 'done') && (
            <div className="space-y-3">
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-white/[0.06] bg-zinc-950/60 p-3">
                {script.slice(0, stage === 'talking' ? visibleLines : script.length).map((l, i) => (
                  <div key={i} className="fade-in-up flex gap-2 text-sm">
                    <span
                      className={`shrink-0 text-xs font-semibold ${l.who === 'ia' ? 'text-blue-400' : 'text-zinc-400'}`}
                    >
                      {l.who === 'ia' ? '🤖 IA' : '👤'}
                    </span>
                    <span className="text-zinc-300">{l.text}</span>
                  </div>
                ))}
                {stage === 'talking' && visibleLines < script.length && (
                  <div className="flex items-center gap-1.5 pl-1">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  </div>
                )}
              </div>

              {stage === 'processing' && (
                <div className="fade-in-up flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-300">
                  <FileText size={15} />
                  Generando resumen y registrando la reserva…
                </div>
              )}

              {stage === 'done' && (
                <>
                  <div className="fade-in-up rounded-lg border border-white/[0.08] bg-zinc-900 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Resumen IA
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-300">{summary}</p>
                  </div>
                  <div className="fade-in-up flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    <CalendarCheck size={15} />
                    Reserva creada: {persona.service} · {fmtDateLabel(date)} {fmtTime(slot)} — ya
                    visible en el dashboard
                  </div>
                  <Button onClick={onClose} variant="secondary" className="mt-2 w-full">
                    Cerrar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
