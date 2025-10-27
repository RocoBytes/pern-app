# PERN Project

Este es un proyecto de ejemplo que utiliza la pila PERN (PostgreSQL, Express, React, Node) para gestionar un CRUD de usuarios.

## Estructura del Proyecto

El proyecto está dividido en dos carpetas principales: `server` y `client`.

### Servidor (`server`)

- **config/database.js**: Configura la conexión a la base de datos PostgreSQL.
- **controllers/userController.js**: Contiene las funciones para manejar las operaciones CRUD de los usuarios.
- **routes/userRoutes.js**: Define las rutas para las operaciones CRUD de los usuarios.
- **models/userModel.js**: Define el modelo de usuario y las validaciones necesarias.
- **middleware/errorHandler.js**: Middleware para manejar errores de manera centralizada.
- **server.js**: Punto de entrada de la aplicación, configura Express y levanta el servidor.
- **package.json**: Contiene las dependencias del backend y scripts para ejecutar el servidor.

### Cliente (`client`)

- **public/index.html**: Plantilla HTML principal para la aplicación React.
- **src/components**: Contiene los componentes de React para la gestión de usuarios.
  - **UserList.js**: Muestra la lista de usuarios.
  - **UserForm.js**: Formulario para crear o editar usuarios.
  - **UserItem.js**: Representa un solo usuario en la lista.
- **src/services/userService.js**: Funciones para interactuar con la API de usuarios.
- **src/App.js**: Componente principal que configura las rutas.
- **src/index.js**: Punto de entrada de la aplicación React.
- **package.json**: Contiene las dependencias del frontend y scripts para ejecutar la aplicación.

## Instrucciones

1. **Configuración de la Base de Datos**:
   - Asegúrate de tener PostgreSQL instalado y en funcionamiento.
   - Crea una base de datos en PGAdmin o utilizando la línea de comandos.
   - Ejecuta el script SQL en `server/sql/init.sql` para crear la tabla `users`.

2. **Variables de Entorno**:
   - Copia el archivo `server/.env.example` a `.env` y configura las variables necesarias.
   - Copia el archivo `client/.env.example` a `.env` y configura las variables necesarias.

3. **Ejecutar el Servidor**:
   - Navega a la carpeta `server` y ejecuta `npm install` para instalar las dependencias.
   - Ejecuta `npm run dev` para iniciar el servidor en modo desarrollo.

4. **Ejecutar el Cliente**:
   - Navega a la carpeta `client` y ejecuta `npm install` para instalar las dependencias.
   - Ejecuta `npm start` para iniciar la aplicación React.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor abre un issue o un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.