import type { PresupuestoRow } from "@/db/schema";

export type Presupuesto = {
  id: number;
  semana: string; // "2026-W07"
  monto: number;
  pctGastos: number;
  pctDeudas: number;
  pctDisponible: number;
  notas: string | null;
};

export type PresupuestoCalculado = Presupuesto & {
  montoGastos: number;
  montoDeudas: number;
  montoDisponible: number;
  disponiblePorDia: number;
};

export type Categoria = "gastos" | "deudas" | "disponible";
export type Pcts = Record<Categoria, number>;

export const CATEGORIAS: Categoria[] = ["gastos", "deudas", "disponible"];

export const n = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function rowToPresupuesto(row: PresupuestoRow): Presupuesto {
  return {
    id: row.id,
    semana: row.semana,
    monto: n(row.monto),
    pctGastos: n(row.pctGastos),
    pctDeudas: n(row.pctDeudas),
    pctDisponible: n(row.pctDisponible),
    notas: row.notas ?? null,
  };
}

export function calcularPresupuesto(p: Presupuesto): PresupuestoCalculado {
  const montoGastos = (p.monto * p.pctGastos) / 100;
  const montoDeudas = (p.monto * p.pctDeudas) / 100;
  const montoDisponible = (p.monto * p.pctDisponible) / 100;
  return {
    ...p,
    montoGastos,
    montoDeudas,
    montoDisponible,
    disponiblePorDia: montoDisponible / 7,
  };
}

/**
 * Cambia el porcentaje de una categoría y rebalancea las otras dos
 * proporcionalmente para que la suma siempre sea 100.
 */
export function balancear(pcts: Pcts, cambio: Categoria, valorCrudo: number): Pcts {
  const valor = Math.max(0, Math.min(100, Math.round(valorCrudo)));
  const otros = CATEGORIAS.filter((c) => c !== cambio);
  const restante = 100 - valor;
  const sumaOtros = pcts[otros[0]] + pcts[otros[1]];
  let a: number;
  if (sumaOtros <= 0) a = Math.round(restante / 2);
  else a = Math.round((pcts[otros[0]] / sumaOtros) * restante);
  const b = restante - a;
  return {
    ...pcts,
    [cambio]: valor,
    [otros[0]]: a,
    [otros[1]]: b,
  };
}

export type Locks = Record<Categoria, boolean>;

/**
 * Cambia un porcentaje respetando las categorías bloqueadas (🔒).
 * Solo se rebalancean las categorías libres.
 */
export function balancearConLocks(
  pcts: Pcts,
  cambio: Categoria,
  valorCrudo: number,
  locks: Locks,
): Pcts {
  const bloqueadas = CATEGORIAS.filter((c) => c !== cambio && locks[c]);
  const libres = CATEGORIAS.filter((c) => c !== cambio && !locks[c]);
  const sumaBloq = bloqueadas.reduce((acc, c) => acc + pcts[c], 0);

  // El valor no puede pasar de lo que dejan libre las bloqueadas
  const max = Math.max(0, 100 - sumaBloq);
  const valor = Math.max(0, Math.min(max, Math.round(valorCrudo)));

  if (libres.length === 0) return { ...pcts, [cambio]: valor };

  const restante = 100 - sumaBloq - valor;
  const sumaLibres = libres.reduce((acc, c) => acc + pcts[c], 0);
  const next: Pcts = { ...pcts, [cambio]: valor };

  let acumulado = 0;
  libres.forEach((c, i) => {
    let v: number;
    if (i === libres.length - 1) {
      v = restante - acumulado;
    } else if (sumaLibres <= 0) {
      v = Math.round(restante / libres.length);
    } else {
      v = Math.round((pcts[c] / sumaLibres) * restante);
    }
    next[c] = Math.max(0, v);
    acumulado += next[c];
  });

  return next;
}

/** Ajusta cualquier combinación para que sume exactamente 100. */
export function normalizar(pcts: Pcts): Pcts {
  const suma = CATEGORIAS.reduce((acc, c) => acc + pcts[c], 0);
  if (suma === 100) return pcts;
  if (suma <= 0) return { gastos: 50, deudas: 30, disponible: 20 };
  const next = {} as Pcts;
  let acumulado = 0;
  CATEGORIAS.forEach((c, i) => {
    if (i === CATEGORIAS.length - 1) next[c] = 100 - acumulado;
    else {
      next[c] = Math.round((pcts[c] / suma) * 100);
      acumulado += next[c];
    }
  });
  return next;
}

export const sumaPcts = (p: Pcts) =>
  CATEGORIAS.reduce((acc, c) => acc + p[c], 0);

export const PRESETS: { nombre: string; desc: string; pcts: Pcts }[] = [
  {
    nombre: "50 / 30 / 20",
    desc: "Clásico equilibrado",
    pcts: { gastos: 50, deudas: 30, disponible: 20 },
  },
  {
    nombre: "60 / 20 / 20",
    desc: "Gastos altos",
    pcts: { gastos: 60, deudas: 20, disponible: 20 },
  },
  {
    nombre: "50 / 40 / 10",
    desc: "Salir de deudas",
    pcts: { gastos: 50, deudas: 40, disponible: 10 },
  },
  {
    nombre: "70 / 20 / 10",
    desc: "Semana apretada",
    pcts: { gastos: 70, deudas: 20, disponible: 10 },
  },
  {
    nombre: "40 / 30 / 30",
    desc: "Semana buena",
    pcts: { gastos: 40, deudas: 30, disponible: 30 },
  },
];

/* ── Movimientos ───────────────────────────────────── */

export type Movimiento = {
  id: number;
  semana: string;
  categoria: Categoria;
  concepto: string;
  monto: number;
  fecha: string;
};

export function rowToMovimiento(row: {
  id: number;
  semana: string;
  categoria: string;
  concepto: string;
  monto: string;
  fecha: string;
}): Movimiento {
  const cat = CATEGORIAS.includes(row.categoria as Categoria)
    ? (row.categoria as Categoria)
    : "gastos";
  return {
    id: row.id,
    semana: row.semana,
    categoria: cat,
    concepto: row.concepto,
    monto: n(row.monto),
    fecha: row.fecha,
  };
}

export type SobreEstado = {
  categoria: Categoria;
  asignado: number;
  gastado: number;
  restante: number;
  pctUsado: number;
};

export function estadoSobres(
  calc: PresupuestoCalculado,
  movimientos: Movimiento[],
): Record<Categoria, SobreEstado> {
  const asignados: Record<Categoria, number> = {
    gastos: calc.montoGastos,
    deudas: calc.montoDeudas,
    disponible: calc.montoDisponible,
  };
  const out = {} as Record<Categoria, SobreEstado>;
  for (const c of CATEGORIAS) {
    const gastado = movimientos
      .filter((m) => m.categoria === c)
      .reduce((acc, m) => acc + m.monto, 0);
    const asignado = asignados[c];
    out[c] = {
      categoria: c,
      asignado,
      gastado,
      restante: asignado - gastado,
      pctUsado: asignado > 0 ? (gastado / asignado) * 100 : 0,
    };
  }
  return out;
}

export const META_INFO: Record<
  Categoria,
  { label: string; emoji: string; desc: string }
> = {
  gastos: {
    label: "Gastos",
    emoji: "🏠",
    desc: "Renta, comida, servicios, transporte…",
  },
  deudas: {
    label: "Deudas",
    emoji: "💳",
    desc: "Tarjetas, préstamos, abonos…",
  },
  disponible: {
    label: "Disponible",
    emoji: "🎯",
    desc: "Dinero libre para la semana (ahorro o gustos)",
  },
};
