# KarenFlix: guía paso a paso para resolver problemas

Esta guía te acompaña en algunos errores comunes. No necesitas saber programación para seguirla: lee cada paso en orden y evita compartir contraseñas o tokens mientras pides ayuda.

## 1. MySQL muestra el error 1175 (Safe Update Mode)

### ¿Qué significa?

MySQL Workbench tiene una protección llamada **Safe Updates** o **modo seguro de actualización**. Intenta impedir que una instrucción `UPDATE` o `DELETE` cambie muchas filas por accidente. Por eso puede detener una consulta y mostrar el error 1175.

### Solución temporal: permitir la consulta en esta conexión

1. Abre **MySQL Workbench** y conéctate a la base de datos correcta.
2. Abre una pestaña de consulta SQL.
3. Ejecuta solamente esta instrucción:

   ```sql
   SET SQL_SAFE_UPDATES = 0;
   ```

4. Ejecuta de nuevo la consulta que necesitas.

Este cambio aplica a la conexión actual. Al abrir otra conexión, es posible que tengas que repetirlo. La protección vuelve a su configuración habitual al reconectarte.

### Solución desde las preferencias de Workbench

1. En el menú superior, selecciona **Edit > Preferences** (en algunas versiones puede aparecer como **MySQL Workbench > Preferences**).
2. En la columna izquierda, selecciona **SQL Editor**.
3. Busca y desmarca **Safe Updates (rejects UPDATEs and DELETEs with no key in WHERE clause)**.
4. Presiona **Apply** o **OK**.
5. Cierra y vuelve a abrir la conexión de MySQL para que Workbench aplique el cambio.

Desactiva esta protección solo si entiendes qué filas cambiará tu consulta. Siempre que sea posible, revisa primero las filas seleccionadas y conserva una copia de los datos importantes.

## 2. Puerto ocupado (`EADDRINUSE: address already in use :::3000`)

### ¿Qué significa?

Un puerto es como una línea telefónica que una aplicación usa para recibir conexiones. El mensaje `EADDRINUSE` significa que otra aplicación ya está usando el puerto solicitado.

**En este proyecto el puerto predeterminado es `4000`**, según `src/server.js` y `.env.example`. Si el error menciona `3000`, tu archivo `.env` probablemente configura ese puerto o estás ejecutando otra configuración.

### Opción A: detener la aplicación que ya está usando el puerto

1. Primero busca la terminal donde pudiste haber iniciado KarenFlix u otra aplicación.
2. Si reconoces que esa terminal está ejecutando el proceso que quieres detener, vuelve a ella y presiona **Ctrl+C**.
3. Si no encuentras esa terminal, abre PowerShell y comprueba qué proceso está usando el puerto. Sustituye `4000` por el puerto del mensaje de error, por ejemplo `3000`:

   ```powershell
   Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue |
     Select-Object LocalAddress, LocalPort, OwningProcess
   ```

4. Anota el número que aparece bajo `OwningProcess` y averigua qué programa es. Sustituye `1234` por ese número:

   ```powershell
   Get-Process -Id 1234
   ```

5. **Solo si confirmas que es un programa tuyo que puedes detener**, ciérralo con:

   ```powershell
   Stop-Process -Id 1234
   ```

   No detengas un proceso que no reconoces. Si PowerShell indica que no tienes permisos o no sabes qué programa es, pide ayuda antes de continuar.

6. Vuelve a iniciar KarenFlix:

   ```powershell
   npm run dev
   ```

### Opción B: elegir otro puerto

1. Abre `.env` en VS Code.
2. Cambia la línea `PORT` por un puerto disponible, por ejemplo:

   ```dotenv
   PORT=4001
   ```

3. Guarda el archivo.
4. Detén el servidor anterior con **Ctrl+C** y vuelve a iniciar `npm run dev`.
5. Prueba la aplicación en `http://localhost:4001/api/v1`.

Si estás usando Docker Compose, el puerto publicado también depende de la configuración de `docker-compose.yml`. Asegúrate de que el puerto de tu computadora esté libre y que la URL de prueba use ese puerto.

## 3. MySQL no conecta (`ECONNREFUSED` o `Access denied`)

Aunque ambos errores hablan de conexión, describen problemas distintos:

- **`ECONNREFUSED`:** no se encontró un servidor MySQL escuchando en el host o puerto indicado.
- **`Access denied`:** MySQL respondió, pero no aceptó el usuario o la contraseña.

### Paso 1: comprobar que MySQL está encendido

- **Con Docker:** abre Docker Desktop y espera a que termine de iniciar. Si ejecutas toda la aplicación con Docker Compose, la terminal debe mostrar que el servicio de base de datos está listo.
- **Con MySQL local:** abre la aplicación **Servicios** de Windows desde el menú Inicio y busca un servicio llamado `MySQL` o `MySQL80`. Si está detenido, selecciónalo y presiona **Iniciar**. Si no aparece, revisa si MySQL Server está instalado.
- **Con Workbench:** comprueba que la conexión se dirige al servidor correcto y que puedes abrir una sesión.

### Paso 2: comprobar la dirección y el puerto

Abre `.env` en VS Code y compara estos valores con la forma en que iniciaste MySQL:

| Forma de ejecutar backend y MySQL | `DB_HOST` | `DB_PORT` |
|---|---|---|
| Ambos servicios con Docker Compose | `db` dentro del contenedor backend | `3306` dentro de Docker |
| Backend en Windows y MySQL instalado en Windows | `localhost` | Normalmente `3306` |
| Backend en Windows y MySQL expuesto desde Docker Compose | `localhost` | Normalmente `3307` en este proyecto |

No uses `localhost` como host del backend cuando el backend está dentro de Docker Compose: en ese caso, `localhost` apunta al propio contenedor, no al contenedor de MySQL.

### Paso 3: comprobar usuario y contraseña

En `.env`, revisa que `DB_USER` y `DB_PASSWORD` coincidan con el usuario y la contraseña que existen en MySQL. Si cambiaste la contraseña en Workbench o Docker, actualiza el archivo y reinicia el backend.

En Docker Compose, el usuario y contraseña de la aplicación deben coincidir con `DB_USER` y `DB_PASSWORD` en `.env`. No publiques esos valores ni uses una contraseña de ejemplo en un entorno real.

### Paso 4: comprobar que existe la base `karenflix_db`

1. Abre MySQL Workbench y conéctate al servidor correspondiente.
2. En la columna **SCHEMAS**, revisa si aparece `karenflix_db`.
3. Si no aparece y es una instalación nueva, ejecuta los scripts de `database/` en este orden:
   - `01-schema.sql`
   - `02-seeds.sql`
   - `03-procedures-triggers.sql`
4. Antes de ejecutar `01-schema.sql`, verifica que no haya información que quieras conservar: ese archivo elimina y vuelve a crear `karenflix_db`.

### Paso 5: reiniciar y probar

1. Guarda los cambios en `.env`.
2. Detén el backend con **Ctrl+C** y vuelve a iniciarlo con `npm run dev`; si usas Docker, vuelve a ejecutar `docker compose up`.
3. Comprueba `http://localhost:4000/api/v1` (o el puerto que configuraste).

## 4. Llave duplicada (`ER_DUP_ENTRY`)

### ¿Qué significa?

Es como intentar reservar un nombre de usuario que ya está ocupado. La base de datos protege la información para que no se repitan ciertos datos únicos, como el correo o el nombre de usuario de una cuenta. También puede ocurrir al volver a agregar un favorito o una reseña que ya existe para esa cuenta y película.

### ¿Qué puedes hacer?

1. Si estabas registrando una cuenta, prueba con un correo y un nombre de usuario distintos.
2. Si estabas agregando un favorito, revisa si esa película ya aparece en tu lista.
3. Si estabas publicando una reseña, revisa si ya escribiste una para esa película.
4. No borres filas de MySQL para ocultar el error: podrías perder información relacionada. La API puede responder con un conflicto (`409`) y explicar que el dato ya existe.

## 5. Error `401 Unauthorized` o token inválido

### ¿Qué significa?

La solicitud requiere demostrar que iniciaste sesión, pero el token no llegó, está mal copiado, caducó o no es válido.

### Copiar el token correctamente en Insomnia

1. Envía `POST /api/v1/auth/login` con tu correo **o** nombre de usuario y contraseña.
2. En la respuesta, copia el valor de `data.jwt`. Copia solo el texto del token; no copies comillas, llaves ni espacios adicionales.
3. Abre la solicitud protegida.
4. Selecciona la pestaña **Auth**.
5. En el tipo de autenticación, elige **Bearer Token**.
6. Pega el token copiado en el campo correspondiente. No añadas la palabra `Bearer`: Insomnia la coloca por ti.
7. Envía de nuevo la solicitud.

Si recibes `401` otra vez, inicia sesión para obtener un token nuevo y verifica que no lo hayas pegado en una solicitud distinta. No compartas el token: permite actuar como la cuenta que lo recibió.

**Diferencia importante:** `403 Forbidden` normalmente significa que sí hay una sesión válida, pero esa cuenta no tiene el permiso necesario. Por ejemplo, las acciones de administración requieren una cuenta con rol de administrador. Registrarse desde el formulario público crea una cuenta normal.

## Si el problema continúa

1. Copia el mensaje de error de la terminal, pero elimina contraseñas, tokens, direcciones privadas y cualquier dato personal.
2. Anota cuál operación estabas intentando y qué puerto usas.
3. Comprueba de nuevo los valores de `.env` sin compartirlos.
4. Incluye los pasos que seguiste al pedir ayuda. No ejecutes comandos que borren volúmenes o bases de datos como intento de reparación sin entender sus consecuencias.
