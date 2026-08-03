# Supabase

Este proyecto ya usa PostgreSQL a través de `DATABASE_URL`, así que para ponerlo en línea con Supabase solo hace falta apuntar la app a la base remota y crear el esquema inicial.

## 1. Crear el proyecto

1. Entra a Supabase y crea un proyecto nuevo.
2. Espera a que termine el aprovisionamiento.
3. Copia la contraseña de la base de datos.

## 2. Obtener la cadena de conexión

En `Project Settings -> Database -> Connection string`, copia la URL PostgreSQL.

Para este proyecto, usa una URL parecida a esta en `.env.local`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Si Supabase te da una URL de pooler y otra directa, usa la directa para migraciones y la que prefieras para ejecución.

## 3. Crear las tablas

Tienes dos opciones:

### Opción A: Drizzle

1. Crea `.env.local` con la URL de Supabase.
2. Ejecuta:

```bash
npx drizzle-kit push
```

### Opción B: SQL manual en Supabase

Pega este esquema en el SQL Editor de Supabase:

```sql
create table if not exists jornadas (
  id serial primary key,
  fecha date not null unique,
  km_inicial numeric(12,1) not null default 0,
  km_final numeric(12,1) not null default 0,
  rendimiento_km_l numeric(8,2) not null default 0,
  precio_gasolina numeric(8,2) not null default 0,
  total_uber numeric(12,2) not null default 0,
  saldo_acumulado numeric(12,2) not null default 0,
  retiro numeric(12,2) not null default 0,
  efectivo_manual numeric(12,2),
  otros_gastos numeric(12,2) not null default 0,
  notas text,
  created_at timestamptz not null default now()
);

create table if not exists presupuestos (
  id serial primary key,
  semana text not null unique,
  monto numeric(12,2) not null default 0,
  pct_gastos numeric(5,2) not null default 50,
  pct_deudas numeric(5,2) not null default 30,
  pct_disponible numeric(5,2) not null default 20,
  notas text,
  created_at timestamptz not null default now()
);

create table if not exists movimientos (
  id serial primary key,
  semana text not null,
  categoria text not null,
  concepto text not null,
  monto numeric(12,2) not null default 0,
  fecha date not null,
  created_at timestamptz not null default now()
);

create index if not exists movimientos_semana_idx on movimientos (semana);
create index if not exists jornadas_fecha_idx on jornadas (fecha desc);
create index if not exists presupuestos_semana_idx on presupuestos (semana desc);
```

## 4. Desplegar la app

En Vercel, Netlify o tu servidor, define la variable de entorno:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Si Vercel no puede resolver el host directo de Postgres, usa la URL del pooler/connection pooling que te da Supabase en lugar de `db.[PROJECT-REF].supabase.co`.

Luego despliega.

## 5. Verificar

1. Abre `/api/health`.
2. Debe responder `{ ok: true }` cuando la base esté conectada.
3. Abre la app y registra una jornada para probar escritura.

## Nota importante

Las tablas usan números `numeric`, así que Supabase/Postgres debe conservar la precisión; no cambies a `float`.