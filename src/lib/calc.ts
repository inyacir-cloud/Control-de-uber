import type { JornadaRow } from "@/db/schema";

export type Jornada = {
  id: number;
  fecha: string;
  kmInicial: number;
  kmFinal: number;
  rendimientoKmL: number;
  precioGasolina: number;
  totalUber: number;
  saldoAcumulado: number;
  retiro: number;
  efectivoManual: number | null;
  otrosGastos: number;
  notas: string | null;
};

export type JornadaCalculada = Jornada & {
  km: number;
  litros: number;
  costoGasolina: number;
  costoPorKm: number;
  saldoPrevio: number;
  deltaSaldo: number;
  efectivo: number;
  efectivoAuto: boolean;
  gastosTotales: number;
  gananciaNeta: number;
  gananciaPorKm: number;
  gananciaPorLitro: number;
  ingresoPorKm: number;
};

export type Resumen = {
  dias: number;
  totalUber: number;
  efectivo: number;
  aSaldo: number;
  saldoActual: number;
  retiros: number;
  km: number;
  litros: number;
  costoGasolina: number;
  otrosGastos: number;
  gananciaNeta: number;
  rendimientoPromedio: number;
  gananciaPorKm: number;
  gananciaPorLitro: number;
  ingresoPorKm: number;
  costoPorKm: number;
  promedioDiario: number;
};

export const n = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const div = (a: number, b: number) => (b === 0 ? 0 : a / b);

export function rowToJornada(row: JornadaRow): Jornada {
  return {
    id: row.id,
    fecha: row.fecha,
    kmInicial: n(row.kmInicial),
    kmFinal: n(row.kmFinal),
    rendimientoKmL: n(row.rendimientoKmL),
    precioGasolina: n(row.precioGasolina),
    totalUber: n(row.totalUber),
    saldoAcumulado: n(row.saldoAcumulado),
    retiro: n(row.retiro),
    efectivoManual:
      row.efectivoManual === null || row.efectivoManual === undefined
        ? null
        : n(row.efectivoManual),
    otrosGastos: n(row.otrosGastos),
    notas: row.notas ?? null,
  };
}

/**
 * Calcula una jornada.
 *
 * Lógica del efectivo:
 *  Uber muestra el TOTAL del día y un SALDO A FAVOR que se va acumulando.
 *  Lo que no cobraste en efectivo es lo que se suma al saldo, entonces:
 *
 *    efectivo = total del día - (saldo de hoy - saldo de ayer + retiros/depósitos)
 */
export function calcularJornada(
  jornada: Jornada,
  saldoPrevio: number,
): JornadaCalculada {
  const km = Math.max(jornada.kmFinal - jornada.kmInicial, 0);
  const litros = div(km, jornada.rendimientoKmL);
  const costoGasolina = litros * jornada.precioGasolina;
  const deltaSaldo = jornada.saldoAcumulado - saldoPrevio + jornada.retiro;
  const efectivoAuto = jornada.efectivoManual === null;
  const efectivo = efectivoAuto
    ? jornada.totalUber - deltaSaldo
    : (jornada.efectivoManual as number);
  const gastosTotales = costoGasolina + jornada.otrosGastos;
  const gananciaNeta = jornada.totalUber - gastosTotales;

  return {
    ...jornada,
    km,
    litros,
    costoGasolina,
    costoPorKm: div(costoGasolina, km),
    saldoPrevio,
    deltaSaldo,
    efectivo,
    efectivoAuto,
    gastosTotales,
    gananciaNeta,
    gananciaPorKm: div(gananciaNeta, km),
    gananciaPorLitro: div(gananciaNeta, litros),
    ingresoPorKm: div(jornada.totalUber, km),
  };
}

/** Recibe jornadas en cualquier orden y devuelve calculadas, de la más nueva a la más vieja. */
export function calcularTodas(jornadas: Jornada[]): JornadaCalculada[] {
  const asc = [...jornadas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const out: JornadaCalculada[] = [];
  let saldoPrevio = 0;
  for (const j of asc) {
    const calc = calcularJornada(j, saldoPrevio);
    saldoPrevio = j.saldoAcumulado;
    out.push(calc);
  }
  return out.reverse();
}

export function resumir(items: JornadaCalculada[]): Resumen {
  const sum = (fn: (j: JornadaCalculada) => number) =>
    items.reduce((acc, j) => acc + fn(j), 0);

  const totalUber = sum((j) => j.totalUber);
  const efectivo = sum((j) => j.efectivo);
  const km = sum((j) => j.km);
  const litros = sum((j) => j.litros);
  const costoGasolina = sum((j) => j.costoGasolina);
  const otrosGastos = sum((j) => j.otrosGastos);
  const gananciaNeta = totalUber - costoGasolina - otrosGastos;
  // items viene ordenado de más nuevo a más viejo
  const saldoActual = items.length > 0 ? items[0].saldoAcumulado : 0;

  return {
    dias: items.length,
    totalUber,
    efectivo,
    aSaldo: totalUber - efectivo,
    saldoActual,
    retiros: sum((j) => j.retiro),
    km,
    litros,
    costoGasolina,
    otrosGastos,
    gananciaNeta,
    rendimientoPromedio: div(km, litros),
    gananciaPorKm: div(gananciaNeta, km),
    gananciaPorLitro: div(gananciaNeta, litros),
    ingresoPorKm: div(totalUber, km),
    costoPorKm: div(costoGasolina, km),
    promedioDiario: div(gananciaNeta, items.length),
  };
}

export const money = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

export const num = (value: number, decimals = 1) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);

export const fechaLarga = (fecha: string) => {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(y, (m ?? 1) - 1, d ?? 1));
};

export const fechaCorta = (fecha: string) => {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(y, (m ?? 1) - 1, d ?? 1));
};

export const diaSemana = (fecha: string) => {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
  }).format(new Date(y, (m ?? 1) - 1, d ?? 1));
};

/* ── Semanas ──────────────────────────────────────── */

export const hoyIso = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

export const semanaActualKey = () => fechaToWeekKey(hoyIso());

export type Semana = {
  key: string; // "2026-W06"
  label: string; // "Sem 2 – 9 feb"
 Desde: string; // "2026-02-02"
  hasta: string; // "2026-02-08"
};

function mondayOf(isoWeek: string): Date {
  const [year, wk] = isoWeek.split("-W").map(Number);
  const jan4 = new Date(year, 0, 4);
  const startDay = jan4.getDay() || 7;
  const mon = new Date(year, 0, 4 - startDay + 1 + (wk - 1) * 7);
  return mon;
}

export function fechaToWeekKey(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const dayN = dt.getDay() || 7;
  dt.setDate(dt.getDate() + 4 - dayN);
  const yearStart = new Date(dt.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((dt.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${dt.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function weekLabel(weekKey: string): string {
  const mon = mondayOf(weekKey);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  const fmt = (d: Date) => fechaCorta(fmtIso(d));
  return `${fmt(mon)} – ${fmt(sun)}`;
}

function fmtIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function semanaRango(weekKey: string): { Desde: string; hasta: string } {
  const mon = mondayOf(weekKey);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  return { Desde: fmtIso(mon), hasta: fmtIso(sun) };
}

export function semanasDisponibles(jornadas: Jornada[]): Semana[] {
  const keys = new Set(jornadas.map((j) => fechaToWeekKey(j.fecha)));
  return [...keys]
    .sort((a, b) => b.localeCompare(a))
    .map((key) => ({
      key,
      label: weekLabel(key),
      ...semanaRango(key),
    }));
}

/** Devuelve jornadas filtradas por semana (new → old) */
export function filtrarSemana(
  jornadas: JornadaCalculada[],
  weekKey: string,
): JornadaCalculada[] {
  const { Desde, hasta } = semanaRango(weekKey);
  return jornadas.filter((j) => j.fecha >= Desde && j.fecha <= hasta);
}
