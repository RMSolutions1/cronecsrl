/**
 * Validación y tipado de variables de entorno
 * Este archivo centraliza la validación de todas las variables de entorno del proyecto.
 * Se importa al inicio de la aplicación para detectar errores de configuración temprano.
 */

// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production'
const isVercel = !!process.env.VERCEL

// ============================================================================
// VARIABLES DE BASE DE DATOS
// ============================================================================

/**
 * PostgreSQL (Neon) - Prioridad principal
 */
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

/**
 * MySQL - Fallback si no hay PostgreSQL
 */
export const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'cronec',
}

/**
 * Determina qué base de datos usar
 */
export function getDatabaseType(): 'postgres' | 'mysql' | 'json' {
  if (DATABASE_URL) return 'postgres'
  if (MYSQL_CONFIG.host && MYSQL_CONFIG.user) return 'mysql'
  return 'json'
}

// ============================================================================
// VARIABLES DE SESIÓN Y AUTENTICACIÓN
// ============================================================================

/**
 * Clave secreta para firmar cookies de sesión
 * CRÍTICO: En producción DEBE ser una clave aleatoria de 32+ caracteres
 */
export const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-cambiar-en-produccion-32chars'

/**
 * Validación de SESSION_SECRET en producción
 */
export function validateSessionSecret(): { valid: boolean; message: string } {
  const defaultSecrets = [
    'dev-secret-cambiar-en-produccion-32chars',
    'clave-secreta-minimo-32-caracteres-para-firmar-cookies',
  ]
  
  if (isProduction) {
    if (!process.env.SESSION_SECRET) {
      return { valid: false, message: 'SESSION_SECRET no está definido en producción' }
    }
    if (defaultSecrets.includes(process.env.SESSION_SECRET)) {
      return { valid: false, message: 'SESSION_SECRET usa un valor por defecto inseguro en producción' }
    }
    if (process.env.SESSION_SECRET.length < 32) {
      return { valid: false, message: 'SESSION_SECRET debe tener al menos 32 caracteres' }
    }
  }
  return { valid: true, message: 'SESSION_SECRET configurado correctamente' }
}

/**
 * Permitir registro de nuevos admins
 */
export const ALLOW_ADMIN_REGISTER = process.env.ALLOW_ADMIN_REGISTER === 'true'

// ============================================================================
// VARIABLES DE SERVICIOS EXTERNOS
// ============================================================================

/**
 * Vercel Blob Storage
 */
export const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''

/**
 * Formspree para formularios estáticos
 */
export const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || ''

/**
 * URL pública del sitio
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 
  (isVercel ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

/**
 * Clave para verificación de BD (diagnóstico)
 */
export const DB_VERIFY_KEY = process.env.DB_VERIFY_KEY || ''

// ============================================================================
// VALIDACIÓN COMPLETA DEL ENTORNO
// ============================================================================

export interface EnvValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  info: string[]
}

/**
 * Valida todas las variables de entorno críticas
 * Llamar al inicio de la aplicación para detectar errores temprano
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const info: string[] = []

  // Validar SESSION_SECRET
  const sessionValidation = validateSessionSecret()
  if (!sessionValidation.valid) {
    if (isProduction) {
      errors.push(sessionValidation.message)
    } else {
      warnings.push(sessionValidation.message)
    }
  }

  // Validar base de datos
  const dbType = getDatabaseType()
  if (dbType === 'json') {
    if (isProduction) {
      warnings.push('Sin base de datos configurada - usando JSON fallback (no recomendado en producción)')
    } else {
      info.push('Usando JSON fallback para datos (desarrollo)')
    }
  } else {
    info.push(`Base de datos: ${dbType.toUpperCase()}`)
  }

  // Validar Blob Storage en Vercel
  if (isVercel && !BLOB_READ_WRITE_TOKEN) {
    warnings.push('BLOB_READ_WRITE_TOKEN no definido - la subida de imágenes no funcionará')
  }

  // Validar registro de admins en producción
  if (isProduction && ALLOW_ADMIN_REGISTER) {
    warnings.push('ALLOW_ADMIN_REGISTER=true en producción - considera deshabilitarlo')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
  }
}

/**
 * Imprime el estado de validación en consola (para debugging)
 */
export function logEnvironmentStatus(): void {
  const result = validateEnvironment()
  
  console.log('\n=== Estado de Variables de Entorno ===')
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Vercel: ${isVercel ? 'Sí' : 'No'}`)
  
  if (result.info.length > 0) {
    console.log('\nInfo:')
    result.info.forEach(msg => console.log(`  - ${msg}`))
  }
  
  if (result.warnings.length > 0) {
    console.log('\nAdvertencias:')
    result.warnings.forEach(msg => console.warn(`  ⚠ ${msg}`))
  }
  
  if (result.errors.length > 0) {
    console.log('\nErrores:')
    result.errors.forEach(msg => console.error(`  ✗ ${msg}`))
  }
  
  console.log(`\nEstado: ${result.valid ? 'OK' : 'ERRORES DETECTADOS'}`)
  console.log('=====================================\n')
}

// Exportar todas las variables para uso en la aplicación
export const env = {
  // Base de datos
  DATABASE_URL,
  MYSQL_CONFIG,
  getDatabaseType,
  
  // Autenticación
  SESSION_SECRET,
  ALLOW_ADMIN_REGISTER,
  
  // Servicios externos
  BLOB_READ_WRITE_TOKEN,
  FORMSPREE_ID,
  SITE_URL,
  DB_VERIFY_KEY,
  
  // Validación
  validateEnvironment,
  validateSessionSecret,
  logEnvironmentStatus,
  
  // Estado
  isProduction,
  isVercel,
}

export default env
