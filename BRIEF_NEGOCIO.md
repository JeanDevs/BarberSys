# 💈 BarberAI — Brief de Negocio

> **Nunca pierdas otra reserva.** El recepcionista inteligente que nunca duerme.
> Documento de negocio · v1 · 2026-07-03
> Estado del producto: MVP desplegado y verificado en producción (ver `ESTADO_PROYECTO.md`).

---

## ⚠️ Supuestos a validar (edítalos)

Este brief se redactó con supuestos de arranque marcados con **🔧**. Cámbialos y el resto del documento se ajusta:

- 🔧 **Propósito del brief:** interno / fundacional (alinear negocio, no pitch de inversores todavía).
- 🔧 **Modelo:** SaaS por suscripción mensual.
- 🔧 **Mercado inicial:** barberías independientes (1–2 sedes), dueño-operador.
- 🔧 **Geografía inicial:** LATAM + España (español nativo; el agente ya funciona en español).
- 🔧 **Precio ancla:** €39–€99 / mes por sede (ver §7).

---

## 1. Resumen ejecutivo

BarberAI es un **recepcionista con IA** para barberías: atiende WhatsApp y llamadas, agenda citas
automáticamente, reactiva clientes inactivos y mantiene un dashboard en tiempo real. El objetivo del
negocio es simple:

> **Que una barbería consiga más reservas sin contratar a otra persona.**

El producto ya existe como MVP funcional y desplegado. La barbería es el **primer vertical** de una
plataforma SaaS de agentes IA reutilizable en salones, spa, clínicas, veterinarias, restaurantes, etc.

**La tesis:** las barberías pierden reservas cada día porque nadie contesta el WhatsApp o el teléfono
mientras se corta el pelo. Una recepcionista cuesta un salario; BarberAI cuesta una fracción y no duerme,
no se enferma y no se olvida de hacer seguimiento a los clientes que dejaron de venir.

---

## 2. El problema

Una barbería típica vive tres fugas de ingresos, todas por lo mismo — **falta de atención en el momento**:

1. **Mensajes sin responder.** El cliente escribe por WhatsApp/Instagram para reservar; el barbero está
   ocupando las manos con un cliente. La respuesta llega tarde o nunca → reserva perdida.
2. **Llamadas sin contestar.** Igual que arriba, pero por teléfono. La llamada se pierde y el cliente
   va a la competencia de al lado.
3. **Clientes que se enfrían.** Nadie hace seguimiento al que no vuelve hace 30–60 días. Se pierde
   sin que nadie lo note.

El coste de "resolverlo bien" hoy es contratar a alguien de recepción — algo que la mayoría de barberías
independientes **no puede o no quiere** pagar.

---

## 3. La solución

Un agente IA que actúa como recepcionista 24/7, conectado al mismo backend en tiempo real:

| Capacidad | Qué hace | Estado en el MVP |
|---|---|---|
| **Reserva por WhatsApp** | Interpreta intención, consulta disponibilidad, sugiere horarios, confirma y guarda. | ✅ Funcional (agente real) |
| **Reserva por llamada** | Voice agent: nombre, servicio, fecha, hora → reserva + resumen. | ✅ Simulado end-to-end |
| **Reactivación de inactivos** | Detecta quién no viene hace +30 días y le escribe/llama para que vuelva. | ✅ Acción `outreach` |
| **Confirmaciones automáticas** | Recordatorio 24 h antes: confirmar / reprogramar / cancelar. | ⚙️ Diseñado |
| **Dashboard en tiempo real** | KPIs, agenda, clientes, conversaciones, llamadas, insights. | ✅ Realtime |

**Diferenciador técnico:** el agente **nunca depende de una API externa para funcionar**. Con
`OPENAI_API_KEY` usa un LLM con function-calling; sin ella, cae a un motor de intenciones determinístico
en español. Esto hace la demo (y el servicio) robustos.

---

## 4. Producto y arquitectura (resumen)

```
Cliente (WhatsApp / llamada)
  → Edge Function `barberai-agent`
     → LLM (OpenAI si hay key)  ó  motor determinístico ES (fallback siempre disponible)
  → Tools: searchAvailability · createAppointment · getCustomer · createCustomer
           · cancelAppointment · rescheduleAppointment
  → Supabase (Postgres + Realtime) → Dashboard
```

- **Frontend:** React + Vite + TS + Tailwind v4 + TanStack Query + React Router. Modo oscuro, estilo Linear/Vercel.
- **Backend:** Supabase (8 tablas con RLS + Realtime; Edge Functions).
- **Deploy:** GitHub + Vercel. Producción: https://barbersys-beta.vercel.app
- **Multi-canal por diseño:** WhatsApp Cloud API, Twilio, Genesys y n8n apuntan todos al **mismo endpoint** del agente. Añadir un canal = conectar un webhook, no reconstruir la lógica.

Detalle técnico completo en `BARBER_INFO.MD` y `ESTADO_PROYECTO.md`.

---

## 5. Mercado y segmentación

**Vertical de arranque:** barberías. 🔧 **Segmento:** independientes de 1–2 sedes, dueño-operador.

| Segmento | Dolor | Disposición a pagar | Prioridad |
|---|---|---|---|
| Barbería independiente (1–2 sedes) | Alto (pierde reservas a diario) | Media (ticket bajo, decisión rápida) | **Foco inicial** |
| Cadena / franquicia (3+ sedes) | Alto + necesidad de reporting | Alta (presupuesto, ciclo de venta largo) | Expansión (fase 2) |
| Otros verticales (salón, spa, clínica, vet) | Mismo patrón de "recepción perdida" | Variable | Plataforma (fase 3) |

**Por qué barbería primero:** alta frecuencia de reserva, servicios simples y repetitivos (fácil de
modelar), decisión de compra de una sola persona (el dueño), y un dolor obvio y cuantificable.

**Por qué es plataforma, no vertical:** el 90% del sistema (agente, tools, agenda, clientes, realtime) es
agnóstico al negocio. Cambiar de barbería a veterinaria es sobre todo cambiar servicios, copy y branding.

---

## 6. Propuesta de valor y ROI para el cliente

**Mensaje central:** *"Recuperas la reserva que ibas a perder. Se paga solo."*

Cuenta rápida para el dueño (ejemplo, 🔧 ajustar a números reales):

- Ticket medio de un corte: ~€15.
- Si BarberAI recupera **solo 4 reservas al mes** que se habrían perdido → ~€60/mes.
- Suscripción 🔧 €39–€99/mes → **ROI positivo con 3–7 cortes recuperados al mes.**
- Todo lo demás (reactivación de inactivos, cero mensajes sin responder, confirmaciones) es upside.

El argumento no es "IA cool", es **matemática de recepcionista sin salario de recepcionista**.

---

## 7. Modelo de negocio y pricing 🔧

**Modelo:** SaaS por suscripción mensual, por sede. Estructura propuesta (a validar con clientes reales):

| Plan | Precio 🔧 | Incluye | Para quién |
|---|---|---|---|
| **Starter** | €39/mes | Reservas WhatsApp + dashboard + agenda. Límite de conversaciones/mes. | Barbería que prueba el agua |
| **Pro** | €99/mes | Todo + llamadas IA + reactivación de inactivos + confirmaciones + insights. | Barbería que va en serio |
| **Multi-sede** | Desde €249/mes | Pro para N sedes + reporting consolidado. | Cadenas / franquicias |

**Variables de coste a vigilar (unit economics):**
- Coste de LLM por conversación (mitigable con el motor determinístico como fallback).
- Coste de canal: WhatsApp Cloud API (por conversación) y Twilio (por minuto de llamada).
- Estos costes deben pasarse al plan (límites por tier o add-on por uso) para proteger el margen.

**Alternativas de modelo a considerar** (por si se descarta suscripción pura):
- **Performance:** cobrar por reserva conseguida / cliente reactivado (más alineado al valor, más difícil de medir/facturar).
- **Híbrido:** base baja + extra por volumen. Buen equilibrio riesgo/margen.

---

## 8. Go-to-market

**Movimiento inicial:** venta directa + auto-servicio asistido. La demo de <3 min **es** el pitch.

1. **Demo como arma comercial.** El flujo actual (escribo "quiero un corte mañana a las 5pm" → la IA
   agenda de verdad y aparece en el dashboard) convence en un minuto. Es reproducible en vivo con
   cualquier dueño.
2. **Canales de adquisición (fase 1):**
   - Directo: visita/DM a barberías locales; ofrecer 14 días de prueba con sus propios servicios cargados.
   - Contenido corto (Reels/TikTok) mostrando la IA agendando sola — el producto es visualmente demostrable.
   - Referidos entre barberos (comunidad muy conectada).
3. **Onboarding:** cargar servicios, horarios y barberos (ya hay CRUD en Configuración) + conectar el
   WhatsApp del negocio. Objetivo: **valor en el primer día**.
4. **Activación = primera reserva agendada por la IA.** Ese es el momento "ajá".

---

## 9. Competencia y diferenciación

- **Contra recepcionista humana:** más barato, 24/7, no falla en seguimiento. (Complementa, no reemplaza al barbero.)
- **Contra software de reservas clásico (Booksy, Fresha, etc.):** esos son *calendarios donde el cliente
  reserva solo*. BarberAI **conversa y reserva por el cliente** en el canal que el cliente ya usa (WhatsApp/llamada).
  El diferenciador es el **agente proactivo**, no el calendario.
- **Contra chatbots genéricos:** BarberAI ejecuta acciones reales (crea la cita, la mueve, la cancela) vía
  tools sobre datos en vivo; no solo responde texto.

**Foso a construir:** datos del negocio + integración de canales + fiabilidad del agente en español.

---

## 10. Métricas del negocio (qué mirar)

**Del cliente (prueban el valor, alimentan el pitch):**
- Reservas generadas por la IA / mes.
- % de mensajes y llamadas atendidos (vs. perdidos antes).
- Clientes reactivados / mes.
- Ingreso incremental atribuible a la IA.

**Del SaaS (salud del negocio):**
- MRR y nº de sedes activas.
- Activación (% que llega a la 1ª reserva IA), retención mensual, churn.
- CAC vs. LTV; margen por cuenta tras costes de LLM/canal.

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Coste de LLM/canal come el margen | Motor determinístico como fallback; límites por plan; add-on por uso. |
| Fiabilidad del agente (una mala reserva quema confianza) | Tools sobre datos reales + fallback determinístico; casos ya verificados end-to-end. |
| Dependencia de WhatsApp Cloud API (políticas de Meta) | Arquitectura multi-canal: mismo endpoint sirve Twilio/llamada/n8n. |
| Barbería con baja adopción digital | Onboarding asistido; la IA reduce el trabajo, no lo añade. |
| **Infra temporal:** tablas viven en un Supabase compartido (`app-restobar-gs`) | Migrar a proyecto propio al liberar slot (ya documentado en `ESTADO_PROYECTO.md §5`). |
| Auto-deploy Vercel pendiente (GitHub App no instalada) | Deploy manual `vercel --prod` mientras tanto; instalar la app. |

---

## 12. Próximos pasos (de MVP a negocio)

**Producto**
- [ ] Migrar Supabase a proyecto propio (salir del compartido).
- [ ] Instalar GitHub App de Vercel → auto-deploy en cada push.
- [ ] Endurecer RLS (hoy es demo pública sin login) → introducir auth y multi-tenant por negocio.
- [ ] Conectar WhatsApp Cloud API real a una barbería piloto.
- [ ] Implementar confirmaciones 24 h (diseñadas, faltan de conectar).

**Negocio**
- [ ] Validar precio con 5–10 barberías reales (entrevistas + prueba pagada).
- [ ] Cerrar 1–3 **pilotos** con WhatsApp real y medir reservas incrementales.
- [ ] Definir unit economics reales (coste LLM/canal por cuenta) y fijar los planes.
- [ ] Preparar material comercial partiendo de la demo (§8).

---

## 13. Visión

BarberAI no es "software de barbería". Es la primera instancia de una **plataforma de recepcionistas IA**
para cualquier negocio de citas: salones, spa, clínicas, dentistas, veterinarias, talleres, consultorios,
restaurantes. Misma arquitectura *Agent → Tools → Supabase*, distinto vertical.

> Empezamos ganándole a la barbería el problema de "nadie contesta". El mismo motor gana el mismo
> problema en cualquier negocio que viva de agendar clientes.
