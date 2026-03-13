#!/usr/bin/env node

/**
 * CRONEC SRL - Create Admin User Script
 *
 * This script creates an initial admin user in Supabase
 * Run with: node scripts/create-admin-user.js
 */

const { createClient } = require("@supabase/supabase-js")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function createAdminUser() {
  console.log("\n╔════════════════════════════════════════╗")
  console.log("║  CRONEC SRL - Create Admin User        ║")
  console.log("╚════════════════════════════════════════╝\n")

  // Get Supabase credentials
  const supabaseUrl = await question("Supabase URL: ")
  const supabaseServiceKey = await question("Supabase Service Role Key: ")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Error: Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Get user details
  const email = await question("\nAdmin email: ")
  const password = await question("Admin password: ")
  const fullName = await question("Full name: ")

  if (!email || !password || !fullName) {
    console.error("❌ Error: All fields are required")
    process.exit(1)
  }

  try {
    // Create user
    console.log("\n⏳ Creating admin user...")
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) throw authError

    console.log("✓ User created successfully")

    // Update role to admin
    console.log("⏳ Setting admin role...")
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin", full_name: fullName })
      .eq("id", authData.user.id)

    if (profileError) throw profileError

    console.log("✓ Admin role assigned")

    console.log("\n╔════════════════════════════════════════╗")
    console.log("║  Admin user created successfully!      ║")
    console.log("╚════════════════════════════════════════╝\n")

    console.log(`Email: ${email}`)
    console.log(`User ID: ${authData.user.id}`)
    console.log("\nYou can now login at: /admin/login\n")
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

createAdminUser()
