# Facturacion implementada

## Resumen

Se implemento un modulo de facturacion dentro del administrador para que CASATIC pueda gestionar facturas por socio. El sistema crea, lista, edita y descarga facturas, y permite que cada socio consulte y descargue unicamente su propia factura.

La factura queda preparada con campos de referencia DTE, pero se marca explicitamente como factura interna cuando no existe sello de recepcion de Hacienda.

## Funcionalidad para administrador

- Ver listado completo de facturas de socios.
- Buscar facturas por empresa, numero o estado.
- Generar facturas faltantes para socios que aun no tienen factura.
- Crear una nueva factura manualmente.
- Elegir el cliente/socio al crear una nueva factura.
- Seleccionar plan de membresia basado en los planes publicados en el home.
- Editar datos de la factura:
  - plan
  - periodo
  - descripcion
  - subtotal
  - estado
  - fecha de emision
  - fecha de vencimiento
  - fecha de pago
  - notas
  - datos de pago
  - datos de referencia DTE
- Descargar factura en HTML imprimible o guardable como PDF.

## Funcionalidad para socio

- Ver solo su factura asignada.
- Descargar solo su propia factura.
- No puede ver ni administrar facturas de otros socios.

## Campos principales de factura

- `Numero`
- `SocioId`
- `PlanNombre`
- `PlanPeriodo`
- `Descripcion`
- `Subtotal`
- `Iva`
- `Total`
- `Estado`
- `FechaEmision`
- `FechaVencimiento`
- `FechaPago`
- `Notas`

## Campos fiscales / DTE agregados

- `TipoDocumento`
- `CodigoGeneracion`
- `NumeroControl`
- `SelloRecepcion`
- `Ambiente`
- `CondicionOperacion`
- `FormaPago`
- `ReferenciaPago`

Estos campos permiten guardar referencias necesarias para una futura integracion real con facturacion electronica. El sistema genera automaticamente `CodigoGeneracion` y `NumeroControl` cuando no se proporcionan.

## Estados soportados

- `Pendiente`
- `Pagada`
- `Vencida`
- `Anulada`

## Calculo de montos

El sistema calcula automaticamente:

- IVA del 13%.
- Total = subtotal + IVA.

Por defecto, las facturas generadas para socios usan el plan `Socios Miembros`, con subtotal de `$400.00`, IVA `$52.00` y total `$452.00`.

## Descarga de factura

La descarga genera una representacion HTML profesional con:

- encabezado CASATIC
- numero de factura
- estado
- datos del socio
- fechas
- condicion de operacion
- forma de pago
- bloque de referencia DTE
- tabla de conceptos
- subtotal
- IVA
- total
- notas
- boton para imprimir o guardar como PDF

Si la factura no tiene `SelloRecepcion`, el documento muestra un aviso indicando que es una factura interna CASATIC y que para tener validez como Documento Tributario Electronico debe ser generada, firmada, transmitida a Hacienda y contar con sello de recepcion.

## Endpoints agregados

### Administrador

- `GET /api/facturacion`
- `POST /api/facturacion/generar-todas`
- `POST /api/facturacion`
- `PUT /api/facturacion/{id}`
- `GET /api/facturacion/{id}/descargar`

### Socio

- `GET /api/facturacion/mi-factura`
- `GET /api/facturacion/mi-factura/descargar`

### Planes

- `GET /api/facturacion/planes`

## Archivos principales modificados

- `backend/src/CasaticDirectorio.Domain/Entities/Factura.cs`
- `backend/src/CasaticDirectorio.Domain/Enums/EstadoFactura.cs`
- `backend/src/CasaticDirectorio.Api/DTOs/Facturacion/FacturaDtos.cs`
- `backend/src/CasaticDirectorio.Api/Controllers/FacturacionController.cs`
- `backend/src/CasaticDirectorio.Infrastructure/Data/AppDbContext.cs`
- `backend/src/CasaticDirectorio.Infrastructure/Data/Seed/DataSeeder.cs`
- `frontend/src/pages/admin/FacturacionPage.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/Layout/AdminLayout.jsx`

## Base de datos

Se agrego la tabla `facturas` y se incluyo una actualizacion defensiva con `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para que las columnas nuevas se creen sin borrar datos existentes.

Validacion realizada:

- 43 socios cargados.
- 43 facturas existentes.
- 0 socios sin factura.
- 43 facturas con `CodigoGeneracion`.
- 43 facturas con `NumeroControl`.

## Consideracion legal sobre DTE en El Salvador

Segun la normativa y documentacion oficial consultada del Ministerio de Hacienda, un Documento Tributario Electronico requiere generacion, firma electronica, transmision a la Administracion Tributaria y sello de recepcion otorgado por Hacienda.

Por esa razon, el sistema no presenta la factura interna como DTE fiscal si no existe `SelloRecepcion`.

Fuentes oficiales consultadas:

- https://www.mh.gob.sv/facturacion-electronica/
- https://www.mh.gob.sv/wp-content/uploads/2023/10/Guia-r%C3%A1pida-emitir-una-Factura-en-la-plataforma-Sistema-de-Facturaci%C3%B3n.pdf
- https://factura.gob.sv/wp-content/uploads/2021/11/FESVDGIIMH_GuiaIntegracionFacturaElectronicasSV.pdf
- https://transparencia.mh.gob.sv/downloads/pdf/DC5810.pdf

## Validaciones realizadas

- `dotnet build`: correcto, sin warnings ni errores.
- `npm run build`: correcto.
- Docker reconstruido.
- API healthy.
- Frontend healthy.
- Descarga de factura validada con usuario socio.
