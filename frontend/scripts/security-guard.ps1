$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Assert-NoMatch {
    param(
        [string] $Path,
        [string] $Pattern,
        [string] $Message
    )

    $fullPath = Join-Path $root $Path
    if (-not (Test-Path -LiteralPath $fullPath)) {
        return
    }

    $matches = Select-String -Path $fullPath -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
    if ($matches) {
        $failures.Add($Message)
    }
}

function Assert-Match {
    param(
        [string] $Path,
        [string] $Pattern,
        [string] $Message
    )

    $fullPath = Join-Path $root $Path
    if (-not (Test-Path -LiteralPath $fullPath)) {
        $failures.Add($Message)
        return
    }

    $matches = Select-String -Path $fullPath -Pattern $Pattern -SimpleMatch -ErrorAction SilentlyContinue
    if (-not $matches) {
        $failures.Add($Message)
    }
}

Assert-NoMatch "backend/src/CasaticDirectorio.Api/Controllers/UsuariosController.cs" "Socio123!" "Socio users must not receive a predictable password."
Assert-NoMatch "backend/src/CasaticDirectorio.Api/Controllers/FacturacionController.cs" "FirstOrDefaultAsync(f => f.SocioId ==" "Billing must not update/download an arbitrary first invoice by socio."
Assert-NoMatch "backend/src/CasaticDirectorio.Api/Program.cs" "UnsafeRelaxedJsonEscaping" "JSON responses must use the default safe encoder."
Assert-NoMatch "backend/src/CasaticDirectorio.Api/appsettings.Development.json" "Password=" "Development appsettings must not contain database passwords."
Assert-NoMatch "backend/src/CasaticDirectorio.Api/appsettings.Development.json" '"Key":' "Development appsettings must not contain JWT signing keys."
Assert-NoMatch "backend/src/CasaticDirectorio.Api/appsettings.Development.json" '"AdminPassword":' "Development appsettings must not contain seed admin passwords."
Assert-Match "backend/src/CasaticDirectorio.Api/Controllers/UploadController.cs" "AllowedImageTypes" "Uploads must use an explicit allowlist."
Assert-Match "backend/src/CasaticDirectorio.Api/Controllers/UploadController.cs" "IsAllowedImageSignatureAsync" "Uploads must validate image magic bytes."
Assert-Match ".gitignore" "frontend/node_modules/" "Repository must ignore frontend/node_modules."
Assert-Match ".gitignore" ".env" "Repository must ignore local environment files."

if ($failures.Count -gt 0) {
    Write-Host "Security guard failed:"
    foreach ($failure in $failures) {
        Write-Host " - $failure"
    }
    exit 1
}

Write-Host "Security guard passed."
