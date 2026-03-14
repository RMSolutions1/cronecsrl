# Neon (PostgreSQL) – Estado del esquema

El archivo **`schema.sql`** ya define la tabla `users` necesaria para admins:

- `id`, `email`, `password_hash`, `full_name`, `role`, `avatar_url`, `created_at`, `updated_at`

**Si ya ejecutaste `schema.sql` en el SQL Editor de Neon, no hace falta ninguna migración adicional.**

Para comprobar que la tabla existe:

```sql
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position;
```

La capa de datos del proyecto escribe admins en esta tabla cuando se usa Postgres (`writeAdmins` en `lib/data-pg.ts`).
