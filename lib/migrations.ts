/**
 * Alias del brief "runMigrations()": migraciones aditivas CMS (site_config, team_members).
 * No recrea projects/services/blog existentes en Neon.
 */
export { runCmsAdditiveMigrations as runMigrations } from "@/lib/cms-migrations"
