import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Bot, CalendarCheck, MessageSquare, Plus, Send } from 'lucide-react'
import { useConversations, useCustomers, useMessages } from '../../hooks/useData'
import { sendChatMessage } from '../../lib/agent'
import { cn, fmtDateLabel, fmtTime, timeAgo } from '../../lib/utils'
import { Badge, Button, Card, Input, Select } from '../../components/ui'
import type { Appointment } from '../../types'

const NEW_PHONE = '+51 900 111 222'

const suggestions = [
  'Hola, quiero un corte mañana',
  'Quiero corte y barba hoy a las 5pm',
  'Necesito cancelar mi cita',
  'Quiero reprogramar mi cita',
]

interface LocalMsg {
  role: 'user' | 'assistant'
  content: string
}

export default function ConversationsPage() {
  const conversations = useConversations()
  const customers = useCustomers()
  const qc = useQueryClient()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [phone, setPhone] = useState(NEW_PHONE)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState<LocalMsg[]>([])
  const [typing, setTyping] = useState(false)
  const [lastBooking, setLastBooking] = useState<Appointment | null>(null)

  const messages = useMessages(activeId)
  const bottomRef = useRef<HTMLDivElement>(null)

  const display: LocalMsg[] = [...(messages.data ?? []), ...pending]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [display.length, typing])

  async function send(text?: string) {
    const message = (text ?? input).trim()
    if (!message || typing) return
    setInput('')
    setPending((p) => [...p, { role: 'user', content: message }])
    setTyping(true)
    try {
      const res = await sendChatMessage({ phone, message, conversation_id: activeId })
      setActiveId(res.conversation_id)
      setPending((p) => [...p, { role: 'assistant', content: res.reply }])
      if (res.appointment) setLastBooking(res.appointment)
      await qc.invalidateQueries({ queryKey: ['messages', res.conversation_id] })
      await qc.invalidateQueries({ queryKey: ['conversations'] })
      setPending([])
    } catch {
      setPending((p) => [
        ...p,
        { role: 'assistant', content: '⚠️ No pude conectar con el agente. Intenta de nuevo.' },
      ])
    } finally {
      setTyping(false)
    }
  }

  function startNew() {
    setActiveId(null)
    setPending([])
    setLastBooking(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Conversaciones</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Simulación WhatsApp — el agente IA responde y agenda de verdad
          </p>
        </div>
        <Button variant="secondary" onClick={startNew}>
          <Plus size={15} />
          Nueva conversación
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Conversation list */}
        <Card className="h-fit max-h-[32vh] overflow-y-auto p-2 lg:col-span-1 lg:max-h-[560px]">
          {(conversations.data ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id)
                setPending([])
                setLastBooking(null)
                if (c.customers?.phone) setPhone(c.customers.phone)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition',
                activeId === c.id ? 'bg-blue-500/10' : 'hover:bg-zinc-800/50',
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <MessageSquare size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {c.customers?.name ?? 'Cliente nuevo'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {c.channel} · {timeAgo(c.created_at)}
                </p>
              </div>
            </button>
          ))}
          {conversations.data?.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">Sin conversaciones aún.</p>
          )}
        </Card>

        {/* Chat window */}
        <Card className="flex h-[70vh] flex-col sm:h-[560px] lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                <Bot size={15} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">Recepcionista IA</p>
                <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> en línea
                </p>
              </div>
            </div>
            <div className="w-full sm:w-52">
              <Select
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  startNew()
                }}
                className="h-8 text-xs"
              >
                <option value={NEW_PHONE}>Cliente nuevo · {NEW_PHONE}</option>
                {(customers.data ?? []).map((c) => (
                  <option key={c.id} value={c.phone}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {display.length === 0 && !typing && (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Bot size={26} />
                </div>
                <p className="max-w-xs text-center text-sm text-zinc-500">
                  Escríbele al recepcionista IA como si fueras un cliente por WhatsApp.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-white/[0.1] bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-blue-500/40 hover:text-blue-300 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {display.map((m, i) => (
              <div
                key={i}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md border border-white/[0.06] bg-zinc-800/80 text-zinc-100',
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-zinc-800/80 px-4 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-zinc-400" />
                </div>
              </div>
            )}
            {lastBooking && !typing && (
              <div className="fade-in-up mx-auto flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400">
                <CalendarCheck size={13} />
                Reserva creada: {lastBooking.service} · {fmtDateLabel(lastBooking.date)}{' '}
                {fmtTime(lastBooking.time)}
                <Badge color="green">en vivo</Badge>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex gap-2 border-t border-white/[0.06] p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe como cliente… ej. 'quiero un corte mañana a las 5pm'"
            />
            <Button type="submit" disabled={typing || !input.trim()} className="shrink-0">
              <Send size={15} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
