using System.Text;
using System.Threading.RateLimiting;
using CasaticDirectorio.Api.Middleware;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using CasaticDirectorio.Infrastructure.Data.Seed;
using CasaticDirectorio.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ───────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

// ── Validación FAIL-FAST de configuración crítica ─────────
// Sin esto, una app con JWT_KEY vacío arrancaba pero todos los tokens
// eran inválidos / o crasheaba con NRE en el primer login.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString) ||
    connectionString.Contains("REEMPLAZ", StringComparison.OrdinalIgnoreCase))
{
    throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection no está configurada. Definí la variable de entorno CONNECTION_STRING (ver .env.example).");
}

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) ||
    jwtKey.Contains("REEMPLAZ", StringComparison.OrdinalIgnoreCase) ||
    jwtKey.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key no está configurada o es demasiado corta (mínimo 32 caracteres). " +
        "Generá una clave con 'openssl rand -base64 64' y definí JWT_KEY en .env.");
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer no configurado.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience no configurado.");

// ── PostgreSQL + EF Core ──────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ── Repositorios ──────────────────────────────────────────
builder.Services.AddScoped<ISocioRepository, SocioRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ILogActividadRepository, LogActividadRepository>();
builder.Services.AddScoped<IFormularioContactoRepository, FormularioContactoRepository>();

// ── Servicios ─────────────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<EventoService>();

// ── Email SMTP ─────────────────────────────────────────────
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.AddSingleton<IEmailService, SmtpEmailService>();

// ── JWT Authentication ────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // En Development permitimos HTTP, en producción requerimos HTTPS.
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.SaveToken = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromMinutes(1), // antes: 5 min por defecto (riesgo de tokens "vivos" después de expirar)
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();

// ── UTF-8 ────────────────────────────────────────────────
Console.OutputEncoding = Encoding.UTF8;

// ── Controllers + JSON ───────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// ── Swagger (sólo en Development) ────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Directorio Interactivo CASATIC 2026",
        Version = "v1",
        Description = "API para el directorio de socios de CASATIC"
    });

    // Bearer JWT (esquema HTTP Bearer correcto, no ApiKey)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Ingrese su token JWT (sin el prefijo 'Bearer ')."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ── CORS desde configuración ─────────────────────────────
// Antes la lista estaba hardcodeada en el código y mezclaba dev+prod.
// Ahora viene de Cors:AllowedOrigins (env var CORS_ALLOWED_ORIGINS, separados por coma).
var allowedOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (allowedOrigins.Length == 0)
        {
            // Sin orígenes configurados → bloqueamos todo en lugar de permitir cualquiera.
            policy.WithOrigins(Array.Empty<string>());
        }
        else
        {
            policy.WithOrigins(allowedOrigins)
                  .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                  .WithHeaders("Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With")
                  .AllowCredentials();
        }
    });
});

// ── Rate Limiting ───────────────────────────────────────
builder.Services.AddRateLimiter(rl =>
{
    // Endpoints de auth (login, recuperación) — más estricto y por IP
    rl.AddPolicy("auth", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 10,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // Formulario de contacto público — 5/min por IP
    rl.AddPolicy("contacto", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 5,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    rl.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// ── Tamaño máximo de request global (defensa básica DoS) ─
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MB (importación Excel)
});

var app = builder.Build();

// ── Migraciones + Seed ──────────────────────────────────
// Permite deshabilitar el seeder en desarrollo con SKIP_SEED=true
var skipSeed = bool.TryParse(builder.Configuration["SKIP_SEED"], out var val) && val;

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var seedLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
            .CreateLogger("DataSeeder");
        // No usamos MigrateAsync porque el proyecto no tiene migraciones EF generadas.
        // EnsureCreatedAsync crea el schema desde el modelo si la BD está vacía,
        // y es no-op si ya existe (ej: cuando se restauró backup.sql primero).
        await db.Database.EnsureCreatedAsync();
        
        if (!skipSeed)
        {
            await DataSeeder.SeedAsync(db, app.Configuration, seedLogger);
        }
        else
        {
            Log.Information("⏭️  Seeder deshabilitado con SKIP_SEED=true. Usando BD existente sin modificar datos.");
        }
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Error en migración/seed inicial. La aplicación no puede arrancar.");
        throw;
    }
}

// ── HTTPS redirection (sólo si no estamos detrás de proxy en dev local) ─
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

// ── Security headers (CSP, X-Frame, X-Content-Type, Referrer) ─
app.UseMiddleware<SecurityHeadersMiddleware>();

// ── Static files para logos ─────────────────────────────
var logosPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "logos");
Directory.CreateDirectory(logosPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(logosPath),
    RequestPath = "/logos",
    OnPrepareResponse = ctx =>
    {
        // Cache agresivo en logos: el nombre incluye Guid, así que son inmutables.
        ctx.Context.Response.Headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }
});

// ── Static files para uploads de eventos y formularios ─────
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }
});

// ── Pipeline ──────────────────────────────────────────
app.UseMiddleware<ApiExceptionMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CASATIC API v1"));
}

app.UseCors("AllowFrontend");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

Log.Information("🚀 Directorio Interactivo CASATIC 2026 iniciado en entorno {Env}", app.Environment.EnvironmentName);
app.Run();
