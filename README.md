# 🚀 PERN Stack Boilerplate

Un proyecto boilerplate completo y funcional con la pila **PERN** (PostgreSQL, Express, React, Node.js) listo para clonar y comenzar a desarrollar. Incluye un CRUD completo de usuarios como punto de partida.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Actualizar Dependencias](#actualizar-dependencias)
- [Contribución](#contribución)

## ✨ Características

- ✅ CRUD completo de usuarios (Create, Read, Update, Delete)
- ✅ Arquitectura modular y escalable
- ✅ Manejo centralizado de errores
- ✅ Validación de datos
- ✅ CORS configurado
- ✅ Variables de entorno
- ✅ Seguridad con Helmet
- ✅ Logging con Morgan
- ✅ Hot reload en desarrollo (Nodemon + Vite)
- ✅ Scripts para desarrollo en paralelo
- ✅ Preparado para JWT (dependencias incluidas)

## 🛠 Tecnologías

### Backend

| Tecnología       | Versión Actual | Propósito                       |
| ---------------- | -------------- | ------------------------------- |
| **Node.js**      | v18+           | Runtime de JavaScript           |
| **Express**      | ^4.18.2        | Framework web minimalista       |
| **PostgreSQL**   | 14+            | Base de datos relacional        |
| **pg**           | ^8.11.3        | Cliente de PostgreSQL para Node |
| **dotenv**       | ^16.3.1        | Manejo de variables de entorno  |
| **cors**         | ^2.8.5         | Habilitar CORS                  |
| **helmet**       | ^7.1.0         | Seguridad HTTP headers          |
| **morgan**       | ^1.10.0        | Logging de peticiones HTTP      |
| **bcrypt**       | ^5.1.1         | Hash de contraseñas             |
| **jsonwebtoken** | ^9.0.2         | Autenticación JWT               |
| **nodemon**      | ^3.0.2         | Auto-restart en desarrollo      |

### Frontend

| Tecnología           | Versión Actual | Propósito               |
| -------------------- | -------------- | ----------------------- |
| **React**            | ^18.2.0        | Librería UI             |
| **Vite**             | ^5.0.8         | Build tool y dev server |
| **React Router DOM** | ^6.20.1        | Enrutamiento            |
| **Axios**            | ^1.6.2         | Cliente HTTP            |

### DevOps

| Tecnología      | Versión | Propósito                    |
| --------------- | ------- | ---------------------------- |
| **npm-run-all** | ^4.1.5  | Ejecutar scripts en paralelo |

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v14 o superior) - [Descargar](https://www.postgresql.org/download/)
- **PGAdmin** (opcional pero recomendado) - [Descargar](https://www.pgadmin.org/)
- **Git** - [Descargar](https://git-scm.com/)

Verifica las instalaciones:

```bash
node --version
npm --version
psql --version
```

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio-url>
cd pern-project
```

### 2. Instalar dependencias

Opción A - Instalar todo de una vez (recomendado):

```bash
npm run install:all
```

Opción B - Instalar manualmente:

```bash
# Instalar dependencias raíz
npm install

# Instalar dependencias del servidor
cd server && npm install

# Instalar dependencias del cliente
cd ../client && npm install
```

## ⚙️ Configuración

### 1. Configurar la Base de Datos en PostgreSQL

#### Usando PGAdmin:

1. Abre PGAdmin
2. Click derecho en "Servers" → "Register" → "Server"
3. En la pestaña "General", nombre: `Local`
4. En la pestaña "Connection":
   - **Host name/address**: `localhost`
   - **Port**: `5432`
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: tu contraseña de PostgreSQL
5. Click en "Save"

#### Crear la base de datos:

1. Click derecho en "Databases" → "Create" → "Database"
2. Database name: `pern_app`
3. Click "Save"

#### Ejecutar el script inicial:

1. Click derecho en la base de datos `pern_app` → "Query Tool"
2. Abre el archivo `/server/sql/init.sql`
3. Copia y pega el contenido en el Query Tool
4. Click en "Execute" (▶️) o presiona F5
5. Verifica que la tabla `users` se creó con 3 registros de prueba

#### Usando la terminal:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE pern_app;

# Conectar a la base de datos
\c pern_app

# Ejecutar el script
\i /ruta/completa/a/server/sql/init.sql

# Salir
\q
```

### 2. Configurar Variables de Entorno

#### Backend (server):

```bash
cd server
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
PORT=4000
DATABASE_URL=postgres://postgres:tu_password@localhost:5432/pern_app
```

#### Frontend (client):

```bash
cd client
cp .env.example .env
```

Contenido del `.env`:

```env
VITE_API_URL=http://localhost:4000
```

## 🚀 Ejecución

### Desarrollo (Recomendado)

Desde la raíz del proyecto, ejecuta ambos servidores en paralelo:

```bash
npm run dev
```

Esto iniciará:

- 🔧 Backend en: `http://localhost:4000`
- 🎨 Frontend en: `http://localhost:5173`

### Ejecutar por separado

**Terminal 1 - Backend:**

```bash
npm run dev:server
# o
cd server && npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev:client
# o
cd client && npm run dev
```

### Producción

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
pern-project/
├── server/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio
│   │   │   └── userController.js
│   │   ├── middleware/          # Middlewares personalizados
│   │   │   └── errorHandler.js
│   │   ├── routes/              # Definición de rutas
│   │   │   └── userRoutes.js
│   │   ├── db.js                # Conexión a PostgreSQL
│   │   └── index.js             # Punto de entrada del servidor
│   ├── sql/
│   │   └── init.sql             # Script de inicialización de BD
│   ├── .env                     # Variables de entorno (no commitear)
│   ├── .env.example             # Ejemplo de variables de entorno
│   └── package.json
│
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   └── Layout.jsx
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── Home.jsx         # Listado de usuarios
│   │   │   ├── UsersNew.jsx     # Crear usuario
│   │   │   └── UsersEdit.jsx    # Editar usuario
│   │   ├── App.jsx              # Componente principal + Router
│   │   ├── main.jsx             # Punto de entrada de React
│   │   └── index.css            # Estilos globales
│   ├── index.html               # HTML base
│   ├── vite.config.js           # Configuración de Vite
│   ├── .env                     # Variables de entorno (no commitear)
│   ├── .env.example             # Ejemplo de variables de entorno
│   └── package.json
│
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Scripts raíz + npm-run-all
└── README.md                    # Este archivo
```

## 🔌 API Endpoints

### Health Check

```
GET /api/health
```

Respuesta:

```json
{
  "ok": true,
  "message": "Server is running"
}
```

### Usuarios

| Método   | Endpoint         | Descripción                |
| -------- | ---------------- | -------------------------- |
| `GET`    | `/api/users`     | Obtener todos los usuarios |
| `GET`    | `/api/users/:id` | Obtener un usuario por ID  |
| `POST`   | `/api/users`     | Crear un nuevo usuario     |
| `PUT`    | `/api/users/:id` | Actualizar un usuario      |
| `DELETE` | `/api/users/:id` | Eliminar un usuario        |

### Ejemplos de uso

**Crear usuario:**

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Obtener todos los usuarios:**

```bash
curl http://localhost:4000/api/users
```

**Actualizar usuario:**

```bash
curl -X PUT http://localhost:4000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

**Eliminar usuario:**

```bash
curl -X DELETE http://localhost:4000/api/users/1
```

## 🔄 Actualizar Dependencias

### Verificar versiones disponibles

```bash
# Ver dependencias desactualizadas
npm outdated

# En el servidor
cd server && npm outdated

# En el cliente
cd client && npm outdated
```

### Actualizar a versiones específicas

Para actualizar una dependencia específica a la última versión compatible:

```bash
# Actualizar Express en el servidor
cd server
npm install express@latest

# Actualizar React en el cliente
cd client
npm install react@latest react-dom@latest
```

### Actualizar todas las dependencias (con precaución)

```bash
# Actualizar a versiones menores/patch (seguro)
npm update

# Actualizar a versiones mayores (revisar breaking changes)
npx npm-check-updates -u
npm install
```

### Cambiar a versiones específicas

Si necesitas una versión específica, edita el `package.json`:

```json
{
  "dependencies": {
    "express": "4.19.0", // Versión exacta
    "pg": "^8.11.3", // Compatible con 8.x.x
    "react": "~18.2.0" // Compatible con 18.2.x
  }
}
```

Luego ejecuta:

```bash
npm install
```

### Actualizar Node.js

Para actualizar Node.js a una versión más reciente:

1. Descarga la nueva versión desde [nodejs.org](https://nodejs.org/)
2. O usa `nvm` (Node Version Manager):
   ```bash
   nvm install 20
   nvm use 20
   ```

### Actualizar PostgreSQL

1. Respaldo de datos:
   ```bash
   pg_dump -U postgres pern_app > backup.sql
   ```
2. Instala la nueva versión de PostgreSQL
3. Restaura los datos:
   ```bash
   psql -U postgres pern_app < backup.sql
   ```

## 🧪 Testing (Opcional - Configurar)

Para agregar tests al proyecto:

```bash
# Backend - Jest
cd server
npm install --save-dev jest supertest

# Frontend - Vitest
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

## 🔐 Seguridad

Este proyecto incluye:

- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Variables de entorno para datos sensibles
- ✅ Validación de datos en el backend
- ⚠️ **NO** incluye autenticación (JWT está instalado pero no implementado)

Para producción, considera agregar:

- Autenticación y autorización (JWT)
- Rate limiting
- Validación con express-validator o Joi
- HTTPS
- Sanitización de inputs

## 📝 Scripts Disponibles

### Raíz del proyecto

```bash
npm run dev              # Ejecutar servidor y cliente en paralelo
npm run dev:server       # Ejecutar solo el servidor
npm run dev:client       # Ejecutar solo el cliente
npm run install:all      # Instalar dependencias en todos los niveles
```

### Servidor

```bash
npm run dev              # Desarrollo con nodemon
npm start                # Producción
```

### Cliente

```bash
npm run dev              # Desarrollo con Vite
npm run build            # Build para producción
npm run preview          # Preview del build
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Troubleshooting

### El servidor no se conecta a la base de datos

1. Verifica que PostgreSQL esté ejecutándose:

   ```bash
   # macOS
   brew services list

   # Linux
   sudo service postgresql status
   ```

2. Verifica las credenciales en `.env`
3. Verifica que la base de datos `pern_app` exista

### Puerto 4000 o 5173 ya en uso

Cambia los puertos en los archivos `.env`:

```env
# server/.env
PORT=5000

# client/.env
VITE_API_URL=http://localhost:5000
```

Y en `client/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // Cambia aquí
  },
});
```

### Error de CORS

Verifica que `VITE_API_URL` en el cliente coincida con la URL del servidor.

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Vite](https://vitejs.dev/)
- [node-postgres (pg)](https://node-postgres.com/)

---

**Desarrollado con ❤️ usando PERN Stack**
