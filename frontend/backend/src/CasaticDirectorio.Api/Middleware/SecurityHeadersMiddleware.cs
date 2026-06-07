namespace CasaticDirectorio.Api.Middleware;

/// <summary>
/// Middleware que añade headers de seguridad estándar a todas las respuestas.
/// Mitiga XSS, clickjacking, sniffing y filtración de referrer.
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Previene MIME sniffing: el navegador respeta el Content-Type declarado.
        headers["X-Content-Type-Options"] = "nosniff";

        // Bloquea iframing salvo desde el mismo origen (clickjacking).
        headers["X-Frame-Options"] = "SAMEORIGIN";

        // Limita qué información de Referer se filtra.
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Restringe APIs sensibles del navegador (geolocalización, cámara, mic).
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=()";

        // CSP estricto para la API (no sirve HTML salvo Swagger en dev).
        // Si querés servir Swagger UI en dev, hace falta 'unsafe-inline' para sus estilos.
        headers["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: blob:; " +
            "font-src 'self' data:; " +
            "connect-src 'self'; " +
            "frame-ancestors 'self'; " +
            "base-uri 'self'; " +
            "form-action 'self'";

        // Quitamos el header Server por defecto (información que ayuda a fingerprinting).
        headers.Remove("Server");

        await _next(context);
    }
}
