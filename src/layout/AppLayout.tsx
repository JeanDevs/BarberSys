import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Scissors,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useRealtimeSync } from '../hooks/useRealtime'

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/app/clientes', label: 'Clientes', icon: Users },
  { to: '/app/conversaciones', label: 'Conversaciones', icon: MessageSquare },
  { to: '/app/llamadas', label: 'Llamadas', icon: Phone },
  { to: '/app/insights', label: 'Insights IA', icon: Sparkles },
  { to: '/app/configuracion', label: 'Configuración', icon: Settings },
]

export default function AppLayout() {
  useRealtimeSync()

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/[0.06] bg-zinc-950/80 md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_16px_rgba(59,130,246,0.4)]">
            <Scissors size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-zinc-100">BarberAI</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">Recepcionista IA</p>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-500/10 font-medium text-blue-400'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="text-xs text-emerald-400">IA activa 24/7</p>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-1 overflow-x-auto border-b border-white/[0.06] bg-zinc-950/95 px-3 py-2 backdrop-blur md:hidden">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs',
                isActive ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-400',
              )
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 pt-14 md:ml-60 md:pt-0">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
