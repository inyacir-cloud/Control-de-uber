"use client";

import { money, fechaCorta, diaSemana, type JornadaCalculada } from "@/lib/calc";

export default function TabPagos({
  semana,
  resumen,
  onEditar,
  onBorrar,
}: {
  semana: JornadaCalculada[];
  resumen: {
    totalUber: number;
    efectivo: number;
    aSaldo: number;
    saldoActual: number;
    retiros: number;
    costoGasolina: number;
  };
  onEditar: (j: JornadaCalculada) => void;
  onBorrar: (id: number) => void;
}) {
  const hayDeposito = resumen.retiros > 0;

  return (
    <div className="space-y-4">

      {/* ── Tarjeta resumen de pagos ── */}
      <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Resumen semanal de pagos
        </p>
        <div className="space-y-2">
          <PagoFila
            label="Total ganado (Uber)"
            value={money(resumen.totalUber)}
            color="text-white"
            bold
          />
          <div className="flex h-px w-full bg-white/[0.08]" />
          <PagoFila
            label="💵 Cobrado en efectivo"
            value={money(resumen.efectivo)}
            color="text-emerald-300"
            bold
          />
          <PagoFila
            label="🏦 Fue al saldo acumulado"
            value={money(resumen.aSaldo)}
            color="text-cyan-300"
          />
          {hayDeposito ? (
            <PagoFila
              label="💳 Depósito recibido de Uber"
              value={money(resumen.retiros)}
              color="text-violet-300"
              bold
            />
          ) : null}
          <div className="flex h-px w-full bg-white/[0.08]" />
          <PagoFila
            label="⛽ Gasto en gasolina"
            value={money(resumen.costoGasolina)}
            color="text-amber-300"
          />
        </div>

        {/* Barra de distribución */}
        {resumen.totalUber > 0 ? (
          <div className="mt-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-950/60">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${Math.min(100, (resumen.efectivo / resumen.totalUber) * 100)}%` }}
              />
              <div
                className="h-full bg-cyan-400/70 transition-all"
                style={{ width: `${Math.min(100, (resumen.aSaldo / resumen.totalUber) * 100)}%` }}
              />
              <div
                className="h-full bg-amber-400/70 transition-all"
                style={{ width: `${Math.min(100, (resumen.costoGasolina / resumen.totalUber) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex gap-3 text-[9px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-full bg-emerald-400" /> Efectivo
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-full bg-cyan-400/70" /> Saldo
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-3 rounded-full bg-amber-400/70" /> Gasolina
              </span>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── Saldo pendiente ── */}
      {resumen.saldoActual > 0 ? (
        <section className="flex items-center gap-3 rounded-[24px] border border-violet-400/30 bg-violet-500/10 px-4 py-3.5">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-300/70">
              Pendiente por depositar
            </p>
            <p className="text-2xl font-black tabular-nums text-violet-200">
              {money(resumen.saldoActual)}
            </p>
            <p className="text-[10px] text-slate-500">
              Uber lo depositará al terminar la semana
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Cómo funciona ── */}
      <section className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          <span>💡</span> Cómo funciona tu pago
        </p>
        <div className="space-y-2">
          {[
            { icono: "📱", texto: "Uber muestra tu ganancia del día" },
            { icono: "💵", texto: "Lo que cobras en efectivo al cliente te queda de inmediato" },
            { icono: "🏦", texto: "Lo que no cobras en efectivo se acumula en el saldo" },
            { icono: "💳", texto: "Uber te deposita el saldo al final de la semana" },
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-2.5 text-[11px]">
              <span className="mt-0.5 shrink-0 text-sm">{p.icono}</span>
              <p className="leading-relaxed text-slate-400">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lista de jornadas ── */}
      {semana.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-white/10 p-10 text-center">
          <p className="text-2xl">📋</p>
          <p className="mt-2 text-sm font-bold text-slate-400">Sin jornadas esta semana</p>
          <p className="mt-1 text-xs text-slate-600">Toca + para agregar una</p>
        </section>
      ) : (
        <div className="space-y-3">
          {semana.map((j) => (
            <JornadaCard key={j.id} j={j} onEditar={onEditar} onBorrar={onBorrar} />
          ))}
        </div>
      )}
    </div>
  );
}

function JornadaCard({
  j,
  onEditar,
  onBorrar,
}: {
  j: JornadaCalculada;
  onEditar: (j: JornadaCalculada) => void;
  onBorrar: (id: number) => void;
}) {
  const tienePago = j.retiro > 0;

  return (
    <div
      className={`overflow-hidden rounded-[28px] border shadow-lg shadow-black/15 ${
        tienePago
          ? "border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-purple-500/5"
          : "border-white/10 bg-white/[0.07]"
      } backdrop-blur-xl`}
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-black text-white">
              {diaSemana(j.fecha)}, {fechaCorta(j.fecha)}
            </p>
            {tienePago ? (
              <span className="rounded-full border border-violet-400/30 bg-violet-500/20 px-2 py-0.5 text-[10px] font-black text-violet-300">
                💳 Pago registrado
              </span>
            ) : null}
          </div>
          {j.notas ? (
            <p className="mt-0.5 text-[11px] text-slate-500">{j.notas}</p>
          ) : null}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onEditar(j)}
            className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-sm transition active:scale-95 active:bg-white/15"
          >
            ✏️
          </button>
          <button
            onClick={() => onBorrar(j.id)}
            className="flex h-8 w-8 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10 text-sm transition active:scale-95 active:bg-rose-500/20"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Desglose en grid */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
        <DetalleCell
          label="Ganancia Uber"
          value={money(j.totalUber)}
          color="text-white"
          bg="bg-white/[0.04]"
        />
        <DetalleCell
          label="💵 Efectivo"
          value={money(j.efectivo)}
          color="text-emerald-300"
          bg="bg-white/[0.04]"
          bold
        />
        <DetalleCell
          label="🏦 Saldo anterior"
          value={money(j.saldoPrevio)}
          color="text-slate-400"
          bg="bg-white/[0.03]"
        />
        <DetalleCell
          label="🏦 Saldo nuevo"
          value={money(j.saldoAcumulado)}
          color="text-cyan-300"
          bg="bg-white/[0.03]"
        />
        <DetalleCell
          label="📥 Fue al saldo"
          value={money(j.deltaSaldo)}
          color="text-cyan-200"
          bg="bg-white/[0.03]"
        />
        {tienePago ? (
          <DetalleCell
            label="💳 Depósito"
            value={money(j.retiro)}
            color="text-violet-300"
            bg="bg-violet-500/[0.06]"
            bold
          />
        ) : (
          <DetalleCell
            label="⛽ Gasolina"
            value={money(j.costoGasolina)}
            color="text-amber-300"
            bg="bg-white/[0.03]"
          />
        )}
      </div>

      {/* Fórmula */}
      <div className="px-4 py-2.5">
        <p className="text-[10px] leading-relaxed text-slate-600">
          Efectivo ={" "}
          <span className="text-white">{money(j.totalUber)}</span> −{" "}
          <span className="text-cyan-400">{money(j.deltaSaldo)}</span> (saldo) ={" "}
          <span className="font-black text-emerald-400">{money(j.efectivo)}</span>
          {tienePago ? (
            <span className="ml-2 text-violet-400">
              · depósito {money(j.retiro)}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function PagoFila({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={`tabular-nums ${color} ${bold ? "font-black text-sm" : "font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}

function DetalleCell({
  label,
  value,
  color,
  bg,
  bold,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
  bold?: boolean;
}) {
  return (
    <div className={`${bg} px-4 py-2.5`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
        {label}
      </p>
      <p className={`mt-0.5 text-sm tabular-nums ${color} ${bold ? "font-black" : "font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}
