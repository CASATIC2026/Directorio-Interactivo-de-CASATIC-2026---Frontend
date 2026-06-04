namespace CasaticDirectorio.Api.DTOs.Auth;

public record AccesoDto(
    DateTime Fecha,
    string Tipo,
    bool Exitoso,
    string? Ip,
    string? UserAgent
);

public record AccesoAdminDto(
    DateTime Fecha,
    string Email,
    string Tipo,
    bool Exitoso,
    string? Ip,
    string? UserAgent
);

public record AccesosPagedResult(
    int Total,
    int Page,
    int PageSize,
    List<AccesoAdminDto> Items
);
