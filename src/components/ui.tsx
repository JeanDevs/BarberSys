import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-white/[0.07] bg-zinc-900/60', className)}
      {...props}
    />
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]',
  secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/[0.08]',
  ghost: 'text-zinc-300 hover:bg-zinc-800/80',
  danger: 'bg-red-600/90 text-white hover:bg-red-500',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-9 px-4 text-sm',
        size === 'lg' && 'h-11 px-6 text-base',
        buttonStyles[variant],
        className,
      )}
      {...props}
    />
  )
}

const badgeStyles: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  zinc: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export function Badge({
  color = 'zinc',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { color?: keyof typeof badgeStyles }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        badgeStyles[color],
        className,
      )}
      {...props}
    />
  )
}

export function statusBadgeColor(status: string): keyof typeof badgeStyles {
  switch (status) {
    case 'confirmada':
      return 'blue'
    case 'completada':
      return 'green'
    case 'pendiente':
      return 'yellow'
    case 'cancelada':
      return 'red'
    default:
      return 'zinc'
  }
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-9 w-full rounded-lg border border-white/[0.08] bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-blue-500/60 cursor-pointer transition',
        className,
      )}
      {...props}
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-zinc-800/70', className)} />
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'fade-in-up relative w-full rounded-xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl',
          wide ? 'max-w-2xl' : 'max-w-md',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-zinc-500">
      {icon}
      <p className="text-sm">{text}</p>
    </div>
  )
}
