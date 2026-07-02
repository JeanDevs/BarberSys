import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Clock, Plug, Plus, Scissors, Users } from 'lucide-react'
import { useBarbers, useServices, useSettings } from '../../hooks/useData'
import { supabase } from '../../lib/supabase'
import { fmtTime } from '../../lib/utils'
import { Badge, Button, Card, Input, Skeleton } from '../../components/ui'

const integrations = [
  { name: 'WhatsApp Cloud API', desc: 'Mensajería real con clientes' },
  { name: 'Twilio Voice', desc: 'Llamadas telefónicas reales' },
  { name: 'Genesys Cloud', desc: 'Contact center empresarial' },
  { name: 'n8n', desc: 'Automatizaciones y workflows' },
]

export default function SettingsPage() {
  const settings = useSettings()
  const services = useServices()
  const barbers = useBarbers()
  const qc = useQueryClient()
  const [svcSaving, setSvcSaving] = useState(false)
  const [barberName, setBarberName] = useState('')

  async function addService(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setSvcSaving(true)
    try {
      await supabase.from('services').insert({
        name: String(f.get('name')),
        duration_min: Number(f.get('duration')),
        price: Number(f.get('price')),
      })
      qc.invalidateQueries({ queryKey: ['services'] })
      e.currentTarget?.reset?.()
    } finally {
      setSvcSaving(false)
    }
  }

  async function addBarber() {
    if (!barberName.trim()) return
    await supabase.from('barbers').insert({ name: barberName.trim() })
    setBarberName('')
    qc.invalidateQueries({ queryKey: ['barbers'] })
  }

  async function toggleBarber(id: string, active: boolean) {
    await supabase.from('barbers').update({ active: !active }).eq('id', id)
    qc.invalidateQueries({ queryKey: ['barbers'] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-500">Horario, servicios, barberos e integraciones</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Business hours */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Horario del negocio</h2>
          </div>
          {settings.isLoading ? (
            <Skeleton className="h-16" />
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-zinc-800/60 p-3">
                <p className="text-lg font-bold text-zinc-100">
                  {fmtTime(settings.data?.open_time ?? '09:00')}
                </p>
                <p className="text-[11px] text-zinc-500">Apertura</p>
              </div>
              <div className="rounded-lg bg-zinc-800/60 p-3">
                <p className="text-lg font-bold text-zinc-100">
                  {fmtTime(settings.data?.close_time ?? '19:00')}
                </p>
                <p className="text-[11px] text-zinc-500">Cierre</p>
              </div>
              <div className="rounded-lg bg-zinc-800/60 p-3">
                <p className="text-lg font-bold text-zinc-100">
                  {settings.data?.slot_minutes ?? 60} min
                </p>
                <p className="text-[11px] text-zinc-500">Por bloque</p>
              </div>
            </div>
          )}
        </Card>

        {/* Barbers */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Barberos</h2>
          </div>
          <div className="space-y-2">
            {(barbers.data ?? []).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.05] px-3 py-2"
              >
                <span className="text-sm text-zinc-200">{b.name}</span>
                <button onClick={() => toggleBarber(b.id, b.active)} className="cursor-pointer">
                  <Badge color={b.active ? 'green' : 'zinc'}>
                    {b.active ? 'activo' : 'inactivo'}
                  </Badge>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Nombre del barbero"
              value={barberName}
              onChange={(e) => setBarberName(e.target.value)}
            />
            <Button variant="secondary" size="md" onClick={addBarber}>
              <Plus size={14} />
            </Button>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Scissors size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Servicios</h2>
          </div>
          <div className="space-y-2">
            {(services.data ?? []).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.05] px-3 py-2"
              >
                <div>
                  <p className="text-sm text-zinc-200">{s.name}</p>
                  <p className="text-[11px] text-zinc-500">{s.duration_min} min</p>
                </div>
                <span className="text-sm font-semibold text-zinc-100">${s.price}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={addService}
            className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_70px_70px_auto]"
          >
            <Input name="name" placeholder="Servicio" required className="col-span-2 sm:col-span-1" />
            <Input name="duration" type="number" placeholder="min" defaultValue={30} required />
            <Input name="price" type="number" placeholder="$" defaultValue={30} required />
            <Button
              variant="secondary"
              type="submit"
              disabled={svcSaving}
              className="col-span-2 sm:col-span-1"
            >
              <Plus size={14} />
              <span className="sm:hidden">Añadir</span>
            </Button>
          </form>
        </Card>

        {/* Integrations */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Plug size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Integraciones</h2>
          </div>
          <div className="space-y-2">
            {integrations.map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between rounded-lg border border-white/[0.05] px-3 py-2"
              >
                <div>
                  <p className="text-sm text-zinc-200">{i.name}</p>
                  <p className="text-[11px] text-zinc-500">{i.desc}</p>
                </div>
                <Badge color="zinc">próximamente</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
            La arquitectura del agente (Agent → Tools → Supabase) ya soporta estos canales: solo se
            conecta el webhook al mismo endpoint.
          </p>
        </Card>
      </div>
    </div>
  )
}
