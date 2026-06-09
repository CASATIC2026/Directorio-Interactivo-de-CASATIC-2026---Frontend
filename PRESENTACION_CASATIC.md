# Directorio Interactivo CASATIC 2026
### Documento de presentación — 15 minutos

---

## ¿Qué es el sistema?

El **Directorio Interactivo CASATIC 2026** es una plataforma web oficial de CASATIC que centraliza toda la información de las empresas socias y la pone a disposición del público de forma organizada, moderna y fácil de consultar.

El sistema reemplaza la necesidad de directorios impresos, listas en PDF o información dispersa. Todo está en un solo lugar, siempre actualizado y accesible desde cualquier dispositivo.

---

## ¿Para quién es?

El sistema atiende a tres tipos de usuarios:

| Quién | Qué hace |
|---|---|
| **Visitante público** | Busca empresas socias, conoce sus servicios y se pone en contacto con ellas |
| **Empresa socia** | Gestiona su propio perfil y publica sus eventos |
| **Administrador CASATIC** | Administra toda la plataforma: socios, usuarios, eventos, facturas y reportes |

---

## ¿Qué puede hacer un visitante desde la web?

Cualquier persona que ingrese al sitio puede, sin necesidad de crear cuenta:

- **Explorar el directorio completo** de empresas socias de CASATIC.
- **Buscar por nombre, especialidad o servicio** — por ejemplo, encontrar todas las empresas que ofrecen ciberseguridad o desarrollo de software.
- **Ingresar al micrositio de cada empresa**, donde verá su descripción, logo, servicios, redes sociales, datos de contacto y ubicación en mapa.
- **Enviar un mensaje directo** a una empresa a través del formulario de contacto integrado en su micrositio.
- **Ver la agenda de eventos** próximos organizados por empresas socias, con filtros por tipo (presencial, virtual, híbrido).
- Consultar información institucional de CASATIC: presentación, ejes estratégicos, categorías de socios, preguntas frecuentes y contacto.

---

## ¿Qué puede hacer una empresa socia?

Cada empresa socia tiene acceso a un panel privado donde puede:

- **Actualizar su perfil público**: descripción, especialidades, servicios que ofrece, redes sociales, teléfono, dirección y logo.
- **Ver los mensajes** que los visitantes les han enviado desde su micrositio.
- **Publicar eventos** de su empresa (capacitaciones, webinars, lanzamientos). El evento entra en revisión y, una vez aprobado por el administrador, aparece en la agenda pública.
- **Cambiar su contraseña** en cualquier momento.
- **Descargar su factura** de membresía.

> Al ingresar por primera vez, el sistema obliga a cambiar la contraseña temporal. Esto garantiza que solo la empresa conozca sus credenciales de acceso.

---

## ¿Qué puede hacer el administrador?

El administrador de CASATIC tiene control total sobre la plataforma:

**Gestión de socios**
- Crear, editar y dar de baja empresas socias.
- Habilitar o deshabilitar la visibilidad pública de una empresa.
- Registrar el estado financiero de cada socio (al día / en mora). Si una empresa entra en mora, el sistema la oculta automáticamente del directorio público.
- Importar socios masivamente desde un archivo Excel y exportar el listado completo.

**Gestión de usuarios**
- Crear cuentas para el equipo de cada empresa socia.
- Activar, desactivar o eliminar usuarios.
- Resetear contraseñas con un clic.

**Gestión de eventos**
- Aprobar o rechazar eventos enviados por las empresas socias.
- Crear eventos directamente desde el panel (quedan aprobados de forma automática).
- Subir imágenes para los eventos.

**Facturación**
- Generar, editar y hacer seguimiento de las facturas de membresía de cada socio.
- Descargar facturas en formato PDF.
- Ver qué facturas están pendientes, pagadas, vencidas o anuladas.

**Reportes y métricas**
- Dashboard con indicadores en tiempo real: visitas al sitio, búsquedas realizadas, formularios recibidos, socios activos y socios en mora.
- Historial de búsquedas del directorio.
- Listado completo de formularios de contacto recibidos.

---

## Seguridad del sistema

El sistema fue diseñado siguiendo estándares de seguridad internacionales (OWASP Top 10). A continuación se explica qué protege cada medida, sin tecnicismos.

### El problema que había antes

Antes de la implementación actual, las contraseñas de la base de datos y las claves de seguridad del sistema estaban escritas directamente en el código fuente, visible para cualquier persona que tuviera acceso al repositorio. Esto significaba que cualquier colaborador técnico podía, sin intención maliciosa, exponer credenciales al compartir código.

### Cómo se resolvió

**1. Las credenciales viven fuera del código**
Las contraseñas y claves de seguridad ya no están escritas en ningún archivo del proyecto. Se almacenan en un archivo de entorno separado que nunca se sube a internet y solo existe en el servidor de producción o en la máquina del desarrollador. Es como tener la llave de la caja fuerte guardada en un lugar distinto al manual de instrucciones.

**2. Las contraseñas de los usuarios nunca se guardan en texto plano**
Cuando un usuario registra una contraseña, el sistema la transforma usando un algoritmo de cifrado (BCrypt) antes de guardarla. Ni el administrador puede ver las contraseñas de los usuarios. Si alguien accediera a la base de datos, solo vería cadenas de caracteres sin sentido.

**3. Las sesiones se protegen con tokens firmados (JWT)**
Al iniciar sesión, el sistema entrega un "pase digital" firmado que el usuario presenta en cada acción. Este pase tiene fecha de vencimiento y no puede ser falsificado. Si alguien intenta manipularlo, el sistema lo rechaza automáticamente.

**4. Límite de intentos de acceso**
Los puntos críticos del sistema (login, recuperación de contraseña) tienen límite de solicitudes por minuto. Esto impide ataques automatizados que intenten adivinar contraseñas probando miles de combinaciones.

**5. Separación de roles con acceso restringido**
Cada usuario solo puede ver y hacer lo que su rol permite. Un socio no puede ver los datos de otro socio, no puede aprobar eventos, no puede acceder a la facturación global. El sistema valida esto en cada acción, no solo en la pantalla.

**6. Registro de actividad**
El sistema lleva un log de eventos importantes: inicios de sesión, cambios de contraseña, creación y edición de socios. Esto permite detectar actividad inusual.

**7. El sistema no revela información de más en los errores**
Si alguien intenta recuperar la contraseña de un correo que no existe, el sistema responde exactamente igual que si existiera. Esto impide que un atacante use el formulario para saber qué correos están registrados.

**8. Los archivos de respaldo nunca se publican**
Las copias de seguridad de la base de datos y los logs del servidor están excluidos del repositorio de código. Solo existen en las máquinas autorizadas.

---

## Facturación: cómo funciona y por qué se diseñó así

### El problema que resuelve

CASATIC necesita emitir documentos de cobro a sus empresas socias por la membresía anual. Sin este módulo, ese proceso se hacía manualmente o con herramientas externas. El módulo integra la facturación directamente dentro de la plataforma, asociada a cada socio.

### Cómo funciona para el administrador

1. El administrador ingresa al módulo de facturación y ve el listado completo de todas las facturas de los socios.
2. Puede buscar por empresa, número de factura o estado.
3. Si hay socios sin factura, puede generarlas todas con un solo clic.
4. Al crear una factura, selecciona el socio, el plan de membresía y el período. El sistema calcula automáticamente el IVA del 13% y el total.
5. Puede editar los datos de la factura: fecha de emisión, fecha de vencimiento, fecha de pago efectivo, notas y datos de referencia.
6. Descarga la factura en un formato imprimible o guardable como PDF.

**Plan y montos por defecto:**
- Plan: Socios Miembros
- Subtotal: $400.00
- IVA (13%): $52.00
- **Total: $452.00**

### Cómo funciona para el socio

El socio solo tiene acceso a su propia factura. No puede ver ni descargar las facturas de otras empresas. Desde su panel puede:
- Ver el estado de su factura (pendiente, pagada, vencida o anulada).
- Descargar su factura en PDF.

### Estados de factura

| Estado | Significado |
|---|---|
| **Pendiente** | Emitida pero aún no pagada |
| **Pagada** | El pago fue confirmado por el administrador |
| **Vencida** | Superó la fecha límite sin pago |
| **Anulada** | Fue cancelada por el administrador |

### Por qué se diseñó así: la razón legal

El sistema fue diseñado pensando en la normativa salvadoreña de **Documentos Tributarios Electrónicos (DTE)** del Ministerio de Hacienda. Según esta normativa, para que una factura tenga validez fiscal, debe:

1. Generarse con el formato oficial.
2. Firmarse electrónicamente.
3. Transmitirse al sistema de Hacienda.
4. Recibir un sello de recepción oficial.

El sistema actual **genera facturas internas** que sirven como comprobante de cobro entre CASATIC y sus socios, pero las presenta claramente como documentos internos cuando no cuentan con el sello oficial. Esto es intencional y correcto: evita presentar como DTE oficial algo que no lo es.

Al mismo tiempo, el sistema ya incluye todos los campos necesarios para una futura integración con la facturación electrónica oficial de Hacienda (código de generación, número de control, sello de recepción, condición de operación, forma de pago). Cuando CASATIC decida integrar el sistema con el MH, los datos ya están estructurados correctamente y la transición será directa.

**En resumen:** las facturas actuales son documentos de cobro válidos para el control interno de CASATIC. La arquitectura está lista para convertirse en facturación electrónica oficial sin necesidad de rediseñar el módulo.

---

## Estado actual del sistema

- **43 empresas socias** registradas con sus facturas generadas.
- El sistema pasó por una auditoría completa en mayo 2026 donde se identificaron y corrigieron 35 observaciones, incluyendo vulnerabilidades de seguridad y errores funcionales.
- Está listo para producción.

---

*Directorio Interactivo CASATIC 2026*
