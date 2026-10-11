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



