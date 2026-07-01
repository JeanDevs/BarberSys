C:\Users\JeanTS\Documents\PROYECTOS_APPS\BARBERIA
https://github.com/JeanDevs/BarberSys
# BarberAI MVP
## AI Receptionist para Barberías

> Objetivo: construir un MVP funcional en pocas horas que demuestre el potencial de un SaaS basado en Agentes IA. El objetivo NO es construir un sistema completo de barbería, sino demostrar que la IA puede convertirse en el recepcionista del negocio.

---

# Objetivo del MVP

La demostración debe responder una sola pregunta:

> **¿Cómo una barbería puede conseguir más reservas sin contratar otra persona?**

En menos de 3 minutos el dueño debe ver que la IA:

- Atiende automáticamente por WhatsApp.
- Agenda citas.
- Atiende llamadas.
- Llama clientes inactivos.
- Mantiene un dashboard actualizado en tiempo real.

---

# Principios

- MVP primero.
- UI moderna.
- Código limpio.
- Arquitectura escalable.
- Desarrollo orientado a agentes IA.
- Todo desplegado desde el primer día.

---

# Stack Tecnológico

## Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- React Router
- TanStack Query
- Lucide Icons

## Backend

Supabase

Utilizar:

- Database
- Realtime
- Edge Functions
- Storage (si es necesario)

## Deploy

- Github
- Vercel

Cada push a main debe desplegar automáticamente.

---

# IA

Modelo:

GPT-5

Arquitectura basada en:

Agent
↓

Tools
↓

Supabase

---

# Integraciones futuras

No es necesario implementarlas completamente.

Diseñar el sistema para soportar:

- WhatsApp Cloud API
- Twilio
- Genesys Cloud
- n8n

---

# Branding

Nombre:

BarberAI

Slogan:

Nunca pierdas otra reserva.

---

# Landing Page

Hero moderno.

Debe contener:

Título:

BarberAI

Subtítulo:

El recepcionista inteligente que nunca duerme.

Cards:

✅ Agenda automática

✅ Atención por WhatsApp

✅ Reservas por llamada

✅ Confirmaciones automáticas

✅ Clientes recurrentes

Botón principal:

Ver Demo

Botón secundario:

Dashboard

---

# Dashboard

Diseño limpio.

Cuatro KPIs.

Reservas Hoy

Clientes

Reservas IA

Llamadas IA

Abajo:

Calendario

Últimas reservas

Actividad reciente

Todo conectado con Supabase Realtime.

---

# Sidebar

Dashboard

Agenda

Clientes

Conversaciones

Llamadas

Configuración

---

# Página Agenda

Calendario sencillo.

Mostrar bloques horarios.

Ejemplo

09:00

Juan

10:00

Pedro

11:00

Libre

12:00

Carlos

Botón:

Nueva Reserva

---

# Página Clientes

Tabla.

Columnas:

Nombre

Teléfono

Última visita

Visitas

Estado

Al seleccionar un cliente mostrar:

Historial

Reservas

Mensajes

Botones:

Llamar IA

Enviar WhatsApp

---

# Conversaciones

Simulación tipo ChatGPT.

Usuario:

Hola quiero un corte mañana.

IA:

Perfecto.

¿Qué horario prefieres?

Usuario:

5 pm

IA consulta disponibilidad.

IA responde.

Reserva creada.

La conversación debe sentirse real.

---

# Llamadas

Pantalla de simulación.

Estado:

Llamando...

↓

IA hablando

↓

Resumen generado

↓

Reserva creada

Mostrar timeline de llamada.

---

# Insights IA

Tarjetas.

Esta semana:

Reservas +18%

Clientes recuperados

Horas pico

Horas libres

Recomendaciones IA.

Ejemplo:

Los martes tienen poca demanda.

Recomendación:

Crear promoción de martes.

---

# Configuración

Horario del negocio

Servicios

Duración

Precio

Barberos

---

# Feature Principal

## Reservar por WhatsApp

Flujo

Cliente escribe

↓

IA interpreta intención

↓

Consulta disponibilidad

↓

Sugiere horarios

↓

Cliente confirma

↓

Guardar en Supabase

↓

Dashboard actualizado en tiempo real

---

# Feature 2

Reservar por llamada

Cliente llama

↓

Voice Agent

↓

Pregunta:

Nombre

Servicio

Fecha

Hora

↓

Reserva

↓

Guardar

↓

Dashboard

La UI puede ser simulada.

---

# Feature 3

Clientes recurrentes

Cada día:

Buscar clientes que no visitan hace más de 30 días.

Generar:

Llamada IA

o

WhatsApp automático

Ejemplo:

Hola Carlos.

Hace tiempo que no vienes.

Tenemos horarios disponibles esta semana.

¿Quieres reservar?

---

# Feature 4

Confirmaciones

24 horas antes.

Mensaje:

Hola Pierre.

Te esperamos mañana a las 5 PM.

¿Confirmas tu cita?

Opciones:

Confirmar

Reprogramar

Cancelar

---

# Arquitectura

Cliente

↓

React

↓

Supabase

↓

Edge Functions

↓

AI Agent

↓

Tools

↓

Database

---

# Modelo de Datos

## customers

id

name

phone

email

visits

last_visit

created_at

---

## appointments

id

customer_id

service

date

time

status

created_at

---

## conversations

id

customer_id

channel

created_at

---

## messages

id

conversation_id

role

content

created_at

---

## calls

id

customer_id

status

summary

created_at

---

# Agente IA

El agente debe poder usar herramientas.

Tools disponibles.

Tool:

searchAvailability()

Busca horarios disponibles.

---

Tool:

createAppointment()

Crea una reserva.

---

Tool:

getCustomer()

Busca cliente.

---

Tool:

createCustomer()

Registra cliente.

---

Tool:

cancelAppointment()

Cancela cita.

---

Tool:

rescheduleAppointment()

Reagenda.

---

# Casos de uso

Caso 1

Cliente nuevo.

Hola.

Quiero un corte mañana.

↓

IA pregunta horario.

↓

Reserva.

Caso 2

Cliente existente.

Hola.

Quiero el mismo corte.

↓

IA reconoce teléfono.

↓

Reserva.

Caso 3

Cliente quiere cancelar.

↓

Cancelar.

Caso 4

Cliente quiere reprogramar.

↓

Mover cita.

---

# Diseño

Inspiración:

Linear

Vercel

Stripe

Apple

Interfaz minimalista.

Mucho espacio.

Cards.

Bordes suaves.

Modo oscuro.

Animaciones sutiles.

---

# Paleta

Negro

Gris oscuro

Blanco

Azul

Sin colores excesivos.

---

# Componentes

Navbar

Sidebar

Cards

Stats

Table

Calendar

Chat

Call Timeline

Buttons

Dialogs

Toasts

Skeleton Loading

---

# Roadmap

## Loop 0

Infraestructura

- Github
- React
- Vercel
- Supabase
- Deploy automático

---

## Loop 1

Landing

Dashboard

Sidebar

Calendario

Clientes

---

## Loop 2

CRUD Clientes

CRUD Reservas

Realtime

---

## Loop 3

Agente IA

Tools

Reservas automáticas

---

## Loop 4

Simulación WhatsApp

Chat

Mensajes

---

## Loop 5

Simulación llamadas

Timeline

Resumen

---

## Loop 6

Insights IA

Métricas

Clientes recuperados

---

# Definición de Éxito

El MVP estará listo cuando una demo de menos de 3 minutos permita demostrar:

✅ La IA conversa con un cliente.

✅ Agenda automáticamente.

✅ La reserva aparece en el dashboard.

✅ El calendario se actualiza.

✅ El cliente queda registrado.

✅ Se visualizan métricas.

✅ Existe simulación de llamadas IA.

---

# Consideraciones Técnicas

- Todo debe estar escrito en TypeScript.
- Mantener una arquitectura por features.
- Componentes reutilizables.
- Hooks personalizados.
- Código limpio.
- Evitar complejidad innecesaria.
- Mantener el MVP simple pero visualmente impresionante.

---

# Objetivo Final

Este proyecto no busca ser un software de barbería.

Busca demostrar una plataforma SaaS basada en agentes IA que posteriormente pueda adaptarse a:

- Barberías
- Salones de belleza
- Clínicas
- Consultorios
- Restaurantes
- Talleres
- Estudios legales
- Dentistas
- Veterinarias

La barbería es únicamente el primer vertical de negocio.