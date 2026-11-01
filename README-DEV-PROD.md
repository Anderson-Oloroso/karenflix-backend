# KarenFlix: desarrollo y producción

Esta guía cubre los dos repositorios:

- Backend: `karenflix-backend` (Node.js, Express y MySQL).
- Frontend: `karenflix-frontend` (sitio estático, sin paso de build).

## Desarrollo local

### Opción recomendada: Docker Compose

1. En la carpeta del backend, crea el archivo local de variables:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Edita `.env`. Para el Compose incluido, conserva `DB_HOST=localhost` y `DB_PORT=3307` para la conexión local desde herramientas externas. Compose configura el backend para conectarse al servicio MySQL interno `db:3306`.
3. Cambia las contraseñas de ejemplo y `JWT_SECRET`. No publiques `.env`.
4. Inicia los servicios desde la carpeta del backend:

   ```powershell
   docker compose up --build
   ```

   Compose ejecuta el backend con `npm run dev` (nodemon) y MySQL en el puerto local `3307`.
5. Comprueba la API en `http://localhost:4000/api/v1`.
6. Abre `karenflix-frontend` en VS Code y sirve `index.html` con Live Server en el puerto `5500`.

Cuando el frontend se sirve desde `localhost` o `127.0.0.1`, su cliente usa `http://localhost:4000/api/v1`. Las semillas de `database/` se ejecutan automáticamente solo al inicializar un volumen MySQL nuevo; no se vuelven a ejecutar por levantar Compose otra vez.

### Backend sin Docker

1. Asegúrate de tener MySQL en ejecución y configura `.env` con su host, puerto, usuario, contraseña y base de datos. Para un MySQL instalado directamente, el puerto suele ser `3306`; para el MySQL de Compose, desde Windows se usa `3307`.
2. Desde la carpeta del backend:

   ```powershell
   npm ci
   npm run dev
   ```

`npm run dev` utiliza nodemon. La conexión puede ser a MySQL local o a un servicio remoto; `DB_SSL=true` habilita TLS para MySQL administrado.

## Producción

### Backend en Render

El backend puede desplegarse como servicio Docker usando el `Dockerfile` de la raíz, o como servicio Node nativo. No es necesario desplegar `docker-compose.yml` en Render.

- Para Docker, selecciona **Docker** como entorno y deja que Render use el `CMD` del Dockerfile: `npm start`.
- Para Node nativo, usa **Build Command** `npm ci` y **Start Command** `npm start`.
- En ambos casos, Render proporciona `PORT`; no fijes el puerto local `4000` en el panel.
- Configura las variables en **Render → servicio → Environment**. No subas `.env` ni copies sus valores de desarrollo.

Variables para el backend con MySQL en Aiven:

| Variable | Valor |
| --- | --- |
| `NODE_ENV` | `production` |
| `API_PREFIX` | `/api/v1` |
| `DB_HOST` | Host que muestra Aiven |
| `DB_PORT` | Puerto externo que muestra Aiven (por ejemplo, `15064`) |
| `DB_USER` | Usuario de Aiven |
| `DB_PASSWORD` | Contraseña vigente de Aiven |
| `DB_NAME` | Nombre de la base que contiene las tablas y semillas |
| `DB_SSL` | `true` |
| `DB_SSL_CA` | Certificado CA PEM descargado de Aiven |
| `DB_CONNECTION_LIMIT` | `10` |
| `JWT_SECRET` | Secreto largo, aleatorio y exclusivo de producción |
| `JWT_EXPIRES_IN` | `24h` |
| `CORS_ORIGIN` | `https://ixenbrandonestiben-lang.github.io` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |

Pega el certificado completo en `DB_SSL_CA`; si Render requiere una sola línea, conserva los saltos como `\n`. La base `DB_NAME` debe existir y tener el esquema aplicado. No uses `DB_ROOT_PASSWORD`: la aplicación se conecta con `DB_USER` y `DB_PASSWORD`.

El dominio de CORS es el origen del frontend, sin la ruta del repositorio. La API debe responder en `https://karenflix-backend.onrender.com/api/v1`.

### Frontend en GitHub Pages

El frontend es estático y no usa npm para compilarse.

1. Publica el repositorio `karenflix-frontend` con GitHub Pages, usando la rama y carpeta configuradas en **Settings → Pages** (el `index.html` está en la raíz).
2. El cliente API selecciona automáticamente el destino:
   - En `localhost` o `127.0.0.1`: `http://localhost:4000/api/v1`.
   - En GitHub Pages u otro host publicado: `https://karenflix-backend.onrender.com/api/v1`.
3. La URL pública del frontend es `https://ixenbrandonestiben-lang.github.io/karenflix-frontend/`; para CORS se usa solo el origen `https://ixenbrandonestiben-lang.github.io`.

## Antes de publicar

- Sube los cambios del backend a la rama que Render despliega y los del frontend a la rama que GitHub Pages publica.
- Verifica en los logs de Render que el servidor inicia y establece conexión con Aiven usando TLS.
- Prueba `https://karenflix-backend.onrender.com/api/v1` y después las funciones de la aplicación desde GitHub Pages.
- Rota cualquier credencial que se haya compartido o mostrado en capturas. No guardes contraseñas, certificados privados ni JWT de producción en Git.
