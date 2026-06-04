using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Subida de archivos de imagen.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Socio")]
public class UploadController : ControllerBase
{
    private static readonly Dictionary<string, string[]> AllowedImageTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = ["image/jpeg"],
        [".jpeg"] = ["image/jpeg"],
        [".png"] = ["image/png"],
        [".webp"] = ["image/webp"]
    };

    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    /// <summary>
    /// Sube una imagen y retorna su URL publica.
    /// Sube una imagen y retorna su URL publica.
    /// Max. 10 MB. Acepta PNG, JPG/JPEG y WEBP con validacion de firma.
    /// </summary>
    [HttpPost("image")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No se recibio ningun archivo" });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "El archivo no puede superar 10 MB" });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var contentType = file.ContentType?.ToLowerInvariant() ?? string.Empty;
        if (!AllowedImageTypes.TryGetValue(extension, out var acceptedContentTypes) ||
            !acceptedContentTypes.Contains(contentType) ||
            !await IsAllowedImageSignatureAsync(file, extension))
        {
            return BadRequest(new { message = "Solo se permiten imagenes PNG, JPG/JPEG o WEBP validas" });
        }

        var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var normalizedExtension = extension == ".jpeg" ? ".jpg" : extension;
        var fileName = $"{Guid.NewGuid()}{normalizedExtension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return Ok(new { url = $"/uploads/{fileName}" });
    }

    /// <summary>
    /// Compatibilidad con pantallas existentes que suben logos.
    /// </summary>
    [HttpPost("logo")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public Task<IActionResult> UploadLogo(IFormFile file) => UploadImage(file);

    private static async Task<bool> IsAllowedImageSignatureAsync(IFormFile file, string extension)
    {
        var header = new byte[12];
        await using var stream = file.OpenReadStream();
        var read = await stream.ReadAsync(header);

        return extension switch
        {
            ".jpg" or ".jpeg" => read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
            ".png" => read >= 8 &&
                header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 &&
                header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A,
            ".webp" => read >= 12 &&
                header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50,
            _ => false
        };
    }
}
