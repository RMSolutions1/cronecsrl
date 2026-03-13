import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variables de entorno no configuradas")
  console.error("Necesitas NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function executeSQLFile(filename) {
  console.log(`\n📄 Ejecutando ${filename}...`)
  try {
    const sqlPath = join(__dirname, filename)
    const sql = readFileSync(sqlPath, "utf8")

    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error(`❌ Error en ${filename}:`, error.message)
      return false
    }

    console.log(`✅ ${filename} ejecutado correctamente`)
    return true
  } catch (error) {
    console.error(`❌ Error leyendo ${filename}:`, error.message)
    return false
  }
}

async function createAdminUser() {
  console.log("\n👤 Creando usuario administrador...")

  const adminEmail = "administracion@emprenor.com.ar"
  const adminPassword = "Ras2025RM@"

  try {
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Administrador CRONEC",
        role: "superadmin",
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log("ℹ️  Usuario ya existe, actualizando rol...")

        // Obtener el usuario existente
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users.users.find((u) => u.email === adminEmail)

        if (existingUser) {
          // Actualizar perfil a superadmin
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              role: "superadmin",
              full_name: "Administrador CRONEC",
            })
            .eq("id", existingUser.id)

          if (updateError) {
            console.error("❌ Error actualizando rol:", updateError.message)
            return false
          }

          console.log("✅ Usuario actualizado a superadmin")
          return true
        }
      } else {
        console.error("❌ Error creando usuario:", authError.message)
        return false
      }
    }

    if (authData.user) {
      // Actualizar perfil a superadmin
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "superadmin" })
        .eq("id", authData.user.id)

      if (profileError) {
        console.error("❌ Error actualizando perfil:", profileError.message)
        return false
      }

      console.log("✅ Usuario administrador creado correctamente")
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Rol: superadmin`)
      return true
    }
  } catch (error) {
    console.error("❌ Error:", error.message)
    return false
  }
}

async function checkTables() {
  console.log("\n🔍 Verificando tablas existentes...")

  const { data, error } = await supabase.from("profiles").select("count").limit(1)

  if (error && error.code === "42P01") {
    console.log("ℹ️  Tablas no existen, creando esquema...")
    return false
  }

  console.log("✅ Tablas ya existen")
  return true
}

async function main() {
  console.log("🚀 Iniciando configuración automática de la base de datos CRONEC SRL\n")
  console.log("=".repeat(60))

  // Verificar si las tablas ya existen
  const tablesExist = await checkTables()

  if (!tablesExist) {
    // Ejecutar scripts SQL en orden
    const scripts = ["001_create_admin_schema.sql", "002_seed_initial_data.sql", "003_create_storage_buckets.sql"]

    for (const script of scripts) {
      const success = await executeSQLFile(script)
      if (!success) {
        console.error("\n❌ Error en la configuración. Proceso detenido.")
        process.exit(1)
      }
      // Esperar un poco entre scripts
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // Crear usuario administrador
  const adminCreated = await createAdminUser()

  if (!adminCreated) {
    console.error("\n❌ Error creando usuario administrador")
    process.exit(1)
  }

  console.log("\n" + "=".repeat(60))
  console.log("✨ ¡Configuración completada exitosamente!")
  console.log("\n📋 Siguiente paso:")
  console.log("   1. Ve a /admin/login")
  console.log("   2. Inicia sesión con:")
  console.log("      Email: administracion@emprenor.com.ar")
  console.log("      Contraseña: Ras2025RM@")
  console.log("   3. ¡Comienza a gestionar tu sitio!")
  console.log("=".repeat(60) + "\n")
}

main().catch(console.error)
