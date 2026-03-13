# Build estático para subir por FTP (sin admin ni Server Actions)
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$app = Join-Path $projectRoot "app"
$adminPath = Join-Path $app "admin"
$adminBak = Join-Path $app "_admin_bak"
$pageOrig = Join-Path $app "page.tsx"
$pageFtp = Join-Path $app "page.ftp.tsx"
$pageBak = Join-Path $app "page.tsx.bak"
$proyectosPage = Join-Path $app "proyectos\page.tsx"
$proyectosFtp = Join-Path $app "proyectos\page.ftp.tsx"
$proyectosBak = Join-Path $app "proyectos\page.tsx.bak"

$adminTemp = Join-Path $env:TEMP "cronec_admin_bak"
try {
  if (Test-Path $adminPath) {
    Write-Host "Excluyendo /admin del build estático..." -ForegroundColor Cyan
    if (Test-Path $adminTemp) { Remove-Item $adminTemp -Recurse -Force }
    Move-Item $adminPath $adminTemp -Force
  }
  Copy-Item $pageOrig $pageBak -Force
  Copy-Item $pageFtp $pageOrig -Force
  Copy-Item $proyectosPage $proyectosBak -Force
  Copy-Item $proyectosFtp $proyectosPage -Force
  Write-Host "Usando páginas estáticas (sin BD)..." -ForegroundColor Cyan
  Set-Location $projectRoot
  $env:BUILD_FTP = "1"
  $env:NEXT_PUBLIC_HIDE_ADMIN_LINK = "1"
  # NEXT_PUBLIC_FORMSPREE_ID: configuralo en .env.local para que el formulario use Formspree en el sitio estático
  npm run build
  # Copiar .htaccess para Apache/OpenLiteSpeed (CyberPanel)
  $htaccessSrc = Join-Path $projectRoot "static-deploy\.htaccess"
  $htaccessDst = Join-Path $projectRoot "out\.htaccess"
  if (Test-Path $htaccessSrc) {
    Copy-Item $htaccessSrc $htaccessDst -Force
    Write-Host ".htaccess copiado a out\" -ForegroundColor Cyan
  }
  Write-Host "Build estático listo. Subí el contenido de out\ por FTP/File Manager." -ForegroundColor Green
} finally {
  if (Test-Path $pageBak) {
    Copy-Item $pageBak $pageOrig -Force
    Remove-Item $pageBak -Force
  }
  if (Test-Path $proyectosBak) {
    Copy-Item $proyectosBak $proyectosPage -Force
    Remove-Item $proyectosBak -Force
  }
  if (Test-Path $adminTemp) {
    if (Test-Path $adminPath) { Remove-Item $adminPath -Recurse -Force }
    Move-Item $adminTemp $adminPath -Force
    Write-Host "Carpeta admin restaurada." -ForegroundColor Cyan
  }
}
