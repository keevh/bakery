# Bakery

Local development now defaults to Dockerized PostgreSQL.

## Quick start

1. Copy the environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Start PostgreSQL:

   ```bash
   pnpm db:start
   ```

3. Push the schema and seed/bootstrap the app data:

   ```bash
   pnpm db:push
   pnpm db:bootstrap
   ```

4. Start the app:

   ```bash
   pnpm dev
   ```

## Local database defaults

- Host: `127.0.0.1`
- Port: `5432`
- Database: `bakery`
- User: `postgres`
- Password: `postgres`

## Notes

- Drizzle uses `DATABASE_URL`, so switching to an external Postgres later only requires changing that value in `.env.local`.
- Stop the local database with `pnpm db:stop`.
