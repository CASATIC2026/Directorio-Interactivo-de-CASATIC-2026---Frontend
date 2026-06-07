# Manual completo del sistema CASATIC

Este documento explica paso a paso como usar, administrar, levantar y mantener el sistema **Directorio Interactivo CASATIC 2026**.

El sistema tiene dos grandes areas:

1. Portal publico: visible para visitantes, empresas, aliados y publico general.
2. Panel administrativo: visible para usuarios autenticados, con permisos segun rol.

## 1. Objetivo del sistema

El proyecto sirve para gestionar y publicar informacion de socios de CASATIC. Permite:

- Mostrar un directorio publico de empresas socias.
- Buscar socios por nombre, especialidad o servicio.
- Ver el micrositio de cada socio.
- Recibir formularios de contacto enviados desde el directorio.
- Gestionar socios desde un panel administrativo.
- Gestionar usuarios y accesos.
- Crear y publicar eventos de socios.
- Subir imagenes para eventos.
- Exportar e importar socios mediante Excel.
- Consultar reportes y metricas de uso.

## 2. Tecnologias usadas

El sistema esta dividido en frontend, backend y base de datos.

### Frontend

- React 18
- Vite
- TailwindCSS
- Axios
- Lucide React para iconos

Carpeta principal:

```text
frontend/
```

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT para autenticacion
- Serilog para logs
- ClosedXML para Excel

Carpeta principal:

```text
backend/
```

### Infraestructura

- Docker Compose
- PostgreSQL
- pgAdmin
- API .NET en contenedor
- Frontend en Nginx cuando se usa Docker completo

Archivo principal:

```text
docker-compose.yml
```

## 3. Estructura general de carpetas

```text
casatic/
  backend/
    CasaticDirectorio.sln
    Dockerfile
    src/
      CasaticDirectorio.Domain/
      CasaticDirectorio.Infrastructure/
      CasaticDirectorio.Api/
  frontend/
    package.json
    vite.config.js
    src/
      api/
      components/
      context/
      lib/
      pages/
  docker-compose.yml
  README.md
  REBUILD.md
  AUDITORIA.md
  CHANGES.md
  MANUAL_COMPLETO.md
```

## 4. Roles del sistema

### Administrador

El administrador puede:

- Entrar al dashboard.
- Crear, editar, habilitar, deshabilitar y eliminar socios.
- Gestionar eventos de todos los socios.
- Aprobar eventos.
- Eliminar eventos.
- Ver formularios enviados.
- Ver reportes.
- Exportar socios a Excel.
- Importar socios desde Excel.
- Crear usuarios.
- Activar o desactivar usuarios.
- Resetear contrasenas.

### Socio

El socio puede:

- Entrar al panel.
- Editar la informacion de su empresa.
- Crear eventos para su empresa.
- Ver eventos de su empresa.
- Ver mensajes recibidos por su empresa.
- Cambiar su contrasena en el primer ingreso.

### Visitante publico

El visitante publico puede:

- Ver la pagina de inicio.
- Consultar el directorio.
- Filtrar y buscar socios.
- Entrar al micrositio de un socio.
- Ver eventos publicados.
- Contactar a un socio mediante formulario.
- Ver informacion institucional.

## 5. URLs principales

### Portal publico

```text
http://localhost:5175/
http://localhost:5175/directorio
http://localhost:5175/eventos
http://localhost:5175/presentacion
http://localhost:5175/categorias
http://localhost:5175/contacto
http://localhost:5175/faq
http://localhost:5175/ejes-estrategicos
http://localhost:5175/socio/{slug}
```

### Acceso y panel

```text
http://localhost:5175/login
http://localhost:5175/admin/login
http://localhost:5175/admin
http://localhost:5175/admin/socios
http://localhost:5175/admin/eventos
http://localhost:5175/admin/usuarios
http://localhost:5175/admin/formularios
http://localhost:5175/admin/reportes
http://localhost:5175/admin/mi-empresa
```

### Backend API

```text
http://localhost:5000/api
http://localhost:5000/swagger
http://localhost:5000/health
```

## 6. Como levantar el sistema

### Opcion A: levantar todo con Docker

Desde la carpeta `casatic/` ejecutar:

```bash
docker compose up -d --build
```

Esto levanta:

- Base de datos PostgreSQL.
- pgAdmin.
- Backend API.
- Frontend.

Para ver contenedores:

```bash
docker compose ps
```

Para ver logs:

```bash
docker compose logs -f
```

Para detener:

```bash
docker compose down
```

### Opcion B: desarrollo local

Backend:

```bash
dotnet run --project backend/src/CasaticDirectorio.Api/CasaticDirectorio.Api.csproj --launch-profile CasaticDirectorio.Api
```

Frontend:

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5175
```

El frontend queda en:

```text
http://localhost:5175
```

La API queda en:

```text
http://localhost:5000
```

## 7. Credenciales iniciales

En desarrollo, el usuario administrador inicial es:

```text
Correo: admin@casatic.org
Password: Admin123!
```

Tambien se crea un usuario de socio de prueba si la base esta vacia:

```text
Correo: prueba@prueba.com
Password: Socio123!
```

Importante: en produccion estas claves deben cambiarse mediante variables de entorno.

## 8. Variables de configuracion importantes

El sistema usa variables de entorno para la base de datos, JWT, CORS y credenciales iniciales.

Ejemplos:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
CONNECTION_STRING
JWT_KEY
JWT_ISSUER
JWT_AUDIENCE
CORS_ALLOWED_ORIGINS
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

En desarrollo tambien existen valores en:

```text
backend/src/CasaticDirectorio.Api/appsettings.Development.json
```

## 9. Portal publico

### 9.1 Inicio

Ruta:

```text
/
```

La pagina de inicio presenta informacion general de CASATIC, accesos principales y enlaces hacia el directorio.

Pasos:

1. Abrir `http://localhost:5175/`.
2. Usar el menu superior para navegar.
3. Entrar a Directorio, Eventos, Presentacion, Categorias, Contacto o FAQ.

### 9.2 Directorio de socios

Ruta:

```text
/directorio
```

Funciones:

- Lista socios visibles.
- Muestra total de socios encontrados.
- Permite busqueda por texto.
- Permite filtrar por especialidad.
- Permite filtrar por servicio.
- Permite paginar resultados.
- Permite entrar al micrositio de cada socio.

Pasos para buscar un socio:

1. Entrar a `http://localhost:5175/directorio`.
2. Escribir el nombre, descripcion o palabra clave en el buscador.
3. Seleccionar una especialidad si aplica.
4. Escribir un servicio si aplica.
5. Revisar los resultados.
6. Hacer clic sobre una tarjeta para abrir el micrositio.

Reglas importantes:

- El directorio publico muestra socios habilitados.
- Por defecto se muestran socios con estado financiero al dia.
- Los socios en mora pueden quedar deshabilitados.

### 9.3 Micrositio de socio

Ruta:

```text
/socio/{slug}
```

Funciones:

- Muestra informacion completa del socio.
- Muestra logo, descripcion, especialidades y servicios.
- Muestra datos de contacto.
- Muestra redes sociales.
- Puede mostrar ubicacion o mapa.
- Permite enviar formulario de contacto.

Pasos:

1. Entrar al directorio.
2. Hacer clic en un socio.
3. Revisar la informacion del micrositio.
4. Si se desea contactar, completar el formulario.
5. Enviar el mensaje.

Al enviar un formulario:

- El mensaje queda asociado al socio.
- El socio puede verlo desde su panel si tiene acceso.
- El administrador puede verlo desde formularios o reportes.

### 9.4 Eventos publicos

Ruta:

```text
/eventos
```

Funciones:

- Muestra eventos aprobados y proximos.
- Permite buscar por titulo o descripcion.
- Permite filtrar por tipo de evento.
- Permite filtrar por modalidad.
- Muestra imagen del evento si fue cargada.
- Muestra fecha, modalidad, lugar y socio organizador.
- Permite abrir detalles del evento.

Pasos:

1. Entrar a `http://localhost:5175/eventos`.
2. Usar el buscador si se desea encontrar un evento.
3. Filtrar por tipo o modalidad.
4. Hacer clic en una tarjeta para abrir el detalle.
5. Cerrar el detalle cuando termine la revision.

Notas:

- Solo se muestran eventos aprobados.
- Los eventos pendientes no aparecen en la pagina publica.
- Las imagenes subidas desde admin se guardan en `/uploads`.

### 9.5 Presentacion

Ruta:

```text
/presentacion
```

Muestra informacion institucional de CASATIC.

### 9.6 Categorias

Ruta:

```text
/categorias
```

Muestra agrupaciones o categorias relacionadas con socios, servicios o areas de tecnologia.

### 9.7 Contacto

Ruta:

```text
/contacto
```

Permite al visitante consultar datos generales de contacto de CASATIC.

### 9.8 FAQ

Ruta:

```text
/faq
```

Muestra preguntas frecuentes del sistema o de CASATIC.

### 9.9 Ejes estrategicos

Ruta:

```text
/ejes-estrategicos
```

Muestra informacion institucional sobre ejes estrategicos.

## 10. Inicio de sesion

Rutas:

```text
/login
/admin/login
```

Pasos:

1. Abrir la pagina de login.
2. Ingresar correo.
3. Ingresar contrasena.
4. Presionar iniciar sesion.
5. El sistema valida credenciales.
6. Si son correctas, guarda la sesion y redirige segun el rol.

Si el usuario es socio y tiene `PrimerLogin = true`, el sistema lo envia a cambiar contrasena.

## 11. Cambio de contrasena

Ruta:

```text
/admin/cambiar-password
```

Reglas de contrasena:

- Minimo 8 caracteres.
- Al menos una mayuscula.
- Al menos un numero.
- Al menos un caracter especial.

Pasos:

1. Entrar con el usuario temporal.
2. El sistema redirige a cambio de contrasena.
3. Escribir la nueva contrasena.
4. Confirmar.
5. Guardar.
6. El sistema actualiza la sesion y permite entrar al panel.

## 12. Recuperacion de contrasena

Ruta:

```text
/admin/forgot-password
```

Pasos:

1. Abrir la pantalla de recuperacion.
2. Escribir el correo.
3. Solicitar token de recuperacion.
4. En desarrollo, el backend puede devolver el token para pruebas.
5. Validar el token.
6. Crear una nueva contrasena.
7. Iniciar sesion nuevamente.

Nota de produccion:

- En produccion debe integrarse un servicio de correo real.
- El token no debe mostrarse en pantalla en produccion.

## 13. Panel administrativo

Ruta principal:

```text
/admin
```

El menu cambia segun el rol.

### Administrador ve:

- Dashboard
- Socios
- Eventos
- Formularios
- Reportes
- Usuarios

### Socio ve:

- Mi Empresa
- Eventos
- Mensajes Recibidos

Funciones generales del panel:

- Menu lateral.
- Modo claro/oscuro.
- Cerrar sesion.
- Proteccion por JWT.
- Redireccion si el usuario no tiene permisos.

## 14. Dashboard

Ruta:

```text
/admin
```

Solo administrador.

Muestra metricas como:

- Visitas semanales.
- Visitas mensuales.
- Busquedas del mes.
- Formularios del mes.
- Total de socios.
- Socios activos.
- Socios en mora.
- Logins por usuario.
- Visitas diarias.

Pasos:

1. Iniciar sesion como administrador.
2. Entrar a Dashboard.
3. Revisar los indicadores.
4. Usar la informacion para seguimiento operativo.

## 15. Gestion de socios

Ruta:

```text
/admin/socios
```

Solo administrador.

Funciones:

- Listar socios.
- Buscar socios.
- Crear socio.
- Editar socio.
- Eliminar socio.
- Activar o desactivar micrositio.
- Cambiar estado financiero.
- Asociar logo.
- Administrar datos de contacto.
- Administrar especialidades y servicios.
- Administrar redes sociales.
- Administrar marcas que representa.
- Administrar mapa.

### 15.1 Crear socio

Ruta:

```text
/admin/socios/nuevo
```

Pasos:

1. Entrar como administrador.
2. Ir a Socios.
3. Presionar Nuevo Socio.
4. Completar nombre de empresa.
5. Completar descripcion.
6. Agregar especialidades.
7. Agregar servicios.
8. Completar telefono, correo y direccion.
9. Agregar redes sociales si aplica.
10. Agregar logo si aplica.
11. Definir estado financiero.
12. Definir si queda habilitado.
13. Guardar.

Reglas:

- Si no se escribe slug, el sistema genera uno.
- El slug debe ser unico.
- La descripcion no puede exceder 150 palabras.
- Cada especialidad no puede exceder 10 palabras.
- Marcas que representa no puede exceder 50 palabras.

### 15.2 Editar socio

Ruta:

```text
/admin/socios/{id}
```

Pasos:

1. Entrar a Socios.
2. Buscar el socio.
3. Abrir editar.
4. Modificar los campos necesarios.
5. Guardar.
6. Verificar en el directorio publico.

### 15.3 Deshabilitar socio

Pasos:

1. Entrar a Socios.
2. Buscar el socio.
3. Usar la accion de habilitar/deshabilitar.
4. Confirmar el cambio.

Efecto:

- Si queda deshabilitado, el micrositio no aparece publicamente.

### 15.4 Cambiar estado financiero

Estados:

```text
AlDia
EnMora
```

Pasos:

1. Entrar a Socios.
2. Seleccionar el socio.
3. Cambiar estado financiero.
4. Guardar.

Regla:

- Si un socio pasa a `EnMora`, se deshabilita automaticamente.

## 16. Mi Empresa

Ruta:

```text
/admin/mi-empresa
```

Solo socio.

Funciones:

- Ver datos de su propia empresa.
- Editar descripcion.
- Editar especialidades.
- Editar servicios.
- Editar redes sociales.
- Editar telefono.
- Editar direccion.
- Editar logo.
- Editar marcas que representa.

Pasos:

1. Iniciar sesion como socio.
2. Entrar a Mi Empresa.
3. Editar los campos necesarios.
4. Guardar.
5. Revisar el micrositio publico.

Limitacion:

- Un socio solo edita su propia empresa.
- No puede editar otras empresas.

## 17. Gestion de eventos

Ruta:

```text
/admin/eventos
```

Disponible para administrador y socio.

Funciones:

- Crear evento.
- Seleccionar socio organizador.
- Subir imagen del evento.
- Ver eventos creados.
- Expandir detalles.
- Aprobar evento, solo administrador.
- Eliminar evento, solo administrador.

### 17.1 Crear evento como administrador

Pasos:

1. Iniciar sesion como administrador.
2. Entrar a Eventos.
3. Presionar Nuevo Evento.
4. Seleccionar el socio en el listado.
5. Escribir titulo.
6. Escribir descripcion.
7. Elegir tipo de evento.
8. Elegir modalidad.
9. Seleccionar fecha de inicio.
10. Seleccionar fecha de fin si aplica.
11. Escribir lugar o enlace.
12. Subir imagen si aplica.
13. Crear evento.

Resultado:

- Si lo crea un administrador, el evento queda aprobado automaticamente.
- Aparece en la pagina publica `/eventos` si su fecha es futura.

### 17.2 Crear evento como socio

Pasos:

1. Iniciar sesion como socio.
2. Entrar a Eventos.
3. Presionar Nuevo Evento.
4. Completar titulo, descripcion, tipo, modalidad, fechas y lugar.
5. Subir imagen si aplica.
6. Crear evento.

Resultado:

- El evento queda pendiente.
- Un administrador debe aprobarlo.
- Hasta que no se apruebe, no aparece publicamente.

### 17.3 Aprobar evento

Solo administrador.

Pasos:

1. Entrar a Eventos.
2. Buscar eventos pendientes.
3. Presionar aprobar.
4. El evento pasa a aprobado.
5. Si es futuro, aparece en `/eventos`.

### 17.4 Eliminar evento

Solo administrador.

Pasos:

1. Entrar a Eventos.
2. Buscar el evento.
3. Presionar eliminar.
4. Confirmar.

### 17.5 Imagenes de eventos

El sistema acepta archivos con MIME `image/*`.

Ejemplos:

- JPG
- JPEG
- PNG
- WebP
- GIF
- SVG
- Cualquier otro formato que el navegador envie como imagen

Limite:

```text
10 MB
```

Ruta de subida:

```text
POST /api/upload/image
```

Ruta publica de imagenes:

```text
/uploads/{archivo}
```

Compatibilidad:

```text
POST /api/upload/logo
```

tambien sigue existiendo para pantallas antiguas.

## 18. Formularios y mensajes

Ruta:

```text
/admin/formularios
```

### Administrador

El administrador puede ver formularios recibidos por todos los socios.

Pasos:

1. Iniciar sesion como administrador.
2. Ir a Formularios.
3. Revisar nombre, correo, mensaje, fecha y socio.

### Socio

El socio ve mensajes recibidos por su propia empresa.

Pasos:

1. Iniciar sesion como socio.
2. Ir a Mensajes Recibidos.
3. Revisar mensajes enviados desde su micrositio.

## 19. Reportes

Ruta:

```text
/admin/reportes
```

Solo administrador.

Funciones:

- Ver metricas del dashboard.
- Ver busquedas realizadas.
- Ver formularios recibidos.
- Exportar socios a Excel.
- Importar socios desde Excel.

### 19.1 Exportar socios

Pasos:

1. Iniciar sesion como administrador.
2. Entrar a Reportes.
3. Presionar Exportar Socios.
4. Descargar el archivo `.xlsx`.

Columnas exportadas:

- Nombre Empresa
- Slug
- Email Contacto
- Telefono
- Direccion
- Descripcion
- Especialidades
- Servicios
- Marcas Representa
- Estado Financiero
- Habilitado
- Mapa URL
- Logo URL
- Website
- Facebook
- LinkedIn
- Twitter
- Instagram
- YouTube
- Fecha Creacion

### 19.2 Importar socios

Pasos:

1. Preparar archivo `.xlsx`.
2. Incluir encabezados reconocibles, por ejemplo `Nombre Empresa`.
3. Entrar a Reportes.
4. Seleccionar importar socios.
5. Subir archivo.
6. Revisar resultado: creados, actualizados y errores.

Reglas:

- Solo se aceptan `.xlsx`.
- Maximo 10 MB.
- Si encuentra un socio por nombre o slug, lo actualiza.
- Si no existe, lo crea.

## 20. Gestion de usuarios

Ruta:

```text
/admin/usuarios
```

Solo administrador.

Funciones:

- Listar usuarios.
- Crear usuarios.
- Activar o desactivar usuarios.
- Resetear contrasena.
- Eliminar usuarios.
- Asociar usuarios a socios.

### 20.1 Crear usuario

Pasos:

1. Iniciar sesion como administrador.
2. Entrar a Usuarios.
3. Presionar crear usuario.
4. Escribir correo.
5. Seleccionar rol.
6. Si el rol requiere socio, seleccionar socio.
7. Guardar.
8. Copiar la contrasena temporal que se muestra una sola vez.
9. Entregar la contrasena al usuario por un canal seguro.

Reglas:

- El correo debe ser unico.
- La contrasena temporal se genera automaticamente.
- El usuario debe cambiar la contrasena en el primer login.
- Si el usuario es administrador, no se asocia a socio.
- Si el usuario es de socio, debe asociarse a un socio.

### 20.2 Activar o desactivar usuario

Pasos:

1. Entrar a Usuarios.
2. Buscar usuario.
3. Cambiar estado activo/inactivo.

Efecto:

- Un usuario inactivo no puede iniciar sesion.

### 20.3 Resetear contrasena

Pasos:

1. Entrar a Usuarios.
2. Buscar usuario.
3. Presionar resetear contrasena.
4. El sistema genera una nueva contrasena temporal.
5. Entregarla por un canal seguro.
6. El usuario la cambia al entrar.

### 20.4 Eliminar usuario

Pasos:

1. Entrar a Usuarios.
2. Buscar usuario.
3. Eliminar.
4. Confirmar.

## 21. Endpoints principales

### Autenticacion

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/cambiar-password
POST /api/auth/recuperar-password
POST /api/auth/validar-token-recuperacion
POST /api/auth/restablecer-password
```

### Directorio publico

```text
GET /api/directorio
GET /api/directorio/socio/{slug}
GET /api/directorio/company/{id}
GET /api/directorio/especialidades
GET /api/directorio/servicios
```

### Socios

```text
GET    /api/socios
GET    /api/socios/{id}
POST   /api/socios
PUT    /api/socios/{id}
DELETE /api/socios/{id}
PATCH  /api/socios/{id}/toggle-habilitado
PATCH  /api/socios/{id}/estado-financiero
```

### Eventos

```text
GET    /api/eventos
GET    /api/eventos/proximos
GET    /api/eventos/{id}
POST   /api/eventos
PUT    /api/eventos/{id}/aprobar
DELETE /api/eventos/{id}
```

### Formularios

```text
POST /api/formulariocontacto/{socioId}
GET  /api/formulariocontacto
GET  /api/formulariocontacto/mi-socio
GET  /api/formulariocontacto/socio/{socioId}
```

### Reportes

```text
GET  /api/reportes/dashboard
GET  /api/reportes/busquedas
GET  /api/reportes/formularios
GET  /api/reportes/exportar-socios
POST /api/reportes/importar-socios
```

### Usuarios

```text
GET    /api/usuarios
GET    /api/usuarios/{id}
POST   /api/usuarios
PATCH  /api/usuarios/{id}/toggle-activo
POST   /api/usuarios/{id}/reset-password
DELETE /api/usuarios/{id}
```

### Subidas

```text
POST /api/upload/image
POST /api/upload/logo
```

### Salud

```text
GET /health
```

## 22. Base de datos

Tablas principales:

- `socios`
- `usuarios`
- `eventos`
- `formularios_contacto`
- `logs_actividad`

### Socios

Guarda informacion de empresas.

Campos clave:

- NombreEmpresa
- Slug
- Descripcion
- Especialidades
- Servicios
- Redes sociales
- Telefono
- Direccion
- LogoUrl
- EmailContacto
- MapaUrl
- MarcasRepresenta
- EstadoFinanciero
- Habilitado

### Usuarios

Guarda accesos.

Campos clave:

- Email
- PasswordHash
- Rol
- PrimerLogin
- Activo
- SocioId
- TokenRecuperacion

### Eventos

Guarda eventos.

Campos clave:

- SocioId
- UsuarioId
- Titulo
- Slug
- Descripcion
- Tipo
- Modalidad
- FechaInicio
- FechaFin
- Lugar
- ImageUrl
- Estado
- Habilitado
- Destacado
- PublicadoAt

### Formularios

Guarda mensajes enviados desde micrositios.

Campos clave:

- SocioId
- Nombre
- Correo
- Mensaje
- Fecha

### Logs

Guarda actividad del sistema.

Eventos registrados:

- Login
- Busqueda
- Visita a micrositio
- Cambio de contrasena
- CRUD de socio

## 23. Seguridad

El sistema incluye:

- JWT para autenticacion.
- Roles para autorizacion.
- Hash BCrypt para contrasenas.
- Rate limiting en endpoints sensibles.
- Validacion de contrasena.
- Limpieza de sesion si hay error 401.
- CORS configurable.
- Headers de seguridad.
- Usuario no-root en Docker para API.
- Mensajes genericos en login y recuperacion para evitar enumeracion.

## 24. Archivos subidos

Los logos se sirven desde:

```text
/logos
```

Las imagenes generales, incluyendo eventos, se sirven desde:

```text
/uploads
```

En Docker se usan volumenes:

```text
uploads
event_uploads
```

Esto evita perder imagenes al recrear contenedores.

## 25. Comandos utiles

### Compilar frontend

```bash
cd frontend
npm run build
```

### Levantar frontend en desarrollo

```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5175
```

### Compilar backend

```bash
dotnet build backend/CasaticDirectorio.sln
```

### Levantar API local

```bash
dotnet run --project backend/src/CasaticDirectorio.Api/CasaticDirectorio.Api.csproj --launch-profile CasaticDirectorio.Api
```

### Levantar Docker

```bash
docker compose up -d --build
```

### Reconstruir solo API

```bash
docker compose up -d --build api
```

### Ver logs de API

```bash
docker logs casatic-api --tail 100
```

### Ver salud de API

```bash
curl http://localhost:5000/health
```

## 26. Flujo completo recomendado para administrar el sistema

1. Levantar el sistema.
2. Entrar como administrador.
3. Revisar que el dashboard cargue.
4. Entrar a Socios.
5. Crear o importar socios.
6. Revisar que aparezcan en Directorio.
7. Crear usuarios para socios.
8. Entregar contrasenas temporales.
9. Pedir a cada socio que cambie su contrasena.
10. Pedir a cada socio que actualice Mi Empresa.
11. Crear eventos o aprobar eventos enviados por socios.
12. Revisar `/eventos` para confirmar publicacion.
13. Revisar formularios recibidos.
14. Exportar reportes cuando sea necesario.
15. Mantener respaldos de base de datos y volumenes de imagenes.

## 27. Flujo completo para un socio

1. Recibir usuario y contrasena temporal.
2. Entrar a `/login`.
3. Cambiar contrasena si es primer ingreso.
4. Entrar a Mi Empresa.
5. Actualizar informacion publica.
6. Revisar micrositio publico.
7. Entrar a Eventos.
8. Crear eventos para la empresa.
9. Esperar aprobacion del administrador si aplica.
10. Revisar mensajes recibidos.

## 28. Flujo completo para visitante

1. Entrar a la pagina principal.
2. Abrir Directorio.
3. Buscar empresa, especialidad o servicio.
4. Entrar al micrositio de un socio.
5. Revisar informacion.
6. Enviar formulario de contacto si desea comunicarse.
7. Abrir Eventos para ver proximas actividades.

## 29. Mantenimiento y buenas practicas

### Antes de produccion

1. Cambiar `SEED_ADMIN_PASSWORD`.
2. Cambiar `JWT_KEY` por una clave fuerte.
3. Configurar CORS solo con dominios reales.
4. Configurar HTTPS.
5. Configurar correo para recuperacion de contrasena.
6. Revisar permisos de volumenes Docker.
7. Hacer respaldo inicial de base de datos.
8. Probar subida de imagenes.
9. Probar exportacion e importacion de socios.
10. Probar usuarios admin y socio.

### Respaldos

Respaldar:

- Base de datos PostgreSQL.
- Volumen de logos.
- Volumen de uploads.
- Archivo `.env`.

### Monitoreo

Revisar:

- Logs de API.
- Estado de contenedores.
- Espacio en disco.
- Crecimiento de imagenes subidas.
- Errores 500.
- Accesos fallidos.

## 30. Problemas comunes

### El frontend no carga datos

Revisar:

1. Que la API este arriba en `http://localhost:5000`.
2. Que Vite tenga proxy `/api` hacia `localhost:5000`.
3. Que el token no este vencido.
4. Que CORS permita el origen.

### No puedo iniciar sesion

Revisar:

1. Correo y contrasena.
2. Que el usuario este activo.
3. Que la API responda.
4. Que la base de datos tenga usuarios.

### No aparecen socios en el directorio

Revisar:

1. Que el socio este habilitado.
2. Que el estado financiero sea `AlDia`.
3. Que el slug sea correcto.
4. Que el backend responda `/api/directorio`.

### No aparecen eventos publicos

Revisar:

1. Que el evento este aprobado.
2. Que este habilitado.
3. Que la fecha sea futura.
4. Que tenga socio valido.
5. Que `/api/eventos/proximos` devuelva datos.

### No sube la imagen

Revisar:

1. Que el archivo sea imagen.
2. Que pese menos de 10 MB.
3. Que el usuario este autenticado.
4. Que tenga rol Admin o Socio.
5. Que el volumen `/uploads` tenga permisos.

### Docker no levanta

Revisar:

1. Que Docker Desktop este abierto.
2. Que los puertos 5000, 5175, 5432, 5050 u 80 no esten ocupados.
3. Que exista `.env`.
4. Que las variables de entorno esten completas.
5. Revisar logs con `docker compose logs`.

## 31. Checklist de prueba funcional

Despues de cambios importantes, probar:

1. Login admin.
2. Login socio.
3. Cambio de contrasena.
4. Directorio publico.
5. Micrositio de socio.
6. Formulario de contacto.
7. Crear socio.
8. Editar socio.
9. Crear usuario.
10. Resetear contrasena.
11. Crear evento admin.
12. Crear evento socio.
13. Aprobar evento.
14. Subir imagen de evento.
15. Ver evento en `/eventos`.
16. Exportar socios.
17. Importar socios.
18. Dashboard.
19. Reportes.
20. Cerrar sesion.

## 32. Notas finales

Este manual describe el comportamiento actual del proyecto. Si se agregan nuevas pantallas, endpoints o reglas de negocio, este archivo debe actualizarse junto con el codigo.

Archivo recomendado para revisar junto a este manual:

```text
README.md
REBUILD.md
AUDITORIA.md
CHANGES.md
```

