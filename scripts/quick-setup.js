import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variables de entorno no configuradas")
  console.error("Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  console.log("👤 Creando usuario administrador...\n")

  const adminEmail = "administracion@emprenor.com.ar"
  const adminPassword = "Ras2025RM@"

  try {
    // Primero, verificar si el usuario ya existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers.users.find((u) => u.email === adminEmail)

    let userId = existingUser?.id

    if (existingUser) {
      console.log("ℹ️  Usuario ya existe, actualizando...")
    } else {
      // Crear nuevo usuario
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: "Administrador CRONEC",
        },
      })

      if (createError) {
        console.error("❌ Error creando usuario:", createError.message)
        return false
      }

      userId = newUser.user.id
      console.log("✅ Usuario creado en Auth")
    }

    // Actualizar perfil a superadmin
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: userId,
      email: adminEmail,
      full_name: "Administrador CRONEC",
      role: "superadmin",
    })

    if (updateError) {
      console.error("❌ Error actualizando perfil:", updateError.message)
      return false
    }

    console.log("✅ Usuario configurado como superadmin")
    return true
  } catch (error) {
    console.error("❌ Error:", error.message)
    return false
  }
}

async function main() {
  console.log("\n🚀 Setup Rápido - CRONEC SRL Dashboard")
  console.log("=".repeat(50))
  console.log("")

  const success = await createAdminUser()

  if (success) {
    console.log("\n" + "=".repeat(50))
    console.log("✨ ¡Configuración completada!")
    console.log("\n📋 Credenciales de acceso:")
    console.log("   URL: /admin/login")
    console.log("   Email: administracion@emprenor.com.ar")
    console.log("   Contraseña: Ras2025RM@")
    console.log("=".repeat(50) + "\n")
  } else {
    console.log("\n❌ Hubo un error en la configuración")
    process.exit(1)
  }
}

main().catch(console.error)
