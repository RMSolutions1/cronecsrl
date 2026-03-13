# Verificar en el servidor que la app CRONEC esté compilada y corriendo
# Uso: .\verificar-servidor.ps1 -ServerIP "vps-5753489-x.dattaweb.com" -SshPort 5010

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerIP = "vps-5753489-x.dattaweb.com",
    [Parameter(Mandatory=$false)]
    [int]$SshPort = 5010
)

# Opciones SSH como argumentos separados (evita "keyword extra arguments" en Windows)
$sshArgs = @("-o", "StrictHostKeyChecking=accept-new", "-o", "ConnectTimeout=15")
if ($SshPort -gt 0) {
    $sshArgs += "-p", $SshPort
}
$remoteCmd = "echo '--- 1. Carpeta de la app ---'; ls -la ~/apps/cronec 2>/dev/null || echo 'NO EXISTE'; echo ''; echo '--- 2. Build Next.js (.next) ---'; test -d ~/apps/cronec/.next && (echo OK .next existe; ls ~/apps/cronec/.next | head -5) || echo FALTA ejecutar npm run build; echo ''; echo '--- 3. Node/npm ---'; node -v 2>/dev/null; npm -v 2>/dev/null; echo ''; echo '--- 4. PM2 ---'; pm2 list 2>/dev/null || echo PM2 no instalado; echo ''; echo '--- 5. Puerto 3000 ---'; (ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) | grep 3000 || echo Puerto 3000 no escuchando"

$sshArgs += "root@$ServerIP", $remoteCmd

Write-Host "`n=== Verificando servidor: root@${ServerIP} (puerto $SshPort) ===`n" -ForegroundColor Cyan

try {
    & ssh @sshArgs
    Write-Host "`n=== Fin de la verificación ===" -ForegroundColor Cyan
    Write-Host "Si .next existe y PM2 muestra 'cronec' en estado online, la app está compilada y corriendo." -ForegroundColor Green
    Write-Host "Probar en el navegador: http://66.97.38.130:3000" -ForegroundColor Yellow
} catch {
    Write-Host "Error al conectar: $_" -ForegroundColor Red
    exit 1
}
