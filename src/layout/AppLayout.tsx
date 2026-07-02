import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Phone,
  Scissors,
  Settings,
  Sparkles,
  Users,
  X,
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

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_16px_rgba(59,130,246,0.4)]">
        <Scissors size={16} className="text-white" />
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-bold leading-none text-zinc-100">BarberAI</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">Recepcionista IA</p>
        </div>
      )}
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
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
  )
}

function StatusPill() {
  return (
    <div className="border-t border-white/[0.06] p-4">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <p className="text-xs text-emerald-400">IA activa 24/7</p>
      </div>
    </div>
  )
}

export default function AppLayout() {
  useRealtimeSync()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the drawer on navigation
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/[0.06] bg-zinc-950/80 md:flex">
        <Brand />
        <NavLinks />
        <StatusPill />
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-zinc-950/95 px-4 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_16px_rgba(59,130,246,0.4)]">
            <Scissors size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-zinc-100">BarberAI</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-300 transition hover:bg-zinc-800 active:scale-95"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-50 md:hidden', open ? '' : 'pointer-events-none')}>
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between pr-3">
            <Brand />
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              <X size={18} />
            </button>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
          <StatusPill />
        </aside>
      </div>

      <main className="pt-14 md:ml-60 md:pt-0">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
