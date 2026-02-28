# 🏥 APP-DOCTOR – Backend & Frontend Guide

> 📌 **Este README funciona como contrato técnico entre Founder y Devs**
>
> Los devs implementan y prueban la lógica.
>
> **Producción, datos reales y secrets son responsabilidad exclusiva del Founder.**

---

## 🧠 Visión General

Este proyecto es una aplicación de **seguimiento médico** con dos roles principales:

* 👨‍⚕️ **Doctor** (core del sistema)
* 🧑‍🦽 **Patient**

El sistema está diseñado para que el doctor gestione pacientes, planes y alertas clínicas, mientras que el paciente registra su estado diario y recibe seguimiento.

<!-- 🔎 Comentario: Esta sección deja claro el dominio del negocio antes de entrar a lo técnico -->

---

## 🌍 Mundos de la Aplicación

### 👨‍⚕️ Doctor (Core del sistema)

El doctor es el centro del flujo clínico.

Puede:

* Crear pacientes
* Ver sus pacientes
* Asignar planes
* Ver alertas clínicas
* Marcar alertas como vistas o atendidas
* Crear notas médicas sobre alertas
* Ver historial clínico completo de un paciente

<!-- 🔎 Comentario: Aquí se define el alcance funcional del rol Doctor -->

---

### 🧑‍🦽 Patient

El paciente solo interactúa con su propio tratamiento.

Puede:

* Ver su plan activo
* Completar registros diarios (daily records)
* Ver notas médicas del doctor

<!-- 🔎 Comentario: Rol limitado por diseño (principio de mínimo privilegio) -->

---

## 🔐 Autenticación y Autorización

* Autenticación mediante **JWT**
* El token se guarda en **cookies**
* Roles disponibles:

  * `doctor`
  * `patient`
  * `superadmin` (uso técnico, no clínico)

### 🔒 Reglas de Acceso (MUY IMPORTANTE)

* **Doctor**:

  * Solo puede acceder a pacientes creados por él
  * Solo ve alertas generadas por sus pacientes

* **Patient**:

  * Solo puede acceder a su propia información
  * No puede listar ni acceder a otros pacientes

* **Superadmin**:

  * Solo para tareas técnicas
  * No interactúa con datos clínicos reales

<!-- 🔎 Comentario: Esta sección es clave para seguridad y para guiar middleware de autorización -->

---

## 🌱 Entornos

El sistema funciona en tres entornos claramente separados:

* **development** → local, datos fake, mocks
* **staging** → testing interno, datos fake
* **production** → datos reales (solo Founder)

⚠️ **Nunca usar datos reales en development o staging**

<!-- 🔎 Comentario: Esto justifica el uso de mocks y variables "solo producción" -->

---

## 📡 Backend – Endpoints

### 👤 USERS

* `POST /users` → crear usuario
* `POST /users/login` → login
* `POST /users/logout` → logout
* `GET /users/me` → usuario logueado
* `GET /users` → listar usuarios
* `GET /users/:id` → obtener usuario
* `PUT /users/:id` → actualizar usuario
* `DELETE /users/:id` → eliminar usuario

---

### 👨‍⚕️ DOCTORS

* `POST /doctors` → crear perfil doctor
* `GET /doctors` → listar doctores

---

### 🧑‍🦽 PATIENTS

* `POST /patients` → doctor crea paciente
* `GET /patients` → doctor obtiene sus pacientes

📌 **No existe** `GET /patients/:id`
📌 El frontend debe trabajar con la data que ya viene del listado

<!-- 🔎 Comentario: Decisión de seguridad por diseño -->

---

### 📦 PLANS

* `POST /plans` → crear plan
* `GET /plans` → listar planes

---

### 🔗 PATIENT-PLANS

* `POST /patient-plans` → doctor asigna plan a paciente
* `GET /patient-plans/me` → paciente ve su plan activo

---

### 🧾 FOLLOW-UP TEMPLATES

* `POST /follow-up-templates` → crear template
* `GET /follow-up-templates` → listar templates

---

### 📊 DAILY RECORDS (Paciente)

* `POST /daily-records` → paciente llena registro diario
* 🔒 Requiere plan activo

---

### 🚨 ALERTS (Doctor)

* `GET /alerts` → doctor obtiene sus alertas
* `PATCH /alerts/:id/seen` → marcar alerta como vista
* `PATCH /alerts/:id/handled` → marcar alerta como atendida

Las alertas incluyen:

* Detalles (`alert_details`)
* Paciente
* Usuario del paciente

---

### 📝 DOCTOR NOTES

* `POST /alerts/:id/notes` → doctor crea nota clínica

---

### 📓 PATIENT NOTES

* `GET /my/notes` → paciente ve notas del doctor

---

### 📚 PATIENT HISTORY (Doctor)

* `GET /doctor/patients/:id/history`
* Devuelve historial clínico completo del paciente

---

## ⚙️ Variables de Entorno

El archivo `.env.example` **documenta el contrato de configuración**, no contiene secrets reales.

### Variables solo requeridas en producción:

* `EMAIL`
* `PASSWORD`
* `PAYMENT_*`

En development y staging estas integraciones se **mockean**.

<!-- 🔎 Comentario: Esto explica por qué los devs no necesitan datos reales -->

---

## 🧑‍💻 Flujo de Trabajo para Devs

1. Clonar el repositorio
2. Copiar `.env.example` → `.env`
3. Usar datos locales / fake
4. Desarrollar en ramas feature
5. Crear PR hacia `develop`

🚫 Los devs **NO** deployan a producción
🚫 Los devs **NO** manejan secrets reales

<!-- 🔎 Comentario: Define claramente responsabilidades -->

---

## 👑 Responsabilidad del Founder

* Deploy a producción
* Manejo de Railway (prod)
* Secrets reales
* Datos médicos reales
* Backups y rollbacks

---

## ✅ Conclusión

Este documento define **qué se puede hacer, quién lo hace y en qué entorno**.

> Construimos con seguridad desde el diseño, no como parche.
