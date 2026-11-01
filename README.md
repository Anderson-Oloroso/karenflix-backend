# KarenFlix Backend

¡Bienvenida y bienvenido! Esta guía explica qué hace el backend de KarenFlix, cómo ponerlo en marcha y cómo probar sus funciones, incluso si es tu primer contacto con un proyecto de software.

## Primero, una analogía: KarenFlix es un restaurante

Imagina que KarenFlix es un restaurante de películas:

- **El backend es la cocina.** Allí se aplican las reglas, se comprueba que los pedidos tengan sentido y se preparan las respuestas.
- **El frontend es el comedor y sus meseros.** Es la pantalla que una persona ve y usa para buscar películas, registrarse o dejar una reseña. El frontend no está incluido en este repositorio.
- **La base de datos es la despensa o bodega.** Guarda de forma ordenada la información de cuentas, películas, categorías, directores, favoritos y reseñas.
- **Las rutas o API son los platillos del menú.** Cada ruta ofrece una acción concreta, como consultar películas o crear una cuenta.
- **JSON es la nota de pedido en un idioma compartido.** El frontend la envía y la cocina (el backend) la entiende. Por ejemplo:

  ```json
  {
    "email": "ana@example.com",
    "password": "una-clave-de-ejemplo"
  }
  ```

En palabras sencillas, el backend recibe solicitudes, aplica las reglas de KarenFlix, consulta o modifica la despensa y devuelve una respuesta.

## ¿Qué es KarenFlix?

KarenFlix es una API para una plataforma de películas y recomendaciones. Permite consultar un catálogo, organizar películas por categoría y director, registrar usuarios y administrar funciones como favoritos, reseñas y reacciones.

Una **API** es una forma ordenada para que dos programas se comuniquen. Este backend ofrece una API web que puede usar el frontend, Insomnia u otra aplicación autorizada.

## Tecnologías

- **Node.js:** el motor que ejecuta el backend.
- **Express:** organiza las rutas y recibe las solicitudes web.
- **MySQL:** la caja fuerte donde se guardan los datos.
- **JSON Web Token (JWT):** una credencial temporal que permite reconocer a una persona en las operaciones protegidas.
- **Docker Compose (opcional):** inicia el backend y MySQL juntos, como dos servicios coordinados.

## El camino de un registro o inicio de sesión

1. La persona completa el formulario en el frontend o prepara una solicitud en Insomnia.
2. El frontend envía a la API los datos como una nota JSON. El backend recibe, por ejemplo, el correo y la contraseña.
3. El backend revisa que los campos existan y tengan un formato aceptable. Si falta algo, devuelve un mensaje de error y no continúa.
4. **Al registrarse**, el backend comprueba que el correo y el nombre de usuario no estén ocupados. Convierte la contraseña en una representación protegida (hash) antes de guardarla; no guarda la contraseña original.
5. **Al iniciar sesión**, el backend busca la cuenta por correo o nombre de usuario y compara la contraseña recibida con su representación protegida. No devuelve la contraseña.
6. Si los datos de inicio de sesión son correctos, el backend entrega un token JWT. Las solicitudes protegidas lo envían después para demostrar que la persona inició sesión.
7. El backend consulta o actualiza MySQL cuando la acción lo requiere y devuelve el resultado en JSON.

La creación de una cuenta asigna el rol normal `user`. El registro público no permite convertirse en administrador.

## Antes de empezar

Hay dos formas de ejecutar KarenFlix:

1. **Recomendada para comenzar: Docker Compose.** Levanta el backend y MySQL juntos. Necesitas instalar Docker Desktop.
2. **Instalación local:** ejecutas Node.js y MySQL por separado. Es útil si ya tienes MySQL instalado.

En ambos casos necesitarás:

- **Visual Studio Code (VS Code)** para abrir y editar los archivos.
- **Node.js**, preferiblemente una versión LTS vigente, y npm (npm se instala junto con Node.js).
- **Git**, para descargar el proyecto, si todavía no lo tienes en tu equipo.
- **MySQL Workbench**, si quieres administrar o consultar MySQL con ventanas y botones.
- **Insomnia**, para probar la API sin tener que crear una pantalla frontend.
- **Docker Desktop**, solo si eliges la forma recomendada con Docker Compose.

## Instalación y ejecución con Docker Compose

Esta opción configura una base de datos MySQL y el backend como servicios coordinados.

### 1. Descargar y abrir el proyecto

Si ya tienes la carpeta del proyecto, pasa al siguiente paso. Si todavía no la tienes:

1. Abre **PowerShell** o la Terminal de Windows.
2. Escribe este comando y presiona **Enter**:

   ```powershell
   git clone https://github.com/Anderson-Oloroso/karenflix-backend.git
   ```

3. Abre VS Code.
4. Selecciona **File (Archivo) > Open Folder (Abrir carpeta)** y elige la carpeta `karenflix-backend` que acabas de descargar.
5. Si VS Code pregunta si confías en los archivos de la carpeta, confirma solo si descargaste el proyecto de una fuente en la que confías.

### 2. Preparar las variables de configuración

1. En VS Code, abre el archivo `.env` en la lista de archivos.
2. Si no existe, crea una copia de `.env.example` y llámala `.env`. En PowerShell, desde la carpeta del proyecto, puedes escribir:

   ```powershell
   Copy-Item .env.example .env
   ```

3. En `.env`, revisa las opciones de la aplicación y la base de datos. Para Docker, la configuración debe coincidir entre `DB_USER`, `DB_PASSWORD` y `DB_ROOT_PASSWORD`; usa contraseñas propias para tu entorno.
4. Cambia `JWT_SECRET` por una frase larga y privada. No compartas ni publiques el archivo `.env`.
5. El ejemplo del proyecto publica MySQL en el puerto `3307` de tu computadora y el backend en `4000`. Dentro de Docker, los servicios se comunican usando sus propios nombres y puertos; deja que `docker-compose.yml` configure esa conexión.

> **Importante:** si ya existe un `.env`, edítalo; no lo reemplaces sin revisar su contenido. No pegues contraseñas reales en capturas, mensajes públicos o repositorios.

### 3. Encender los servicios

1. Abre **Docker Desktop** y espera a que indique que está en funcionamiento.
2. En VS Code, abre el menú **Terminal > New Terminal (Nueva terminal)**.
3. Confirma que la terminal está ubicada en la carpeta `karenflix-backend`. Puedes comprobarlo escribiendo:

   ```powershell
   Get-Location
   ```

4. Escribe el siguiente comando y presiona **Enter**:

   ```powershell
   docker compose up --build
   ```

   La primera ejecución puede tardar porque Docker descarga y prepara los componentes.

5. Cuando aparezcan mensajes indicando que el servidor se ejecuta en el puerto `4000`, abre en el navegador:

   ```text
   http://localhost:4000/api/v1
   ```

   Si todo está bien, la respuesta incluirá `karenflix API funcionando correctamente`.

6. Para detener los servicios, vuelve a esa terminal y presiona **Ctrl+C**. No uses `docker compose down -v` para detenerlos: la opción `-v` elimina también el volumen que guarda la base de datos.

Docker ejecuta los archivos de inicialización de `database/` cuando crea por primera vez el almacenamiento de MySQL. Si el almacenamiento ya existía, esos scripts no se ejecutan otra vez automáticamente.

### 4. Probar la documentación interactiva

Con el servidor encendido, abre:

```text
http://localhost:4000/api-docs
```

Esta página muestra la documentación interactiva de la API. También puedes probar las solicitudes con Insomnia siguiendo el catálogo de esta guía.

## Instalación local con MySQL Workbench (sin Docker)

Usa estas instrucciones si ya tienes MySQL Server instalado y prefieres iniciarlo desde tu computadora.

1. Abre **MySQL Workbench** y conéctate a tu servidor local. Si no existe una conexión, crea una con **+** y usa el puerto de tu MySQL local, normalmente `3306`.
2. Abre una pestaña de consulta SQL y ejecuta estos archivos **en orden** desde el explorador de archivos de Workbench:
   1. `database/01-schema.sql`
   2. `database/02-seeds.sql`
   3. `database/03-procedures-triggers.sql`
3. Para abrir cada archivo, usa **File > Open SQL Script**, elige el archivo y presiona el botón del rayo para ejecutarlo.
4. **Precaución:** `01-schema.sql` empieza eliminando y creando de nuevo `karenflix_db`. Ejecutarlo borra los datos previos de esa base. Hazlo únicamente en una base de datos nueva o de pruebas y solo si aceptas perder esos datos.
5. Crea para la aplicación un usuario MySQL que tenga acceso a `karenflix_db`. Puedes hacerlo desde una pestaña SQL conectada como administrador, sustituyendo la contraseña de ejemplo por una propia:

   ```sql
   CREATE USER IF NOT EXISTS 'karen_user'@'localhost'
     IDENTIFIED BY 'REEMPLAZA_ESTA_CONTRASENA';
   GRANT ALL PRIVILEGES ON karenflix_db.* TO 'karen_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

6. En `.env`, configura `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME=karenflix_db`, `DB_USER=karen_user` y `DB_PASSWORD` con la misma contraseña que elegiste. Ajusta también `JWT_SECRET`.
7. En VS Code, abre **Terminal > New Terminal** y ejecuta:

   ```powershell
   npm install
   npm run dev
   ```

8. Comprueba en la terminal que se muestra `servidor ejecutandose en el puerto: 4000`. Prueba `http://localhost:4000/api/v1` en tu navegador.

Si prefieres usar un MySQL de Docker desde una instalación local del backend, el host y puerto son distintos: normalmente `DB_HOST=localhost` y `DB_PORT=3307`. Para una instalación local, usa el puerto de tu propio servicio MySQL.

## ¿Qué contiene cada carpeta?

El trabajo del backend vive principalmente dentro de `src/`:

| Carpeta o archivo | Explicación sencilla |
|---|---|
| `src/controllers/` | Recibe cada solicitud y prepara la respuesta que vuelve a la persona. |
| `src/models/` | Traduce las operaciones de la aplicación a consultas de datos en MySQL. |
| `src/routes/` | Es el índice de acciones disponibles: conecta cada dirección web con el controlador correspondiente. |
| `src/middlewares/` | Son controles intermedios, como revisar un token, validar datos o manejar errores. |
| `src/config/` | Guarda la configuración de la aplicación, la conexión a MySQL y Swagger. |
| `src/services/` | Aplica las reglas de negocio antes de consultar o cambiar datos. |
| `src/validators/` | Comprueba que los datos recibidos tengan el formato esperado. |
| `src/dtos/` | Da forma a los datos que la aplicación comparte como respuesta. |
| `src/utils/` | Reúne herramientas comunes usadas en distintas partes del backend. |
| `src/constants/` | Contiene valores compartidos, como los nombres de roles. |
| `database/` | Incluye el esquema de MySQL, datos de ejemplo y procedimientos o triggers. |
| `karenflix/` | Contiene una colección de solicitudes que puede importarse en herramientas compatibles con OpenCollection. |
| `src/app.js` | Ensambla Express, los controles intermedios y las rutas. |
| `src/server.js` | Conecta a la base de datos y enciende el servidor web. |
| `.env.example` | Muestra los nombres de las opciones de configuración; `.env` guarda los valores de tu equipo. |

## Diagrama de la base de datos

El siguiente diagrama muestra las tablas principales y sus relaciones. Consulta también la [documentación del modelo de datos](./database/README.md).

![Diagrama de la base de datos KarenFlix](./database/diagrams/wkb_karenflix.png)

## Probar solicitudes con Insomnia

En Insomnia, crea una solicitud nueva, elige el método y pega la URL. Para solicitudes que envían JSON, abre **Body > JSON** y pega el ejemplo. Los ejemplos usan el puerto predeterminado:

```text
http://localhost:4000
```

Todas las rutas de la API empiezan con `/api/v1`. Para las operaciones protegidas, abre la pestaña **Auth**, elige **Bearer Token** y pega el JWT recibido al iniciar sesión.

### Estado de la API

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Comprobar que la API responde | `GET` | `http://localhost:4000/api/v1` | No | No aplica |

### Autenticación y cuenta

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Crear una cuenta | `POST` | `/api/v1/auth/register` | No | Ver ejemplo A |
| Iniciar sesión | `POST` | `/api/v1/auth/login` | No | Ver ejemplo B |
| Solicitar cierre de sesión | `POST` | `/api/v1/auth/logout` | Sí, cualquier cuenta | No aplica |
| Ver mi perfil (`auth/profile`) | `GET` | `/api/v1/auth/profile` | Sí, cualquier cuenta | No aplica |
| Actualizar mi perfil (`auth/profile`) | `PUT` | `/api/v1/auth/profile` | Sí, cualquier cuenta | Ver ejemplo C |
| Eliminar mi perfil (`auth/profile`) | `DELETE` | `/api/v1/auth/profile` | Sí, cualquier cuenta | No aplica |
| Ver mi perfil (`users/me`) | `GET` | `/api/v1/users/me` | Sí, cualquier cuenta | No aplica |
| Actualizar mi perfil (`users/me`) | `PUT` | `/api/v1/users/me` | Sí, cualquier cuenta | Ver ejemplo C |
| Eliminar mi perfil (`users/me`) | `DELETE` | `/api/v1/users/me` | Sí, cualquier cuenta | No aplica |
| Consultar usuarios | `GET` | `/api/v1/users` | Sí, administrador | No aplica |
| Actualizar una cuenta de usuario | `PUT` | `/api/v1/users/:id` | Sí, administrador | Ver ejemplo C |
| Eliminar una cuenta de usuario | `DELETE` | `/api/v1/users/:id` | Sí, administrador | No aplica |

`/api/v1/auth/profile` y `/api/v1/users/me` ofrecen las mismas acciones para el perfil propio. En las rutas de administración, sustituye `:id` por el número de usuario, por ejemplo `5`.

El endpoint de cierre de sesión confirma la solicitud, pero no revoca el JWT en el servidor. Al cerrar sesión, el frontend debe borrar el token guardado; un token copiado seguirá siendo válido hasta que caduque.

**Ejemplo A — registrar una cuenta** (el rol asignado será `user`):

```json
{
  "username": "ana_cine",
  "email": "ana@example.com",
  "password": "clave-de-ejemplo-123"
}
```

**Ejemplo B — iniciar sesión.** Envía `email` o `username`, exactamente uno, junto con la contraseña:

```json
{
  "email": "ana@example.com",
  "password": "clave-de-ejemplo-123"
}
```

La respuesta correcta incluye un campo `jwt`. Copia su valor para las próximas solicitudes protegidas.

**Ejemplo C — actualizar cuenta o perfil.** Envía uno o más de estos campos: `username`, `email`, `password`.

```json
{
  "username": "ana_cine_nuevo",
  "email": "ana.nuevo@example.com"
}
```

### Categorías

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Listar categorías | `GET` | `/api/v1/categories` | No | No aplica |
| Ver una categoría | `GET` | `/api/v1/categories/:id` | No | No aplica |
| Crear una categoría | `POST` | `/api/v1/categories` | Sí, administrador | Ver ejemplo |
| Actualizar una categoría | `PUT` | `/api/v1/categories/:id` | Sí, administrador | Ver ejemplo |
| Eliminar una categoría | `DELETE` | `/api/v1/categories/:id` | Sí, administrador | No aplica |

```json
{
  "name": "Aventura",
  "description": "Historias de viajes, exploración y descubrimientos."
}
```

Para actualizar, puedes enviar solo el campo que cambia.

### Directores

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Listar directores | `GET` | `/api/v1/directors` | No | No aplica |
| Ver un director | `GET` | `/api/v1/directors/:id` | No | No aplica; opcionalmente añade `?includeMovies=true` |
| Crear un director | `POST` | `/api/v1/directors` | Sí, administrador | Ver ejemplo |
| Actualizar un director | `PUT` | `/api/v1/directors/:id` | Sí, administrador | Ver ejemplo |
| Eliminar un director | `DELETE` | `/api/v1/directors/:id` | Sí, administrador | No aplica |

```json
{
  "name": "Directora de ejemplo",
  "biography": "Una breve biografía de ejemplo.",
  "photo_url": "https://example.com/directora.jpg"
}
```

`biography` y `photo_url` son opcionales. Para actualizar, envía al menos un campo.

### Actores

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Listar actores | `GET` | `/api/v1/actors` | No | No aplica |
| Ver un actor | `GET` | `/api/v1/actors/:id` | No | No aplica |
| Crear un actor | `POST` | `/api/v1/actors` | Sí, administrador | Ver ejemplo |
| Actualizar un actor | `PUT` | `/api/v1/actors/:id` | Sí, administrador | Ver ejemplo |
| Eliminar un actor | `DELETE` | `/api/v1/actors/:id` | Sí, administrador | No aplica |

```json
{
  "name": "Actor de ejemplo",
  "biography": "Una biografía de ejemplo con al menos diez caracteres.",
  "birth_date": "1980-05-15",
  "photo_url": "https://example.com/actor.jpg"
}
```

`birth_date` debe usar el formato `AAAA-MM-DD` y no puede ser una fecha futura. `birth_date` y `photo_url` son opcionales. Para actualizar, envía al menos un campo.

### Películas

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Listar películas aprobadas | `GET` | `/api/v1/movies` | No | No aplica |
| Buscar o paginar películas | `GET` | `/api/v1/movies?category=1&title=space&page=1&limit=10` | No | No aplica |
| Ver una película | `GET` | `/api/v1/movies/:id` | No | No aplica |
| Ver películas pendientes | `GET` | `/api/v1/movies/pending` | Sí, administrador | No aplica |
| Proponer una película | `POST` | `/api/v1/movies` | Sí, cualquier cuenta | Ver ejemplo A |
| Actualizar una película | `PUT` | `/api/v1/movies/:id` | Sí, administrador | Ver ejemplo B |
| Aprobar una película | `PATCH` | `/api/v1/movies/:id/approve` | Sí, administrador | No aplica |
| Eliminar una película | `DELETE` | `/api/v1/movies/:id` | Sí, administrador | No aplica |

Los filtros `category`, `title`, `page` y `limit` son opcionales. `limit` acepta valores entre 1 y 100. Para proponer una película, el director y la categoría deben existir.

**Ejemplo A — proponer una película:**

```json
{
  "title": "Viaje de ejemplo",
  "description": "Una historia original de exploración y amistad.",
  "director_id": 1,
  "category_id": 1,
  "release_year": 2024,
  "duration_minutes": 110,
  "age_rating": "PG-13",
  "image_url": "https://example.com/poster.jpg",
  "banner_url": "https://example.com/banner.jpg",
  "trailer_url": "https://example.com/trailer"
}
```

Usa IDs que ya existan en tu base de datos. El estado inicial es `pending`; el rol de administrador es necesario para aprobar la propuesta.

**Ejemplo B — actualizar una película.** Envía uno o más campos permitidos:

```json
{
  "title": "Viaje de ejemplo actualizado",
  "status": "approved"
}
```

Los estados permitidos para la actualización son `pending`, `approved` y `rejected`.

### Favoritos

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Ver mis favoritos | `GET` | `/api/v1/favorites` | Sí, cualquier cuenta | No aplica |
| Agregar una película a favoritos | `POST` | `/api/v1/favorites` | Sí, cualquier cuenta | Ver ejemplo |
| Quitar un favorito | `DELETE` | `/api/v1/favorites/:id` | Sí, cualquier cuenta | No aplica |

```json
{
  "movie_id": 1
}
```

En la ruta DELETE, `:id` es el identificador del favorito, no el identificador de la película.

### Reseñas e interacciones

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Ver reseñas de una película | `GET` | `/api/v1/movies/:id/reviews` | No | No aplica |
| Publicar una reseña | `POST` | `/api/v1/movies/:id/reviews` | Sí, cualquier cuenta | Ver ejemplo A |
| Editar una reseña propia | `PUT` | `/api/v1/movies/:id/reviews/:reviewId` | Sí, autora o autor de la reseña | Ver ejemplo B |
| Eliminar una reseña propia | `DELETE` | `/api/v1/movies/:id/reviews/:reviewId` | Sí, autora o autor de la reseña | No aplica |
| Reaccionar a una reseña | `POST` | `/api/v1/reviews/:id/reactions` | Sí, cualquier cuenta | Ver ejemplo C |

**Ejemplo A — publicar una reseña:**

```json
{
  "title": "Una gran película",
  "comment": "Me gustó mucho la historia y la recomiendo.",
  "rating": 9
}
```

La calificación debe ser un número entero entre 1 y 10. Cada cuenta puede publicar una reseña por película.

**Ejemplo B — editar una reseña propia.** Envía uno o más campos:

```json
{
  "rating": 10,
  "comment": "Después de verla otra vez, me gustó aún más."
}
```

**Ejemplo C — reaccionar a una reseña:**

```json
{
  "reaction_type": "like"
}
```

El valor de `reaction_type` puede ser `like` o `dislike`. `:id` es el identificador de la reseña.

### Relación entre películas y actores

| Acción | Método | URL | Token / permiso | Cuerpo JSON |
|---|---|---|---|---|
| Listar relaciones | `GET` | `/api/v1/movie-actors` | No | No aplica |
| Ver una relación | `GET` | `/api/v1/movie-actors/:id` | No | No aplica |
| Ver actores de una película | `GET` | `/api/v1/movie-actors/movie/:movieId` | No | No aplica |
| Ver películas de un actor | `GET` | `/api/v1/movie-actors/actor/:actorId` | No | No aplica |
| Crear una relación | `POST` | `/api/v1/movie-actors` | Sí, administrador | Ver ejemplo |
| Actualizar una relación | `PUT` | `/api/v1/movie-actors/:id` | Sí, administrador | Ver ejemplo |
| Eliminar una relación | `DELETE` | `/api/v1/movie-actors/:id` | Sí, administrador | No aplica |

```json
{
  "movie_id": 1,
  "actor_id": 1,
  "character_name": "Personaje de ejemplo"
}
```

Los identificadores deben corresponder a películas y actores existentes; `character_name` es opcional.

## ¿Cómo enviar el token en Insomnia?

1. Envía primero la solicitud de inicio de sesión.
2. En la respuesta, busca el campo `data.jwt` y copia su valor completo.
3. Abre la solicitud protegida que quieres probar.
4. Entra en la pestaña **Auth**.
5. En el selector de tipo, elige **Bearer Token**.
6. Pega el valor del JWT en el campo del token. No escribas la palabra `Bearer`; Insomnia la añade por ti.
7. Envía la solicitud.

Si el token caducó, inicia sesión otra vez y utiliza el nuevo. Para una acción reservada a administradores necesitas una cuenta con ese rol; un token de usuario normal no basta.

## ¿Necesitas ayuda?

Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para resolver problemas de MySQL, puertos ocupados, credenciales, correos duplicados y tokens.

## Alcance de este repositorio

Este repositorio contiene la documentación y el código del **backend** de KarenFlix. No incluye el frontend ni un enlace confirmado a su repositorio; por eso esta guía no enlaza proyectos de terceros que podrían no corresponder al equipo.
