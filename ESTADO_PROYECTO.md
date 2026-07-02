# 💈 BarberAI — Estado del Proyecto

> **Slogan:** Nunca pierdas otra reserva.
> **Subtítulo:** El recepcionista inteligente que nunca duerme.
> Actualizado: 2026-07-01

---

## 1. Qué querías (objetivo del MVP)

Un MVP funcional que demuestre un **SaaS basado en Agentes IA** actuando como **recepcionista de una barbería**. La demo (< 3 min) debe responder:

> **¿Cómo una barbería consigue más reservas sin contratar a otra persona?**

Y mostrar que la IA:

- Atiende automáticamente por WhatsApp.
- Agenda citas.
- Atiende llamadas.
- Llama a clientes inactivos.
- Mantiene un dashboard actualizado en tiempo real.

**Stack pedido:** React + Vite + TS + TailwindCSS + TanStack Query + React Router + Lucide · Supabase (DB, Realtime, Edge Functions) · GitHub + Vercel con deploy automático · Agente IA con arquitectura *Agent → Tools → Supabase*.

**Diseño pedido:** minimalista tipo Linear/Vercel/Stripe/Apple, modo oscuro, paleta negro/gris/blanco/azul, animaciones sutiles.

**Objetivo final:** la barbería es solo el primer vertical; la plataforma debe poder adaptarse a salones, clínicas, restaurantes, veterinarias, etc.

---

## 2. Qué se ha hecho (entregado)

### 🌐 En vivo
- **Producción:** https://barbersys-beta.vercel.app
- **Repo:** https://github.com/JeanDevs/BarberSys (rama `main`)
- **Estado:** desplegado y verificado (HTTP 200 en `/`, `/app` y rutas SPA). Build limpio.

### Frontend (React + Vite + TS + Tailwind v4)
Arquitectura por features. Modo oscuro, estilo Linear/Vercel, animaciones sutiles, skeleton loading, toasts.

| Página | Contenido |
|---|---|
| **Landing** (`/`) | Hero con título, subtítulo, slogan, 5 cards de features, botones *Ver Demo* y *Dashboard*. |
| **Dashboard** (`/app`) | 4 KPIs (Reservas Hoy, Clientes, Reservas IA, Llamadas IA) + calendario de hoy + últimas reservas + actividad reciente. Todo por **Realtime**. |
| **Agenda** (`/app/agenda`) | Bloques horarios por día, navegación de fechas, botón *Nueva Reserva* (crea cliente + cita). |
| **Clientes** (`/app/clientes`) | Tabla (nombre, teléfono, última visita, visitas, estado) + panel de detalle con historial y botones **Llamar IA** / **WhatsApp**. |
| **Conversaciones** (`/app/conversaciones`) | Chat estilo WhatsApp conectado al **agente real**. Sugerencias rápidas, indicador de escritura, chip "Reserva creada". |
| **Llamadas** (`/app/llamadas`) | Simulador de llamada entrante con timeline: Llamando → IA hablando → Resumen → Reserva creada. Crea reserva real. |
| **Insights IA** (`/app/insights`) | Métricas calculadas con datos reales: reservas semana (+%), clientes recuperados, hora pico, horas libres + gráfico 14 días + recomendación IA. |
| **Configuración** (`/app/configuracion`) | Horario, servicios (CRUD), barberos (CRUD), integraciones futuras. |

### Backend (Supabase)
- **8 tablas** con RLS y Realtime: `customers`, `appointments`, `conversations`, `messages`, `calls`, `services`, `barbers`, `settings`.
- **Seed con fechas relativas** → la demo siempre muestra "hoy" con datos coherentes (citas de hoy/mañana/semana pasada, llamadas, una conversación de WhatsApp de ejemplo).

### Agente IA (Edge Function `barberai-agent`)
Arquitectura *Agent → Tools → Supabase*. **6 tools** del spec:
`searchAvailability` · `createAppointment` · `getCustomer` · `createCustomer` · `cancelAppointment` · `rescheduleAppointment`.

- Con `OPENAI_API_KEY` configurada en Supabase → usa **OpenAI** (modelo por defecto `gpt-5`, ajustable con `OPENAI_MODEL`) con function-calling real.
- Sin key → **motor de intenciones en español determinístico** (entiende "mañana", "a las 5pm", servicios, cancelar, reprogramar). **La demo nunca depende de una API externa.**
- 3 acciones: `chat` (WhatsApp), `call_booking` (llamada), `outreach` (reactivación de inactivos).

### Casos verificados end-to-end
- ✅ Cliente nuevo: "quiero un corte manana a las 5pm" → verifica disponibilidad → pide nombre → crea cliente + reserva.
- ✅ Cancelación de cita.
- ✅ Reserva por llamada (con resumen generado).
- ✅ Deploy en producción respondiendo en todas las rutas.
- ✅ Dashboard cargando datos correctos desde Supabase.

---

## 3. Guion de demo (< 3 min)

1. **Landing** → *Ver Demo*.
2. En **Conversaciones**, escribe como cliente: *"quiero un corte mañana a las 5pm"* → la IA agenda de verdad.
3. Abre **Dashboard** en otra pestaña → la reserva aparece sola con un toast (Realtime).
4. **Llamadas** → *Simular llamada entrante* → timeline completo + reserva real.
5. **Clientes** → selecciona un inactivo (Carlos Ruiz) → *Llamar IA* → registra reactivación.
6. Cierra con **Insights IA** (comparativa semanal, hora pico, recomendación).

Cubre la **Definición de Éxito** del spec: la IA conversa, agenda, aparece en el dashboard, el calendario se actualiza, el cliente queda registrado, se ven métricas y hay simulación de llamadas.

---

## 4. Mapeo con el roadmap original

| Loop | Estado |
|---|---|
| 0 · Infraestructura (GitHub, React, Vercel, Supabase) | ✅ |
| 1 · Landing, Dashboard, Sidebar, Calendario, Clientes | ✅ |
| 2 · CRUD Clientes/Reservas + Realtime | ✅ |
| 3 · Agente IA + Tools + reservas automáticas | ✅ |
| 4 · Simulación WhatsApp (chat, mensajes) | ✅ |
| 5 · Simulación llamadas (timeline, resumen) | ✅ |
| 6 · Insights IA (métricas, recuperados) | ✅ |

---

## 5. Pendientes / notas importantes

1. **Supabase compartido (temporal):** el plan free ya tenía 2 proyectos activos con datos reales (`APP_DEPORTE`, `app-restobar-gs`). Para no tocarlos, las tablas de BarberAI viven en `app-restobar-gs` con **nombres en inglés** (cero colisión con las del restobar, que están en español). Al liberar un slot (pausar/eliminar/upgrade), migrar a proyecto propio.

2. **Auto-deploy pendiente:** el push a GitHub funciona, pero la **GitHub App de Vercel no está instalada**. Para que cada push a `main` despliegue solo: instalarla en Vercel → proyecto `barbersys` → Settings → Git → Connect (o github.com/apps/vercel). Mientras tanto, desplegar con `vercel deploy --prod`.

3. **Activar OpenAI (opcional):** en Supabase → proyecto → Edge Functions → Secrets, añadir `OPENAI_API_KEY` (y opcional `OPENAI_MODEL`). Sin esto el agente igual funciona con el motor determinístico.

4. **RLS permisivo:** demo pública sin login (a propósito). Endurecer políticas antes de uso real.

5. **Integraciones futuras** (diseñadas, no conectadas): WhatsApp Cloud API, Twilio, Genesys, n8n → todas apuntan al mismo endpoint del agente.

---

## 6. Comandos útiles

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo local (localhost:5173)
npm run build        # build de producción
vercel deploy --prod # desplegar a producción manualmente
```

**Variables (`.env`):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (la anon key es pública por diseño).
