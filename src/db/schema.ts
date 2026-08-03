import {
  pgTable,
  serial,
  date,
  numeric,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Una fila = una jornada (un día de trabajo en Uber).
 * Todos los cálculos (efectivo, litros, rendimiento, ganancia) se derivan
 * de estos campos en src/lib/calc.ts
 */
export const jornadas = pgTable("jornadas", {
  id: serial("id").primaryKey(),
  fecha: date("fecha", { mode: "string" }).notNull().unique(),

  // Kilometraje del odómetro
  kmInicial: numeric("km_inicial", { precision: 12, scale: 1 })
    .notNull()
    .default("0"),
  kmFinal: numeric("km_final", { precision: 12, scale: 1 })
    .notNull()
    .default("0"),

  // Gasolina
  rendimientoKmL: numeric("rendimiento_km_l", { precision: 8, scale: 2 })
    .notNull()
    .default("0"),
  precioGasolina: numeric("precio_gasolina", { precision: 8, scale: 2 })
    .notNull()
    .default("0"),

  // Uber
  totalUber: numeric("total_uber", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  saldoAcumulado: numeric("saldo_acumulado", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  retiro: numeric("retiro", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  // Si se deja en null, el efectivo se calcula automáticamente
  efectivoManual: numeric("efectivo_manual", { precision: 12, scale: 2 }),

  // Otros gastos del día (casetas, comida, lavado...)
  otrosGastos: numeric("otros_gastos", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  notas: text("notas"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type JornadaRow = typeof jornadas.$inferSelect;
export type NewJornadaRow = typeof jornadas.$inferInsert;

/**
 * Presupuesto personal por semana (sección Finanzas).
 * monto = dinero con el que se cuenta esa semana.
 * El esquema 50/30/20 es editable: porcentajes para gastos, deudas y disponible.
 */
export const presupuestos = pgTable("presupuestos", {
  id: serial("id").primaryKey(),
  semana: text("semana").notNull().unique(), // "2026-W07"
  monto: numeric("monto", { precision: 12, scale: 2 }).notNull().default("0"),
  pctGastos: numeric("pct_gastos", { precision: 5, scale: 2 })
    .notNull()
    .default("50"),
  pctDeudas: numeric("pct_deudas", { precision: 5, scale: 2 })
    .notNull()
    .default("30"),
  pctDisponible: numeric("pct_disponible", { precision: 5, scale: 2 })
    .notNull()
    .default("20"),
  notas: text("notas"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PresupuestoRow = typeof presupuestos.$inferSelect;

/**
 * Movimientos de la semana: gastos, pagos a deudas y gustos.
 * Cada uno descuenta del "sobre" (categoría) al que pertenece.
 */
export const movimientos = pgTable("movimientos", {
  id: serial("id").primaryKey(),
  semana: text("semana").notNull(), // "2026-W07"
  categoria: text("categoria").notNull(), // gastos | deudas | disponible
  concepto: text("concepto").notNull(),
  monto: numeric("monto", { precision: 12, scale: 2 }).notNull().default("0"),
  fecha: date("fecha", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MovimientoRow = typeof movimientos.$inferSelect;
