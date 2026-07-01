import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  LayoutDashboard,
  MessageCircle,
  Phone,
  Repeat,
  Scissors,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: CalendarCheck,
    title: 'Agenda automática',
    desc: 'La IA consulta disponibilidad y agenda citas sin intervención humana.',
  },
  {
    icon: MessageCircle,
    title: 'Atención por WhatsApp',
    desc: 'Responde al instante, 24/7. Ningún mensaje se queda sin contestar.',
  },
  {
    icon: Phone,
    title: 'Reservas por llamada',
    desc: 'Un agente de voz atiende el teléfono y registra la reserva.',
  },
  {
    icon: ShieldCheck,
    title: 'Confirmaciones automáticas',
    desc: 'Recordatorios 24h antes: confirmar, reprogramar o cancelar.',
  },
  {
    icon: Repeat,
    title: 'Clientes recurrentes',
    desc: 'Detecta clientes inactivos y los recupera con mensajes y llamadas.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_16px_rgba(59,130,246,0.4)]">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold">BarberAI</span>
        </div>
        <Link
          to="/app"
          className="rounded-lg border border-white/[0.08] bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
        >
          Dashboard
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 text-center md:pt-24">
          <div className="fade-in-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
            <Zap size={12} />
            Recepcionista con Inteligencia Artificial
          </div>
          <h1 className="fade-in-up bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            BarberAI
          </h1>
          <p className="fade-in-up mx-auto mt-5 max-w-xl text-lg text-zinc-400 md:text-xl" style={{ animationDelay: '0.1s' }}>
            El recepcionista inteligente que nunca duerme.
          </p>
          <p className="fade-in-up mt-2 text-sm font-medium text-blue-400" style={{ animationDelay: '0.15s' }}>
            Nunca pierdas otra reserva.
          </p>
          <div className="fade-in-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/app/conversaciones"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:bg-blue-500"
            >
              Ver Demo
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="fade-in-up group rounded-xl border border-white/[0.07] bg-zinc-900/60 p-6 transition hover:border-blue-500/30 hover:bg-zinc-900"
              style={{ animationDelay: `${0.25 + i * 0.06}s` }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition group-hover:scale-110">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">✅ {title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
          <div className="fade-in-up flex flex-col justify-center rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-600/15 to-transparent p-6" style={{ animationDelay: '0.55s' }}>
            <p className="text-3xl font-extrabold text-white">+18%</p>
            <p className="mt-1 text-sm text-zinc-400">
              más reservas esta semana con atención automática 24/7
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-zinc-600">
        BarberAI · SaaS de agentes IA para negocios con reservas — barberías, salones, clínicas y más.
      </footer>
    </div>
  )
}
