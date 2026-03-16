#!/usr/bin/env node

/**
 * Script de verificación post-build para CRONEC SRL
 * Ejecuta verificaciones críticas antes de deployment
 * 
 * Uso: node scripts/verify-build.js
 */

import { existsSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(process.cwd())
const NEXT_DIR = join(ROOT, '.next')
const PUBLIC_DIR = join(ROOT, 'public')

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[OK]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}\n`),
}

let errors = 0
let warnings = 0

// ============================================================================
// VERIFICACIONES
// ============================================================================

function checkBuildOutput() {
  log.title('Verificando output de build')
  
  if (!existsSync(NEXT_DIR)) {
    log.error('.next/ no existe - ejecuta npm run build primero')
    errors++
    return
  }
  
  const staticDir = join(NEXT_DIR, 'static')
  if (existsSync(staticDir)) {
    log.success('.next/static/ existe')
  } else {
    log.warn('.next/static/ no encontrado (puede ser normal en algunos builds)')
    warnings++
  }
  
  // Verificar que el build no está vacío
  const nextFiles = readdirSync(NEXT_DIR)
  if (nextFiles.length < 3) {
    log.error('Build incompleto - muy pocos archivos en .next/')
    errors++
  } else {
    log.success(`Build contiene ${nextFiles.length} elementos principales`)
  }
}

function checkPublicAssets() {
  log.title('Verificando assets públicos')
  
  if (!existsSync(PUBLIC_DIR)) {
    log.warn('public/ no existe')
    warnings++
    return
  }
  
  const publicFiles = readdirSync(PUBLIC_DIR, { recursive: true })
  const images = publicFiles.filter(f => /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(f))
  
  log.info(`${publicFiles.length} archivos en public/`)
  log.info(`${images.length} imágenes encontradas`)
  
  // Verificar imágenes críticas
  const criticalImages = ['favicon.ico', 'logo.png', 'og-image.jpg']
  for (const img of criticalImages) {
    const found = publicFiles.some(f => f.toLowerCase().includes(img.toLowerCase().replace('.', '')))
    if (found) {
      log.success(`Imagen crítica encontrada: ${img}`)
    } else {
      log.warn(`Imagen crítica faltante: ${img}`)
      warnings++
    }
  }
}

function checkEnvFiles() {
  log.title('Verificando archivos de entorno')
  
  const envExample = join(ROOT, '.env.local.example')
  const envLocal = join(ROOT, '.env.local')
  const envProduction = join(ROOT, '.env.production')
  
  if (existsSync(envExample)) {
    log.success('.env.local.example existe')
  } else {
    log.error('.env.local.example no encontrado')
    errors++
  }
  
  // En CI/CD, .env.local no debería existir
  if (existsSync(envLocal)) {
    log.warn('.env.local existe - asegúrate de no subirlo al repo')
    warnings++
  }
  
  // .env.production NO debe existir en el repo
  if (existsSync(envProduction)) {
    log.error('.env.production encontrado - NO debe estar en el repositorio')
    errors++
  }
}

function checkCriticalFiles() {
  log.title('Verificando archivos críticos')
  
  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'app/layout.tsx',
    'app/page.tsx',
    'app/globals.css',
  ]
  
  for (const file of criticalFiles) {
    const filePath = join(ROOT, file)
    if (existsSync(filePath)) {
      log.success(`${file} existe`)
    } else {
      log.error(`${file} no encontrado`)
      errors++
    }
  }
}

function checkBuildSize() {
  log.title('Verificando tamaño del build')
  
  if (!existsSync(NEXT_DIR)) {
    log.warn('No se puede verificar tamaño - .next/ no existe')
    return
  }
  
  function getDirSize(dir) {
    let size = 0
    const files = readdirSync(dir, { withFileTypes: true })
    for (const file of files) {
      const filePath = join(dir, file.name)
      if (file.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        size += statSync(filePath).size
      }
    }
    return size
  }
  
  const totalSize = getDirSize(NEXT_DIR)
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
  
  if (totalSize > 500 * 1024 * 1024) { // 500MB
    log.error(`Build muy grande: ${sizeMB}MB`)
    errors++
  } else if (totalSize > 200 * 1024 * 1024) { // 200MB
    log.warn(`Build grande: ${sizeMB}MB - considera optimizar`)
    warnings++
  } else {
    log.success(`Tamaño del build: ${sizeMB}MB`)
  }
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================

function main() {
  console.log('\n')
  log.title('CRONEC SRL - Verificación Post-Build')
  console.log(`Directorio: ${ROOT}`)
  console.log(`Fecha: ${new Date().toISOString()}\n`)
  
  checkCriticalFiles()
  checkEnvFiles()
  checkBuildOutput()
  checkPublicAssets()
  checkBuildSize()
  
  // Resumen
  log.title('Resumen')
  
  if (errors > 0) {
    log.error(`${errors} error(es) encontrado(s)`)
  }
  if (warnings > 0) {
    log.warn(`${warnings} advertencia(s)`)
  }
  
  if (errors === 0 && warnings === 0) {
    log.success('Todas las verificaciones pasaron correctamente')
    console.log('\n')
    process.exit(0)
  } else if (errors === 0) {
    log.info('Build aceptable con advertencias')
    console.log('\n')
    process.exit(0)
  } else {
    log.error('Build tiene errores críticos')
    console.log('\n')
    process.exit(1)
  }
}

main()
