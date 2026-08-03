"use client";

import { money, num, diaSemana, fechaCorta, type JornadaCalculada } from "@/lib/calc";

type Resumen = {
  dias: number;
  totalUber: number;
  efectivo: number;
  aSaldo: number;
  saldoActual: number;
  retiros: number;
  gananciaNeta: number;
  promedioDiario: number;
  km: number;
  litros: number;
  costoGasolina: number;
  otrosGastos: number;
  rendimientoPromedio: number;
  gananciaPorKm: number;
  gananciaPorLitro: number;
  costoPorKm: number;
  ingresoPorKm: number;
};

export default function TabDashboard({
  semana,
  resumen,
}: {
  semana: JornadaCalculada[];
  resumen: Resumen;
}) {
  const maxGanancia = Math.max(1, ...semana.map((j) => Math.abs(j.gananciaNeta)));
  const maxIngresos = Math.max(1, ...semana.map((j) => j.totalUber));
  const margen =
    resumen.totalUber > 0
      ? Math.round((resumen.gananciaNeta / resumen.totalUber) * 100)
      : 0;
  const pendientePago = resumen.saldoActual;
  const gasoPct =
    resumen.totalUber > 0
      ? Math.min(100, (resumen.costoGasolina / resumen.totalUber) * 100)
      : 0;
  const efectivoPct =
    resumen.totalUber > 0
      ? Math.min(100, (resumen.efectivo / resumen.totalUber) * 100)
      : 0;
  const saldoPct =
    resumen.totalUber > 0
      ? Math.min(100, (resumen.aSaldo / resumen.totalUber) * 100)
      : 0;

  const sinDatos = semana.length === 0;

  return (
    <div className="space-y-4">
      {/* ── Tarjeta héroe ── */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-400 via-cyan-300 to-sky-400 p-5 shadow-2xl shadow-cyan-950/40">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-4 h-32 w-32 rounded-full bg-teal-900/20 blur-2xl" />
        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-900/60">
            Ganancia neta · semana
          </p>
          <p className="mt-1 text-5xl font-black tabular-nums tracking-tight text-slate-950">
            {money(resumen.gananciaNeta)}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {margen >= 0 ? (
              <span className="rounded-full bg-teal-900/15 px-2 py-0.5 text-[11px] font-black text-teal-900/70">
                {margen}% margen
              </span>
            ) : null}
            <span className="text-[11px] text-teal-900/50">
              {resumen.dias} día(s) · prom {money(resumen.promedioDiario)}/día
            </span>
          </div>

          {/* Mini barra de distribución */}
          <div className="mt-4">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-teal-900/15">
              <div
                className="h-full bg-teal-900/40 transition-all"
                style={{ width: `${gasoPct}%` }}
                title={`Gasolina ${num(gasoPct, 0)}%`}
              />
              <div
                className="h-full bg-white/50 transition-all"
                style={{ width: `${efectivoPct}%` }}
                title={`Efectivo ${num(efectivoPct, 0)}%`}
              />
              <div
                className="h-full bg-white/25 transition-all"
                style={{ width: `${saldoPct}%` }}
                title={`Saldo ${num(saldoPct, 0)}%`}
              />
            </div>
            <div className="mt-1.5 flex gap-3 text-[9px] font-black text-teal-900/55 uppercase tracking-wide">
              <span>⛽ Gas {num(gasoPct, 0)}%</span>
              <span>💵 Efectivo {num(efectivoPct, 0)}%</span>
              <span>🏦 Saldo {num(saldoPct, 0)}%</span>
            </div>
          </div>

          {/* Tres métricas clave */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Total Uber", value: money(resumen.totalUber) },
              { label: "Efectivo", value: money(resumen.efectivo) },
              { label: "Gasolina", value: money(resumen.costoGasolina) },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-teal-900/12 p-2.5 backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-wide text-teal-900/50">
                  {m.label}
                </p>
                <p className="text-sm font-black tabular-nums text-slate-950">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Saldo pendiente de cobro ── */}
      {pendientePago > 0 ? (
        <section className="flex items-center gap-3 rounded-[24px] border border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-purple-500/10 px-4 py-3.5">
          <span className="text-2xl">💳</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-300/70">
              Saldo pendiente por cobrar
            </p>
            <p className="text-xl font-black tabular-nums text-violet-200">
              {money(pendientePago)}
            </p>
            <p className="text-[10px] text-slate-500">
              Uber te lo depositará al final de la semana
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-violet-400/20 bg-violet-500/15 px-3 py-1.5 text-center">
            <p className="text-[9px] font-black uppercase text-violet-300/60">En camino</p>
            <p className="text-[11px] font-black text-violet-200">fin de sem.</p>
          </div>
        </section>
      ) : null}

      {resumen.retiros > 0 ? (
        <section className="flex items-center gap-3 rounded-[24px] border border-emerald-400/30 bg-gradient-to-r from-emerald-500/12 to-teal-500/8 px-4 py-3.5">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300/70">
              Depósito recibido esta semana
            </p>
            <p className="text-xl font-black tabular-nums text-emerald-300">
              {money(resumen.retiros)}
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Gráfica diaria limpia ── */}
      <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Rendimiento diario</p>
            <h3 className="text-sm font-black text-white">Ingresos vs Ganancia neta</h3>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300">{semana.length} registro</span>
        </div>
        {semana.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">Sin jornadas esta semana</p>
        ) : (
          <div className="space-y-3">
            {semana.map((j) => (
              <div key={j.id}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-black text-slate-300">{diaSemana(j.fecha)} {j.fecha.slice(8)}</span>
                  <div className="flex gap-2 tabular-nums text-[10px]">
                    <span className="text-amber-300">{money(j.totalUber)}</span>
                    <span className={j.gananciaNeta >= 0 ? "text-emerald-300" : "text-rose-300"}>{money(j.gananciaNeta)}</span>
                  </div>
                </div>
                <div className="h-6 overflow-hidden rounded-xl bg-slate-950/60 p-0.5 relative">
                  <div
                    className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] rounded-lg bg-gradient-to-r from-cyan-300/30 to-cyan-300/10"
                    style={{ width: `${Math.min(100, (j.totalUber / maxIngresos) * 100)}%` }}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 h-[calc(100%-4px)] rounded-lg ${j.gananciaNeta >= 0 ? "bg-gradient-to-r from-emerald-400 to-cyan-300" : "bg-gradient-to-r from-rose-500 to-pink-400"}`}
                    style={{ width: `${Math.min(100, (Math.abs(j.gananciaNeta) / maxIngresos) * 100)}%` }}
                  />
                  <span className="absolute left-2 top-0.5 text-[9px] font-black text-white/90 tabular-nums z-10">{money(j.totalUber)}</span>
                  <span className={`absolute right-2 top-0.5 text-[9px] font-black tabular-nums z-10 ${j.gananciaNeta >= 0 ? "text-emerald-200" : "text-rose-200"}`}>{money(j.gananciaNeta)}</span>
                </div>
                <div className="mt-0.5 flex gap-2 text-[9px] text-slate-500">
                  <span>⛽ {money(j.costoGasolina)}</span>
                  <span>🛣️ {num(j.km, 0)} km</span>
                  {j.retiro > 0 ? <span className="text-violet-400">💳 {money(j.retiro)}</span> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Grid de métricas ── */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="Efectivo cobrado"
          value={money(resumen.efectivo)}
          sub={`${num(efectivoPct, 0)}% del total`}
          accent="from-emerald-400/20 to-teal-400/5"
          textColor="text-emerald-300"
          icon="💵"
        />
        <StatCard
          label="Saldo a cobrar"
          value={money(resumen.saldoActual)}
          sub="Depósito fin de semana"
          accent="from-violet-400/20 to-purple-400/5"
          textColor="text-violet-300"
          icon="🏦"
        />
        <StatCard
          label="Gasolina semana"
          value={money(resumen.costoGasolina)}
          sub={`${num(resumen.litros, 1)} L · prom ${money(resumen.dias > 0 ? resumen.costoGasolina / resumen.dias : 0)}/día`}
          accent="from-amber-400/20 to-orange-400/5"
          textColor="text-amber-300"
          icon="⛽"
        />
        <StatCard
          label="Kilómetros"
          value={`${num(resumen.km, 0)} km`}
          sub={`${num(resumen.rendimientoPromedio, 1)} km/L · ${money(resumen.costoPorKm)}/km`}
          accent="from-sky-400/20 to-cyan-400/5"
          textColor="text-sky-300"
          icon="🛣️"
        />
      </section>

      {/* ── Resumen por día (tabla compacta) ── */}
      {!sinDatos ? (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-xl">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Detalle por jornada
            </p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {semana.map((j) => (
              <div key={j.id} className="flex items-center gap-3 px-4 py-3">
                <div className="shrink-0 text-center">
                  <p className="text-base font-black leading-none text-white">
                    {j.fecha.slice(8)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500">
                    {diaSemana(j.fecha)}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {money(j.totalUber)}
                      <span className="ml-1.5 text-[10px] font-normal text-slate-500">
                        Uber
                      </span>
                    </span>
                    <span
                      className={`text-sm font-black tabular-nums ${
                        j.gananciaNeta >= 0 ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {money(j.gananciaNeta)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
                    <span>💵 {money(j.efectivo)}</span>
                    <span>⛽ {money(j.costoGasolina)}</span>
                    <span>🛣️ {num(j.km, 0)} km</span>
                    {j.retiro > 0 ? (
                      <span className="text-violet-400">💳 {money(j.retiro)}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm">
            <span className="font-bold text-slate-400">Total</span>
            <span className="font-black tabular-nums text-white">
              {money(resumen.totalUber)}
            </span>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center">
      <p className="text-2xl">📊</p>
      <p className="mt-2 text-sm font-bold text-slate-400">Sin jornadas esta semana</p>
      <p className="mt-1 text-xs text-slate-600">
        Toca el botón + para registrar tu primer día
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  textColor,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  textColor: string;
  icon: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-gradient-to-br p-4 shadow-lg shadow-black/15 ${accent}`}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-sm">{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
      </div>
      <p className={`text-xl font-black tabular-nums ${textColor}`}>{value}</p>
      <p className="mt-1 text-[10px] leading-tight text-slate-500">{sub}</p>
    </div>
  );
}
