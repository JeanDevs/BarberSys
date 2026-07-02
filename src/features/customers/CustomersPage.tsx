import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Phone, X } from 'lucide-react'
import { useCustomerAppointments, useCustomers } from '../../hooks/useData'
import { sendOutreach } from '../../lib/agent'
import { useToast } from '../../components/toast'
import { fmtDateLabel, fmtTime, timeAgo } from '../../lib/utils'
import { Badge, Button, Card, EmptyState, Skeleton, statusBadgeColor } from '../../components/ui'
import type { Customer } from '../../types'

export default function CustomersPage() {
  const customers = useCustomers()
  const [selected, setSelected] = useState<Customer | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Clientes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {customers.data?.length ?? '…'} clientes registrados · la IA reactiva a los inactivos
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={`overflow-x-auto ${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Teléfono</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Última visita</th>
                <th className="px-4 py-3 text-center font-medium">Visitas</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {customers.isLoading && (
                <tr>
                  <td colSpan={5} className="p-4">
                    <Skeleton className="h-40" />
                  </td>
                </tr>
              )}
              {(customers.data ?? []).map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer border-b border-white/[0.04] transition hover:bg-zinc-800/40 ${
                    selected?.id === c.id ? 'bg-blue-500/[0.06]' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                        {c.name.slice(0, 1)}
                      </div>
                      <span className="font-medium text-zinc-200">{c.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">{c.phone}</td>
                  <td className="hidden px-4 py-3 text-zinc-400 md:table-cell">
                    {c.last_visit ? fmtDateLabel(c.last_visit) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-300">{c.visits}</td>
                  <td className="px-4 py-3">
                    <Badge color={c.status === 'activo' ? 'green' : 'red'}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selected && <CustomerDetail customer={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}

function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const history = useCustomerAppointments(customer.id)
  const toast = useToast()
  const navigate = useNavigate()
  const [busy, setBusy] = useState<'whatsapp' | 'llamada' | null>(null)

  async function outreach(channel: 'whatsapp' | 'llamada') {
    setBusy(channel)
    try {
      const res = await sendOutreach({ customer_id: customer.id, channel })
      if (channel === 'whatsapp') {
        toast({
          title: '💬 WhatsApp enviado por la IA',
          description: res.message,
        })
        if (res.conversation_id) navigate('/app/conversaciones')
      } else {
        toast({ title: '📞 Llamada IA completada', description: res.summary })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo contactar al agente IA' })
    } finally {
      setBusy(null)
    }
  }

  return (
    <Card className="fade-in-up h-fit p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/15 text-base font-bold text-blue-400">
            {customer.name.slice(0, 1)}
          </div>
          <div>
            <p className="font-semibold text-zinc-100">{customer.name}</p>
            <p className="text-xs text-zinc-500">{customer.phone}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-zinc-800/60 p-2.5">
          <p className="text-lg font-bold text-zinc-100">{customer.visits}</p>
          <p className="text-[11px] text-zinc-500">Visitas</p>
        </div>
        <div className="rounded-lg bg-zinc-800/60 p-2.5">
          <p className="text-lg font-bold text-zinc-100">
            {customer.last_visit ? timeAgo(customer.last_visit + 'T12:00:00') : '—'}
          </p>
          <p className="text-[11px] text-zinc-500">Última visita</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          disabled={busy !== null}
          onClick={() => outreach('llamada')}
        >
          <Phone size={13} />
          {busy === 'llamada' ? 'Llamando…' : 'Llamar IA'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          disabled={busy !== null}
          onClick={() => outreach('whatsapp')}
        >
          <MessageCircle size={13} />
          {busy === 'whatsapp' ? 'Enviando…' : 'WhatsApp'}
        </Button>
      </div>

      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Historial
      </h3>
      {history.isLoading && <Skeleton className="h-24" />}
      {history.data?.length === 0 && (
        <EmptyState icon={<Phone size={20} />} text="Sin reservas todavía" />
      )}
      <div className="space-y-2">
        {(history.data ?? []).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg border border-white/[0.05] px-3 py-2"
          >
            <div>
              <p className="text-xs font-medium text-zinc-200">{a.service}</p>
              <p className="text-[11px] text-zinc-500">
                {fmtDateLabel(a.date)} · {fmtTime(a.time)}
              </p>
            </div>
            <Badge color={statusBadgeColor(a.status)}>{a.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
