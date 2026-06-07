-- PostgreSQL Schema for CASATIC Directorio 2026
-- Create pgcrypto extension for UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: socios (Companies/Partners)
CREATE TABLE IF NOT EXISTS socios (
    "Id"               UUID          NOT NULL DEFAULT gen_random_uuid(),
    "NombreEmpresa"    VARCHAR(300)  NOT NULL,
    "Slug"             VARCHAR(300)  NOT NULL UNIQUE,
    "Descripcion"      TEXT          NOT NULL DEFAULT '',
    "Especialidades"   TEXT[]        NOT NULL DEFAULT '{}',
    "Servicios"        TEXT[]        NOT NULL DEFAULT '{}',
    "RsWebsite"        VARCHAR(500)  NOT NULL DEFAULT '',
    "RsFacebook"       VARCHAR(500)  NOT NULL DEFAULT '',
    "RsLinkedin"       VARCHAR(500)  NOT NULL DEFAULT '',
    "RsTwitter"        VARCHAR(500)  NOT NULL DEFAULT '',
    "RsInstagram"      VARCHAR(500)  NOT NULL DEFAULT '',
    "RsYoutube"        VARCHAR(500)  NOT NULL DEFAULT '',
    "Telefono"         TEXT          NOT NULL DEFAULT '',
    "Direccion"        TEXT          NOT NULL DEFAULT '',
    "LogoUrl"          TEXT          NOT NULL DEFAULT '',
    "EmailContacto"    TEXT          NOT NULL DEFAULT '',
    "MapaUrl"          TEXT          NOT NULL DEFAULT '',
    "MarcasRepresenta" TEXT          NOT NULL DEFAULT '',
    "EstadoFinanciero" VARCHAR(20)   NOT NULL DEFAULT 'AlDia',
    "Habilitado"       BOOLEAN       NOT NULL DEFAULT TRUE,
    "CreatedAt"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "UpdatedAt"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "SearchVector"     TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('spanish',
            coalesce("NombreEmpresa", '') || ' ' || coalesce("Descripcion", ''))
    ) STORED,
    CONSTRAINT pk_socios PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS ix_socios_search_vector ON socios USING GIN ("SearchVector");
CREATE INDEX IF NOT EXISTS ix_socios_slug ON socios("Slug");

-- Table: usuarios (User Accounts)
CREATE TABLE IF NOT EXISTS usuarios (
    "Id"                     UUID          NOT NULL DEFAULT gen_random_uuid(),
    "Email"                  VARCHAR(256)  NOT NULL UNIQUE,
    "PasswordHash"           TEXT          NOT NULL,
    "Rol"                    VARCHAR(20)   NOT NULL DEFAULT 'Usuario',
    "PrimerLogin"            BOOLEAN       NOT NULL DEFAULT TRUE,
    "Activo"                 BOOLEAN       NOT NULL DEFAULT TRUE,
    "CreatedAt"              TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "TokenRecuperacion"      VARCHAR(500)  DEFAULT NULL,
    "FechaExpiracionToken"   TIMESTAMPTZ   DEFAULT NULL,
    "SocioId"                UUID          REFERENCES socios("Id") ON DELETE SET NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS ix_usuarios_email ON usuarios("Email");
CREATE INDEX IF NOT EXISTS ix_usuarios_socio_id ON usuarios("SocioId");

-- Table: formularios_contacto (Contact Forms)
CREATE TABLE IF NOT EXISTS formularios_contacto (
    "Id"      UUID          NOT NULL DEFAULT gen_random_uuid(),
    "SocioId" UUID          NOT NULL,
    "Nombre"  VARCHAR(200)  NOT NULL,
    "Correo"  VARCHAR(256)  NOT NULL,
    "Mensaje" TEXT          NOT NULL,
    "Fecha"   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "Leido"   BOOLEAN       NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_formularios_contacto PRIMARY KEY ("Id"),
    CONSTRAINT fk_formularios_socios FOREIGN KEY ("SocioId")
        REFERENCES socios("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_formularios_contacto_socio_id ON formularios_contacto("SocioId");

-- Table: logs_actividad (Activity Logs)
CREATE TABLE IF NOT EXISTS logs_actividad (
    "Id"         UUID          NOT NULL DEFAULT gen_random_uuid(),
    "TipoEvento" VARCHAR(30)   NOT NULL,
    "Fecha"      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "UsuarioId"  UUID          REFERENCES usuarios("Id") ON DELETE SET NULL,
    "SocioId"    UUID          REFERENCES socios("Id") ON DELETE SET NULL,
    "Ip"         VARCHAR(45)   DEFAULT NULL,
    "UserAgent"  TEXT          DEFAULT NULL,
    "Query"      TEXT          DEFAULT NULL,
    CONSTRAINT pk_logs_actividad PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS ix_logs_actividad_fecha ON logs_actividad("Fecha" DESC);
CREATE INDEX IF NOT EXISTS ix_logs_actividad_usuario_id ON logs_actividad("UsuarioId");
CREATE INDEX IF NOT EXISTS ix_logs_actividad_socio_id ON logs_actividad("SocioId");
CREATE INDEX IF NOT EXISTS ix_logs_actividad_tipo_evento ON logs_actividad("TipoEvento");

-- Table: eventos (Events)
CREATE TABLE IF NOT EXISTS eventos (
    "Id"           UUID          NOT NULL DEFAULT gen_random_uuid(),
    "SocioId"      UUID          NOT NULL,
    "UsuarioId"    UUID          DEFAULT NULL,
    "Titulo"       VARCHAR(300)  NOT NULL,
    "Slug"         VARCHAR(300)  NOT NULL UNIQUE,
    "Descripcion"  TEXT          NOT NULL,
    "Tipo"         VARCHAR(50)   NOT NULL,
    "Modalidad"    VARCHAR(20)   NOT NULL,
    "FechaInicio"  TIMESTAMPTZ   NOT NULL,
    "FechaFin"     TIMESTAMPTZ   DEFAULT NULL,
    "Lugar"        TEXT          NOT NULL DEFAULT '',
    "ImageUrl"     TEXT          NOT NULL DEFAULT '',
    "Estado"       VARCHAR(20)   NOT NULL DEFAULT 'Pendiente',
    "Habilitado"   BOOLEAN       NOT NULL DEFAULT TRUE,
    "Destacado"    BOOLEAN       NOT NULL DEFAULT FALSE,
    "PublicadoAt"  TIMESTAMPTZ   DEFAULT NULL,
    "CreatedAt"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "UpdatedAt"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_eventos PRIMARY KEY ("Id"),
    CONSTRAINT fk_eventos_socios FOREIGN KEY ("SocioId")
        REFERENCES socios("Id") ON DELETE CASCADE,
    CONSTRAINT fk_eventos_usuarios FOREIGN KEY ("UsuarioId")
        REFERENCES usuarios("Id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ix_eventos_slug ON eventos("Slug");
CREATE INDEX IF NOT EXISTS ix_eventos_fecha_inicio ON eventos("FechaInicio");
CREATE INDEX IF NOT EXISTS ix_eventos_estado ON eventos("Estado");
CREATE INDEX IF NOT EXISTS ix_eventos_destacado ON eventos("Destacado");
CREATE INDEX IF NOT EXISTS ix_eventos_socio_id ON eventos("SocioId");
CREATE INDEX IF NOT EXISTS ix_eventos_usuario_id ON eventos("UsuarioId");

-- Table: facturas (Membership invoices)
CREATE TABLE IF NOT EXISTS facturas (
    "Id"               UUID          NOT NULL DEFAULT gen_random_uuid(),
    "SocioId"          UUID          NOT NULL,
    "Numero"           VARCHAR(40)   NOT NULL UNIQUE,
    "PlanNombre"       VARCHAR(120)  NOT NULL,
    "PlanPeriodo"      VARCHAR(40)   NOT NULL,
    "Descripcion"      TEXT          NOT NULL,
    "Subtotal"         NUMERIC(12,2) NOT NULL,
    "Iva"              NUMERIC(12,2) NOT NULL,
    "Total"            NUMERIC(12,2) NOT NULL,
    "Estado"           VARCHAR(20)   NOT NULL DEFAULT 'Pendiente',
    "FechaEmision"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "FechaVencimiento" TIMESTAMPTZ   NOT NULL,
    "FechaPago"        TIMESTAMPTZ   DEFAULT NULL,
    "Notas"            TEXT          NOT NULL DEFAULT '',
    "CreatedAt"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    "UpdatedAt"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT pk_facturas PRIMARY KEY ("Id"),
    CONSTRAINT fk_facturas_socios FOREIGN KEY ("SocioId")
        REFERENCES socios("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_facturas_numero ON facturas("Numero");
CREATE UNIQUE INDEX IF NOT EXISTS ix_facturas_socio_id ON facturas("SocioId");
CREATE INDEX IF NOT EXISTS ix_facturas_estado ON facturas("Estado");
CREATE INDEX IF NOT EXISTS ix_facturas_fecha_vencimiento ON facturas("FechaVencimiento");
