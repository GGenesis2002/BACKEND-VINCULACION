# 🏛️ Vinculación Sísmico Backend 2026

API REST robusta diseñada para el sistema de gestión de inspecciones sísmicas de edificios. Este backend centraliza la autenticación, la lógica de evaluación estructural, el envío de notificaciones por correo y el almacenamiento de evidencias fotográficas en la nube.

---
<img width="1344" height="619" alt="image" src="https://github.com/user-attachments/assets/107a674e-670a-489c-8c2d-3b3332bf6a50" />

## 🏗️ Arquitectura del Proyecto

El proyecto implementa una arquitectura limpia con separación de responsabilidades para asegurar la escalabilidad y mantenibilidad:

```text
├── server.js                 # Punto de entrada de la aplicación
├── data/
│   ├── knexConfiguration.js  # Configuración del Query Builder (Knex)
│   └── databaseTables.js     # Mapeo de tablas y esquemas de la DB
├── lib/
│   ├── controllers/          # Manejo de peticiones HTTP
│   ├── services/             # Lógica de negocio y procesos complejos
│   ├── repositories/         # Consultas directas a la base de datos
│   ├── middleware/           # Seguridad (JWT) y validaciones de acceso
│   ├── routes/               # Definición de rutas y endpoints
│   ├── schema/               # Validaciones de integridad con Zod
│   └── supabase/             # Cliente y gestión de Supabase Storage (Migrado de Firebase)
└── utils.js                  # Utilidades generales (Envío de correos, etc.)
```

---

## 🚀 Características Principales

- 🔐 **Autenticación JWT:**  
  Sistema de seguridad basado en tokens de acceso y refresco.

- 📦 **Almacenamiento en Supabase:**  
  Gestión de evidencias fotográficas utilizando Supabase Storage  
  *(Bucket: `fotos_sistema`)*.

- 📧 **Sistema de Notificaciones:**  
  Envío de correos automáticos para recuperación de cuentas mediante NodeMailer (Gmail SMTP).

- 🛠️ **Consultas Optimizadas:**  
  Uso de Knex.js para interactuar con PostgreSQL de forma segura y eficiente.

- 🛡️ **Validaciones:**  
  Esquemas de datos estrictos mediante Zod para prevenir errores de entrada.

- 📖 **API Docs:**  
  Documentación interactiva y pruebas de endpoints vía Swagger UI.

---

## 🛠️ Prerrequisitos

- **Node.js:** v16 o superior.  
- **Base de Datos:** PostgreSQL (Alojada en Supabase).  
- **Almacenamiento:** Bucket configurado en Supabase Storage.  
- **SMTP:** Cuenta de Gmail con "Contraseña de Aplicación" para envíos automáticos.

---

## 📥 Instalación y Configuración

### 1️⃣ Clona el repositorio

```bash
git clone https://github.com/kevonlemon/vinculacion-sismico-backend.git
cd vinculacion-sismico-backend
```

### 2️⃣ Instala las dependencias

```bash
npm install
```

### 3️⃣ Configura el entorno (.env)

Crea un archivo `.env` en la raíz del proyecto y completa con tus credenciales:

```env
# === BASE DE DATOS (SUPABASE) ===
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_USER=postgres.xdugpymasjrvhbuakoec
DB_PASSWORD=EvaluacionSIS2026
DB_PORT=5432
DB_NAME=postgres
DB_TEST_SCHEMA=public
DATABASE_URL=postgresql://postgres:EvaluacionSIS2026@db.xdugpymasjrvhbuakoec.supabase.co:5432/postgres

# === CONFIGURACIÓN DE CORREO (SMTP) ===
EMAIL_USER=e.valuacionsismica2002@gmail.com
EMAIL_PASS=yezqmkpblrxjzgot

# === SUPABASE STORAGE ===
SUPABASE_URL=https://xdugpymasjrvhbuakoec.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_completa_aqui
STORAGE_BUCKET=fotos_sistema

# === SERVIDOR ===
PORT=3000
JWT_ACCESS_SECRET=ejemploToken
JWT_REFRESH_SECRET=ejemplorefreshToken
NODE_ENV=development
```

---

## 🔐 Endpoints Principales

| Módulo        | Endpoint          | Método | Descripción |
|--------------|------------------|--------|------------|
| Auth         | `/auth/login`     | POST   | Inicio de sesión y generación de token. |
| Auth         | `/auth/register`  | POST   | Registro de nuevos usuarios. |
| Usuarios     | `/users/active`   | GET    | Obtener lista de personal activo. |
| Edificios    | `/buildings`      | GET    | Listar edificaciones registradas. |
| Inspecciones | `/inspecciones`   | POST   | Crear nueva evaluación técnica. |
| Catálogos    | `/catalogues`     | GET    | Obtener catálogos del sistema. |

---

## 📁 Esquema de Base de Datos (Tablas)

El sistema opera bajo el esquema definido en `databaseTables.js`:

- `usuarios` → Gestión de cuentas y roles.  
- `inspecciones` / `edificios` → Datos estructurales y técnicos.  
- `archivos_inspeccion` → Referencias a archivos en el storage.  
- `matriz_puntuacion` → Lógica de cálculo de resultados.

---

## 🏃 Ejecución

### 🔧 Desarrollo (Auto-reload)

```bash
node --watch server.js
```

### 🚀 Producción

```bash
node server.js
```

### 📖 Acceso a Documentación

Una vez iniciado el servidor, visita la interfaz de Swagger en:

```
http://localhost:3000/api-docs
```

---

## 🛡️ Autenticación y Seguridad

Para acceder a las rutas protegidas, debe incluir el token JWT en la cabecera de la petición:

```http
Authorization: Bearer <TU_TOKEN_AQUI>
```

### 👥 Roles de Usuario

- **admin:** Control total, gestión de usuarios y roles.  
- **inspector:** Creación y edición de inspecciones sísmicas.  
<<<<<<< HEAD
- **ayudante:** Acceso de consulta limitado.
=======
- **ayudante:** Acceso de consulta limitado.
>>>>>>> ce775de9929911cb5dfa0e7dccfcdbd184ef2b54
