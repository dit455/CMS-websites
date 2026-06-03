# ─────────────────────────────────────────────────────────────────────────────
#  build-all.ps1  —  Build ALL sites for production in one command.
#
#  Supports multiple templates.  Each site is built from its own template folder.
#
#  Example layout:
#    template-one/   ← 10 sites use this template
#    template-two/   ← 10 sites use this template
#    template-three/ ← 10 sites use this template
#
#  Output:
#    dist/
#      site2/        health/   tourism/  ...  (from template-one)
#      edu1/         edu2/     ...            (from template-two)
#
#  Usage:
#    .\build-all.ps1                   # build ALL active sites
#    .\build-all.ps1 -Template template-one   # build only template-one sites
#    .\build-all.ps1 -SiteKey health   # build only the 'health' site
# ─────────────────────────────────────────────────────────────────────────────
param(
    [string]$Template = '',    # filter by template key  (optional)
    [string]$SiteKey  = ''     # build a single site key (optional)
)

$ROOT   = $PSScriptRoot
$PY     = "$ROOT\.venv\Scripts\python.exe"
$DJANGO = "$ROOT\cms\dit_backend"
$DIST   = "$ROOT\dist"

# ── 1. Fetch site list from Django  (key:folder pairs) ───────────────────────
Write-Host "`n Reading sites from Django...`n"

$raw = & $PY "$DJANGO\manage.py" shell -c @"
from sites.models import Site
qs = Site.objects.filter(is_active=True)
for s in qs:
    print(f'{s.key}:{s.folder}:{s.template}')
"@ 2>&1 | Where-Object { $_ -notmatch 'imported' -and $_.ToString().Trim() -ne '' }

if (-not $raw) {
    Write-Host " No active sites found. Add sites in Django admin /admin first." -ForegroundColor Red
    exit 1
}

# Parse into objects
$sites = $raw | ForEach-Object {
    $parts = $_.ToString().Trim() -split ':'
    [PSCustomObject]@{ Key = $parts[0]; Folder = $parts[1]; Template = $parts[2] }
}

# Apply filters if provided
if ($Template) { $sites = $sites | Where-Object { $_.Template -eq $Template } }
if ($SiteKey)  { $sites = $sites | Where-Object { $_.Key      -eq $SiteKey  } }

if (-not $sites) {
    Write-Host " No sites matched the filter. Check the -Template or -SiteKey value." -ForegroundColor Yellow
    exit 0
}

# Show plan
Write-Host " Building $($sites.Count) site(s):`n"
$sites | Group-Object Template | ForEach-Object {
    Write-Host "  [$($_.Name)]  →  folder: $(($_.Group[0].Folder))" -ForegroundColor Cyan
    $_.Group | ForEach-Object { Write-Host "    • $($_.Key)" }
}
Write-Host ""

# ── 2. Build each site ────────────────────────────────────────────────────────
$success = @(); $failed = @()

# Group by folder so we only do npm install once per template folder
$byFolder = $sites | Group-Object Folder

foreach ($group in $byFolder) {
    $folderName  = $group.Name
    $folderPath  = "$ROOT\$folderName"

    if (-not (Test-Path $folderPath)) {
        Write-Host " SKIP [$folderName] — folder not found at $folderPath" -ForegroundColor Yellow
        $group.Group | ForEach-Object { $failed += $_.Key }
        continue
    }

    # Save the original .env so we can restore it after building
    $envPath    = "$folderPath\.env"
    $originalEnv = [System.IO.File]::ReadAllText($envPath)

    foreach ($site in $group.Group) {
        Write-Host "────────────────────────────────────────"
        Write-Host " Building  $($site.Key)  (template: $($site.Template))" -ForegroundColor Cyan

        # Write site-specific .env (UTF-8, no BOM)
        $envContent = "VITE_API_BASE_URL=/api`nVITE_SITE_KEY=$($site.Key)`n"
        [System.IO.File]::WriteAllText($envPath, $envContent, [System.Text.UTF8Encoding]::new($false))

        # Run Vite build
        Push-Location $folderPath
        npm run build 2>&1 | Tee-Object -Variable buildOut | Select-Object -Last 5 | ForEach-Object { Write-Host "  $_" }
        $exitCode = $LASTEXITCODE
        Pop-Location

        if ($exitCode -eq 0) {
            $dest = "$DIST\$($site.Key)"
            if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
            Move-Item "$folderPath\dist" $dest
            Write-Host " Done  →  dist\$($site.Key)\" -ForegroundColor Green
            $success += $site.Key
        } else {
            Write-Host " FAILED: $($site.Key)" -ForegroundColor Red
            $failed += $site.Key
        }
    }

    # Restore original .env
    [System.IO.File]::WriteAllText($envPath, $originalEnv, [System.Text.UTF8Encoding]::new($false))
    Write-Host " Restored $folderName\.env"
}

# ── 3. Summary ────────────────────────────────────────────────────────────────
Write-Host "`n════════════════════════════════════════"
Write-Host " BUILD COMPLETE"
if ($success) { Write-Host " Built   : $($success -join ', ')" -ForegroundColor Green }
if ($failed)  { Write-Host " Failed  : $($failed  -join ', ')" -ForegroundColor Red   }
Write-Host "`n Upload each folder inside  dist\  to your web server."
Write-Host " Nginx root for 'health' site  →  /var/www/dit-portal/dist/health"
Write-Host "════════════════════════════════════════`n"
