import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const rawDatabaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.SUPABASE_DB_URL ??
  process.env.SUPABASE_DATABASE_URL;

const normalizedDatabaseUrl = rawDatabaseUrl
  ? rawDatabaseUrl.trim().replace(/^['"]|['"]$/g, "")
  : undefined;

const isSupabaseUrl = Boolean(normalizedDatabaseUrl?.includes("supabase.co"));

const databaseUrl = normalizedDatabaseUrl
  ? normalizedDatabaseUrl.replace(/([?&])sslmode=require(&|$)/i, "$1sslmode=no-verify$2")
  : undefined;

export const hasDatabase = Boolean(databaseUrl);

const useSsl = isSupabaseUrl;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = hasDatabase
  ? globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;

if (hasDatabase && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool ?? undefined;
}

const createNoopSelect = () => ({
  from: () => ({
    orderBy: async () => [],
  }),
});

const createNoopInsert = () => ({
  values: () => ({
    onConflictDoUpdate: () => ({
      returning: async () => [],
    }),
    returning: async () => [],
  }),
});

const createNoopUpdate = () => ({
  set: () => ({
    where: () => ({
      returning: async () => [],
    }),
  }),
});

const createNoopDelete = () => ({
  where: async () => undefined,
});

export const db: any = hasDatabase && pool ? drizzle(pool) : {
  select: createNoopSelect,
  insert: createNoopInsert,
  update: createNoopUpdate,
  delete: createNoopDelete,
  execute: async () => [],
};
