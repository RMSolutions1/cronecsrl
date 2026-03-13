# Despliegue CRONEC a servidor (SSH)
# Uso: .\deploy-donweb.ps1 -ServerIP "200.58.126.34" -SshPort 5525
# Sin puerto: .\deploy-donweb.ps1 -ServerIP "66.97.38.130"  (usa 22)

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerIP = $env:SERVER_IP,
    [Parameter(Mandatory=$false)]
    [int]$SshPort = 0
)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

if (-not $ServerIP) {
    Write-Host "ERROR: Necesitas la IP del servidor." -ForegroundColor Red
    Write-Host "Ejemplo: .\deploy-donweb.ps1 -ServerIP `"200.58.126.34`" -SshPort 5525" -ForegroundColor Yellow
    exit 1
}

# Opciones SSH/SCP como argumentos separados (evita "keyword extra arguments" en Windows)
$sshArgs = @("-o", "StrictHostKeyChecking=accept-new")
if ($SshPort -gt 0) {
    $sshArgs += "-p", $SshPort
}

Write-Host "Servidor: root@${ServerIP}" $(if ($SshPort -gt 0) { "(puerto $SshPort)" }) -ForegroundColor Cyan
Write-Host "Creando carpeta en el servidor..." -ForegroundColor Cyan
& ssh @sshArgs "root@$ServerIP" "mkdir -p ~/apps/cronec"

Write-Host "Subiendo archivos (excluyendo node_modules y .next)..." -ForegroundColor Cyan
$exclude = @("node_modules", ".next", ".git", "deploy-donweb.ps1")
$items = Get-ChildItem -Path $projectRoot -Force | Where-Object { $exclude -notcontains $_.Name }
$tempDir = Join-Path $env:TEMP "cronec-deploy"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null
foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempDir -Recurse -Force
}
$scpArgs = @("-r", "$tempDir\*", "root@${ServerIP}:~/apps/cronec/")
if ($SshPort -gt 0) {
    $scpArgs = @("-P", $SshPort) + $scpArgs
}
& scp @scpArgs
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "En el servidor: install, build, PM2..." -ForegroundColor Cyan
$remoteCmd = "cd ~/apps/cronec && npm install --legacy-peer-deps && npm run build && (npm install -g pm2 2>/dev/null; true) && pm2 delete cronec 2>/dev/null; pm2 start npm --name cronec -- start; pm2 save"
& ssh @sshArgs "root@$ServerIP" $remoteCmd

Write-Host "Listo. Proba: http://${ServerIP}:3000" -ForegroundColor Green
