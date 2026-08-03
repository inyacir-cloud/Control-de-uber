-- Supabase schema for Mis Ingresos Uber
-- Pega este archivo en el SQL Editor de Supabase o ejecútalo por partes.

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

create index if not exists jornadas_fecha_idx on jornadas (fecha desc);
create index if not exists presupuestos_semana_idx on presupuestos (semana desc);
create index if not exists movimientos_semana_idx on movimientos (semana);
