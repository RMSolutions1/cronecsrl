# Configurar cronecsrl.com.ar en el servidor (Nginx + sitio)
# Ejecutar desde la carpeta del proyecto: .\configurar-dominio.ps1

$ServerIP = "66.97.38.130"
$ProjectRoot = $PSScriptRoot
$ErrorActionPreference = "Stop"

Write-Host "1. Subiendo config Nginx al servidor..." -ForegroundColor Cyan
& scp -o StrictHostKeyChecking=no "$ProjectRoot\cronecsrl.nginx" "root@${ServerIP}:~/cronecsrl.nginx"
if ($LASTEXITCODE -ne 0) { Write-Host "Error en SCP" -ForegroundColor Red; exit 1 }

Write-Host "2. Instalando Nginx (puede tardar)..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no "root@$ServerIP" "apt-get update -qq && apt-get install -y nginx"
if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando Nginx" -ForegroundColor Red; exit 1 }

Write-Host "3. Configurando sitio cronecsrl.com.ar..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=no "root@$ServerIP" "mv -f ~/cronecsrl.nginx /etc/nginx/sites-available/cronecsrl; ln -sf /etc/nginx/sites-available/cronecsrl /etc/nginx/sites-enabled/; nginx -t && systemctl reload nginx"
if ($LASTEXITCODE -ne 0) { Write-Host "Error configurando Nginx" -ForegroundColor Red; exit 1 }

Write-Host "Listo. Proba: http://cronecsrl.com.ar" -ForegroundColor Green
