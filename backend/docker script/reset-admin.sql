UPDATE usuarios
SET "PasswordHash" = '$2b$11$HjV62jENbKZ8pj28RNW6YuhVunyDdYgAgiaLw/WgG5FkNxishgSLC',
    "PrimerLogin" = true,
    "Activo" = true,
    "Rol" = 'Admin',
    "SocioId" = NULL
WHERE "Email" = 'admin@casatic.sv';

INSERT INTO usuarios ("Id", "Email", "PasswordHash", "Rol", "PrimerLogin", "Activo", "SocioId", "CreatedAt")
SELECT gen_random_uuid(),
       'admin@casatic.sv',
       '$2b$11$HjV62jENbKZ8pj28RNW6YuhVunyDdYgAgiaLw/WgG5FkNxishgSLC',
       'Admin',
       true,
       true,
       NULL,
       now()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE "Email" = 'admin@casatic.sv');
