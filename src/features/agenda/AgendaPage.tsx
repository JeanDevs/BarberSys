import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus, Scissors } from 'lucide-react'
import { useAppointmentsByDate, useCustomers, useServices } from '../../hooks/useData'
import { supabase } from '../../lib/supabase'
import { addDays, fmtDateLabel, fmtTime, localISO, SLOTS } from '../../lib/utils'
import { Badge, Button, Card, Dialog, Input, Select, Skeleton, statusBadgeColor } from '../../components/ui'

const sourceLabel: Record<string, string> = {
  whatsapp: 'WhatsApp',
  llamada: 'Llamada IA',
  manual: 'Manual',
}

export default function AgendaPage() {
  const [date, setDate] = useState(localISO())
  const [open, setOpen] = useState(false)
  const appts = useAppointmentsByDate(date)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Agenda</h1>
          <p className="mt-1 text-sm text-zinc-500">Bloques horarios y disponibilidad</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={15} />
          Nueva Reserva
        </Button>
      </div>

      <Card className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setDate(addDays(date, -1))}>
            <ChevronLeft size={16} />
          </Button>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-100">{fmtDateLabel(date)}</p>
            <p className="text-xs text-zinc-500">{date}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setDate(addDays(date, 1))}>
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="space-y-2">
          {appts.isLoading &&
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          {!appts.isLoading &&
            SLOTS.map((slot) => {
              const appt = appts.data?.find(
                (a) => fmtTime(a.time) === slot && a.status !== 'cancelada',
              )
              return (
                <div
                  key={slot}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
                    appt
                      ? 'border-blue-500/20 bg-blue-500/[0.06]'
                      : 'border-dashed border-white/[0.08]'
                  }`}
                >
                  <span className="w-14 shrink-0 font-mono text-sm text-zinc-400">{slot}</span>
                  {appt ? (
                    <>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                        <Scissors size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-100">
                          {appt.customers?.name ?? 'Cliente'}
                        </p>
                        <p className="truncate text-xs text-zinc-500">{appt.service}</p>
                      </div>
                      <Badge color="zinc" className="hidden sm:inline-flex">
                        {sourceLabel[appt.source] ?? appt.source}
                      </Badge>
                      <Badge color={statusBadgeColor(appt.status)}>{appt.status}</Badge>
                    </>
                  ) : (
                    <span className="text-sm text-zinc-600">Libre</span>
                  )}
                </div>
              )
            })}
        </div>
      </Card>

      <NewAppointmentDialog open={open} onClose={() => setOpen(false)} defaultDate={date} />
    </div>
  )
}

function NewAppointmentDialog({
  open,
  onClose,
  defaultDate,
}: {
  open: boolean
  onClose: () => void
  defaultDate: string
}) {
  const customers = useCustomers()
  const services = useServices()
  const qc = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSaving(true)
    try {
      let cid = customerId
      if (cid === 'new') {
        const { data, error } = await supabase
          .from('customers')
          .insert({ name: newName, phone: newPhone, status: 'activo' })
          .select()
          .single()
        if (error) throw error
        cid = data.id
      }
      const { error } = await supabase.from('appointments').insert({
        customer_id: cid,
        service: String(form.get('service')),
        date: String(form.get('date')),
        time: String(form.get('time')),
        status: 'confirmada',
        source: 'manual',
      })
      if (error) throw error
      qc.invalidateQueries()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Nueva Reserva">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-400">Cliente</label>
          <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="" disabled>
              Selecciona un cliente
            </option>
            {(customers.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.phone}
              </option>
            ))}
            <option value="new">+ Cliente nuevo</option>
          </Select>
        </div>
        {customerId === 'new' && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              placeholder="Teléfono"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs text-zinc-400">Servicio</label>
          <Select name="service" defaultValue="Corte Clásico">
            {(services.data ?? []).map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} · ${s.price}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Fecha</label>
            <Input type="date" name="date" defaultValue={defaultDate} required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Hora</label>
            <Select name="time" defaultValue="10:00">
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={saving} className="mt-2 w-full">
          {saving ? 'Guardando…' : 'Crear reserva'}
        </Button>
      </form>
    </Dialog>
  )
}
