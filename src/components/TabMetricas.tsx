"use client";

import { money, num, diaSemana, fechaCorta, type JornadaCalculada } from "@/lib/calc";

export default function TabMetricas({
  semana,
  resumen,
}: {
  semana: JornadaCalculada[];
  resumen: {
    km: number;
    litros: number;
    costoGasolina: number;
    otrosGastos: number;
    rendimientoPromedio: number;
    gananciaPorKm: number;
    gananciaPorLitro: number;
    costoPorKm: number;
    ingresoPorKm: number;
    dias: number;
    totalUber: number;
    gananciaNeta: number;
  };
}) {
  const maxGas = Math.max(1, ...semana.map((j) => j.costoGasolina));
  const maxKm  = Math.max(1, ...semana.map((j) => j.km));
  const promGas    = resumen.dias > 0 ? resumen.costoGasolina / resumen.dias : 0;
  const promLitros = resumen.dias > 0 ? resumen.litros / resumen.dias : 0;
  const promKm     = resumen.dias > 0 ? resumen.km / resumen.dias : 0;
  const pctGas     = resumen.totalUber > 0
    ? (resumen.costoGasolina / resumen.totalUber) * 100 : 0;
  const sinDatos   = semana.length === 0;

  return (
    <div className="space-y-4">

      {/* ── Tarjeta gasolina ── */}
      <section className="relative overflow-hidden rounded-[32px] border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-orange-500/8 to-transparent p-5">
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-400/15 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300/60">
              Gasto de gasolina · semana
            </p>
            <p className="mt-1 text-4xl font-black tabular-nums text-amber-300">
              {money(resumen.costoGasolina)}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span className="text-slate-400">
                Prom <span className="font-black text-amber-200">{money(promGas)}</span>/día
              </span>
              <span className="text-slate-400">
                <span className="font-black text-amber-200">{num(resumen.litros, 1)}</span> litros total
              </span>
              <span className="text-slate-400">
                Prom <span className="font-black text-amber-200">{num(promLitros, 1)} L</span>/día
              </span>
            </div>
          </div>
          <div
            className={`shrink-0 rounded-2xl border px-3 py-2 text-center ${
              pctGas > 30
                ? "border-rose-400/30 bg-rose-500/15"
                : "border-emerald-400/30 bg-emerald-500/15"
            }`}
          >
            <p className="text-[9px] font-black uppercase text-slate-500">del total</p>
            <p className={`text-xl font-black ${pctGas > 30 ? "text-rose-300" : "text-emerald-300"}`}>
              {num(pctGas, 0)}%
            </p>
          </div>
        </div>
      </section>

      {/* ── Barras de gasolina por día ── */}
      {!sinDatos ? (
        <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
            Gasto diario de gasolina
          </p>
          <div className="space-y-3">
            {semana.map((j) => (
              <div key={j.id}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-black text-slate-300">
                    {diaSemana(j.fecha)} {j.fecha.slice(8)}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-slate-500">{num(j.litros, 1)} L</span>
                    <span className="font-black text-amber-300">{money(j.costoGasolina)}</span>
                  </div>
                </div>
                <div className="h-5 overflow-hidden rounded-2xl bg-slate-950/60 p-0.5">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (j.costoGasolina / maxGas) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-600">
                  {num(j.rendimientoKmL, 1)} km/L · {num(j.litros, 1)} L × {money(j.precioGasolina)}/L
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Kilómetros ── */}
      <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
            Kilómetros recorridos
          </p>
          <p className="text-sm font-black tabular-nums text-white">
            {num(resumen.km, 0)} km total
          </p>
        </div>
        {sinDatos ? (
          <p className="py-4 text-center text-sm text-slate-500">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {semana.map((j) => (
              <div key={j.id}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-black text-slate-300">
                    {diaSemana(j.fecha)} {j.fecha.slice(8)}
                  </span>
                  <span className="font-black tabular-nums text-white">{num(j.km, 0)} km</span>
                </div>
                <div className="h-5 overflow-hidden rounded-2xl bg-slate-950/60 p-0.5">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-300 transition-all duration-500"
                    style={{ width: `${Math.min(100, (j.km / maxKm) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-600">
                  Odo {num(j.kmInicial, 0)} → {num(j.kmFinal, 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Métricas de eficiencia ── */}
      <section>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Eficiencia y rentabilidad
        </p>
        <div className="grid grid-cols-2 gap-3">
          <MetricaCard
            icon="🔧"
            label="Rendimiento"
            value={`${num(resumen.rendimientoPromedio, 1)}`}
            unit="km/L"
            color="text-sky-300"
            bg="from-sky-400/12"
          />
          <MetricaCard
            icon="📈"
            label="Ingreso / km"
            value={money(resumen.ingresoPorKm)}
            unit="/km"
            color="text-emerald-300"
            bg="from-emerald-400/12"
          />
          <MetricaCard
            icon="💰"
            label="Ganancia / km"
            value={money(resumen.gananciaPorKm)}
            unit="/km"
            color="text-cyan-300"
            bg="from-cyan-400/12"
          />
          <MetricaCard
            icon="⛽"
            label="Costo gas / km"
            value={money(resumen.costoPorKm)}
            unit="/km"
            color="text-amber-300"
            bg="from-amber-400/12"
          />
          <MetricaCard
            icon="💧"
            label="Ganancia / L"
            value={money(resumen.gananciaPorLitro)}
            unit="/litro"
            color="text-teal-300"
            bg="from-teal-400/12"
          />
          <MetricaCard
            icon="🛣️"
            label="Prom km / día"
            value={`${num(promKm, 0)}`}
            unit="km"
            color="text-slate-200"
            bg="from-slate-400/10"
          />
        </div>
      </section>

      {/* ── Historial de odómetro ── */}
      {!sinDatos ? (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-xl">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Historial de odómetro
            </p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {semana.map((j) => (
              <div key={j.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="shrink-0 text-center">
                  <p className="font-black text-white">{j.fecha.slice(8)}</p>
                  <p className="text-[10px] text-slate-500">{diaSemana(j.fecha)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-slate-500">{num(j.kmInicial, 0)}</span>
                    <span className="text-slate-700">→</span>
                    <span className="font-bold text-white">{num(j.kmFinal, 0)}</span>
                    <span className="ml-auto font-black text-emerald-300">
                      +{num(j.km, 0)} km
                    </span>
                  </div>
                  <div className="mt-0.5 flex gap-3 text-[10px] text-slate-600">
                    <span>⛽ {money(j.costoGasolina)}</span>
                    <span>🔧 {num(j.rendimientoKmL, 1)} km/L</span>
                    <span>💧 {num(j.litros, 1)} L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.04] px-4 py-3">
            <span className="text-sm font-bold text-slate-400">Total</span>
            <div className="flex gap-4 text-sm tabular-nums">
              <span className="font-black text-white">{num(resumen.km, 0)} km</span>
              <span className="text-amber-300">{money(resumen.costoGasolina)}</span>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function MetricaCard({
  icon,
  label,
  value,
  unit,
  color,
  bg,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-[24px] border border-white/10 bg-gradient-to-br p-4 shadow-lg shadow-black/15 ${bg} to-transparent`}>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      </div>
      <p className={`text-xl font-black tabular-nums ${color}`}>
        {value}
        <span className="ml-1 text-xs font-semibold text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
