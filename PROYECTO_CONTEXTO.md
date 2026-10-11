# MediAlerta — Engine Core

Real-time medical alert engine powering medalerta.com. Automated patient monitoring, cron-based reminders, and triage dashboard.

**Status:** Production | **Stack:** Node.js, PostgreSQL, Sequelize, AWS

## System Overview

- **Backend API:** JWT + RBAC protected
- **Cron Robot:** Daily check at 9AM `0 9 * * *`, 300ms throttling to avoid spam
- **Email Service:** Resend API with simulation mode switch
- **Database:** PostgreSQL with B-Tree indexes optimized

## Tech Stack

**Core:** Node.js + Express + Sequelize
**Cloud:** AWS EC2 + RDS (sa-east-1)
**Email:** Resend API (@medalerta.com)
**Frontend:** Netlify

## Architecture

User → Patient → Daily Record → Alert (if severity > medium) → Doctor Note → Handled


- Patient submits daily record
- If severity > medium, Alert created
- Cron detects inactive patients (Op.between)
- Doctor creates note → Alert status = handled + Patient notified with actionPlan

## Key Features

**1. Smart Mailing System**
- `EMAIL_SIMULATION_MODE` in .env for infinite testing without burning Resend quota
- Decorated console logs in simulation

**2. Reminder Robot (cronJobs.js)**
- Prod: `cron.schedule('0 9 * * *')`
- Test: `cron.schedule('* * * * *')`
- 300ms delay between sends to respect 5 req/s limit

**3. Triage Dashboard**
- Filters: critical, stable, inactive, handled
- High performance via indexes

**4. Subscription Logic**
- Active subscription → +30 days to current endDate
- Frontend alert when daysLeft <= 7 with setHours(0,0,0,0) for accurate count

## Core Files

src/utils/cronJobs.js → Reminder engine
src/utils/sendEmail.js → Email service
src/services/notification.service.js → Notification hub
src/services/subscription.service.js → Billing dates logic


## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## Maintenance

```sql
-- Reset (use only in dev)
TRUNCATE TABLE subscriptions, doctors, users RESTART IDENTITY CASCADE;
```









<!--
# 🏥 MedAlerta: Engine Core v1.0
> **Status:** `MVP_READY` | **Protection:** `ARMORED` | **Region:** `SA-EAST-1`

---

## Quick Stats (Estado del Sistema)

| Módulo | Estado | Protección |
| :--- | :--- | :--- |
| **Backend API** | Online | JWT + Middleware |
| **Cron Robot** | Active | Anti-Spam Goteo (300ms) |
| **Email Service** | Verified | Simulation Mode Switch |
| **Database** | Optimized | Indexing (B-Tree + Bitmap) |

---

## The Tech Stack
* **Core:** `Node.js` + `Express`
* **ORM:** `Sequelize` (Postgres)
* **Cloud:** `AWS EC2` + `RDS`
* **Traffic:** `Netlify` (Frontend)
* **Mailing:** `Resend API` (Domain: `@medalerta.com`)

---

## Data Architecture (Relational Flow)

U --> P
U --> D
P --> R[Daily Record]
R -- severity > medium --> A
A --> N[Doctor Note][User][Patient][Doctor][Alert]


## Critical Features & Blindaje

1. Smart Mailing System (sendEmail.js)
Interruptor Maestro: Control total desde.env (EMAIL_SIMULATION_MODE).
Ahorro Inteligente: Pruebas infinitas sin quemar los 100 correos diarios de Resend.
Invisible Mode: Loguea en consola con formato decorado.

2. Robot de Recordatorios (Cron Job)
Inteligencia: Detecta pacientes "flojos" usando Op.between.
PARA PRODUCCION CADA DIA A LAS 9 : cron.schedule('0 9 * * *')
PARA PRUEBAS CADA MINUTO : cron.schedule('* * * * *')
Efecto Goteo: Delay de 300ms entre envíos.
Safe-Rate: Protege el límite de 5 req/s.

3. Dashboard de Triaje (The Brain)
Semáforo de Salud: Filtra estados critical, stable, inactive, y handled.
High Performance: Consultas ultra-rápidas gracias a índices.

4. Feedback al Paciente (Cierre de Ciclo)
Trigger: Creación de doctor_note.
Acción: alert.status = 'handled' + Notificación con el actionPlan.

5. Suscripciones y Alertas (New Logic)
Continuidad: Backend suma 30 días al endDate actual si la suscripción está activa.
Precisión: Alerta naranja en Frontend usa setHours(0,0,0,0) para conteo exacto de días.
Filtro: Solo visible cuando daysLeft <= 7.

## File System Map
src/utils/cronJobs.js -> El Corazón
src/utils/sendEmail.js -> El Mensajero
src/services/notification.service.js -> La Central
src/services/subscription.service.js -> La Caja Fuerte (Fechas)
components/SubscriptionAlert.jsx -> El Centinela (Banner)
.env -> La Llave

## Maintenance (Emergency Commands) PARA LA BASE DE DATOS
Reset Total (IDs a 1): TRUNCATE TABLE subscriptions, doctors, users RESTART IDENTITY CASCADE;
Reiniciar Secuencia: ALTER SEQUENCE users_id_seq RESTART WITH 1;
-->