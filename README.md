# 💈 BarberSys — BarberAI MVP

> **Nunca pierdas otra reserva.** El recepcionista inteligente que nunca duerme.

MVP de un SaaS basado en Agentes IA: la IA atiende WhatsApp y llamadas, agenda citas, reactiva clientes inactivos y mantiene un dashboard en tiempo real.

## Stack

- **Frontend:** React + Vite + TypeScript + TailwindCSS v4 + TanStack Query + React Router + Lucide
- **Backend:** Supabase (Postgres + Realtime + Edge Functions)
- **Agente IA:** Edge Function `barberai-agent` — arquitectura *Agent → Tools → Supabase*
- **Deploy:** Vercel

## Arquitectura del agente

```
Cliente (WhatsApp/llamada simulada)
  → Edge Function barberai-agent
     → LLM (OpenAI, si OPENAI_API_KEY está configurada en Supabase)
     → Fallback: motor de intenciones en español (determinístico, siempre funciona)
  → Tools: searchAvailability · createAppointment · getCustomer · createCustomer · cancelAppointment · rescheduleAppointment
  → Postgres → Realtime → Dashboard
```

Las mismas tools sirven para WhatsApp Cloud API, Twilio, Genesys o n8n: solo se conecta el webhook al mismo endpoint.

## Desarrollo local

```bash
npm install
npm run dev
```

Variables en `.env` (la anon key de Supabase es pública por diseño):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Modelo de datos

`customers · appointments · conversations · messages · calls · services · barbers · settings` — con RLS y Realtime habilitados.

## Demo (< 3 min)

1. **Landing** → "Ver Demo"
2. **Conversaciones**: escribe *"quiero un corte mañana a las 5pm"* → la IA consulta disponibilidad y crea la reserva real
3. **Dashboard**: la reserva aparece al instante (Realtime) con toast en vivo
4. **Llamadas**: "Simular llamada entrante" → timeline Llamando → IA hablando → Resumen → Reserva creada
5. **Clientes**: botones *Llamar IA* / *WhatsApp* reactivan clientes inactivos
6. **Insights IA**: métricas y recomendaciones generadas con los datos
