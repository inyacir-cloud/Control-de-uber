"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calcularJornada,
  money,
  num,
  type Jornada,
  type JornadaCalculada,
} from "@/lib/calc";
import { Field, inputClass } from "@/components/ui";

type FormState = {
  fecha: string;
  kmInicial: string;
  kmFinal: string;
  rendimientoKmL: string;
  precioGasolina: string;
  totalUber: string;
  saldoAcumulado: string;
  retiro: string;
  efectivoManual: string;
  otrosGastos: string;
  notas: string;
};

const hoy = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

const vacio = (defaults: Partial<FormState>): FormState => ({
  fecha: hoy(),
  kmInicial: "",
  kmFinal: "",
  rendimientoKmL: "",
  precioGasolina: "",
  totalUber: "",
  saldoAcumulado: "",
  retiro: "0",
  efectivoManual: "",
  otrosGastos: "0",
  notas: "",
  ...defaults,
});

export default function JornadaForm({
  jornadas,
  editando,
  defaults,
  onSaved,
  onCancel,
}: {
  jornadas: JornadaCalculada[];
  editando: JornadaCalculada | null;
  defaults: {
    ultimoKmFinal: number;
    ultimoSaldo: number;
    ultimoRendimiento: number;
    ultimoPrecio: number;
  };
  onSaved: () => void;
  onCancel: () => void;
}) {
  const baseDefaults = useMemo<Partial<FormState>>(
    () => ({
      kmInicial: defaults.ultimoKmFinal ? String(defaults.ultimoKmFinal) : "",
      saldoAcumulado: defaults.ultimoSaldo ? String(defaults.ultimoSaldo) : "",
      rendimientoKmL: defaults.ultimoRendimiento
        ? String(defaults.ultimoRendimiento)
        : "",
      precioGasolina: defaults.ultimoPrecio ? String(defaults.ultimoPrecio) : "",
    }),
    [defaults.ultimoKmFinal, defaults.ultimoSaldo, defaults.ultimoRendimiento, defaults.ultimoPrecio],
  );

  const [form, setForm] = useState<FormState>(() => vacio(baseDefaults));
  const [autoEfectivo, setAutoEfectivo] = useState(true);
  const [pagoRegistrado, setPagoRegistrado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (editando) {
      setForm({
        fecha: editando.fecha,
        kmInicial: String(editando.kmInicial),
        kmFinal: String(editando.kmFinal),
        rendimientoKmL: String(editando.rendimientoKmL),
        precioGasolina: String(editando.precioGasolina),
        totalUber: String(editando.totalUber),
        saldoAcumulado: String(editando.saldoAcumulado),
        retiro: String(editando.retiro),
        efectivoManual:
          editando.efectivoManual === null ? "" : String(editando.efectivoManual),
        otrosGastos: String(editando.otrosGastos),
        notas: editando.notas ?? "",
      });
      setAutoEfectivo(editando.efectivoManual === null);
      setPagoRegistrado(editando.retiro > 0);
    } else {
      setForm(vacio(baseDefaults));
      setAutoEfectivo(true);
      setPagoRegistrado(false);
    }
    setError(null);
    setExito(false);
  }, [editando, baseDefaults]);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saldoPrevio = useMemo(() => {
    const previos = jornadas
      .filter((j) => j.fecha < form.fecha && j.id !== editando?.id)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    return previos.length > 0 ? previos[0].saldoAcumulado : 0;
  }, [jornadas, form.fecha, editando?.id]);

  // Total acumulado de los días anteriores: suma de todo lo que fue al saldo
  const acumuladoSemana = useMemo(() => {
    const previos = jornadas
      .filter((j) => j.fecha < form.fecha && j.id !== editando?.id)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    let saldo = 0;
    for (const j of previos) {
      saldo = j.saldoAcumulado;
    }
    return saldo;
  }, [jornadas, form.fecha, editando?.id]);

  // Cuando activas "Pago registrado", se autocompleta el depósito
  const retiroEfectivo = pagoRegistrado ? acumuladoSemana : Number(form.retiro) || 0;

  const preview = useMemo(() => {
    const j: Jornada = {
      id: editando?.id ?? 0,
      fecha: form.fecha,
      kmInicial: Number(form.kmInicial) || 0,
      kmFinal: Number(form.kmFinal) || 0,
      rendimientoKmL: Number(form.rendimientoKmL) || 0,
      precioGasolina: Number(form.precioGasolina) || 0,
      totalUber: Number(form.totalUber) || 0,
      saldoAcumulado: Number(form.saldoAcumulado) || 0,
      retiro: retiroEfectivo,
      efectivoManual: autoEfectivo ? null : Number(form.efectivoManual) || 0,
      otrosGastos: Number(form.otrosGastos) || 0,
      notas: form.notas,
    };
    return calcularJornada(j, saldoPrevio);
  }, [form, autoEfectivo, saldoPrevio, editando?.id, retiroEfectivo]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(false);
    try {
      const payload = {
        ...form,
        retiro: String(retiroEfectivo),
        efectivoManual: autoEfectivo ? null : form.efectivoManual,
      };
      const res = await fetch(
        editando ? `/api/jornadas/${editando.id}` : "/api/jornadas",
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No se pudo guardar la jornada.");
      }
      setExito(true);
      onSaved();
      if (!editando) setForm(vacio(baseDefaults));
      setTimeout(() => setExito(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-black text-white">
          {editando ? `Editar ${editando.fecha}` : "Nueva jornada"}
        </h2>
        {editando ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[11px] text-slate-300 active:bg-white/10"
          >
            Cancelar
          </button>
        ) : null}
      </div>

      {/* ── Datos básicos ── */}
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Fecha">
          <input
            type="date"
            required
            className={inputClass}
            value={form.fecha}
            onChange={(e) => set("fecha")(e.target.value)}
          />
        </Field>
        <Field label="Total del día" hint="Lo que dice Uber">
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            className={inputClass}
            value={form.totalUber}
            onChange={(e) => set("totalUber")(e.target.value)}
          />
        </Field>
      </div>

      {/* ── Km y gasolina ── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          🚗 Kilometraje y gasolina
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Km inicial" hint="Odómetro">
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className={inputClass}
              value={form.kmInicial}
              onChange={(e) => set("kmInicial")(e.target.value)}
            />
          </Field>
          <Field label="Km final" hint="Odómetro">
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className={inputClass}
              value={form.kmFinal}
              onChange={(e) => set("kmFinal")(e.target.value)}
            />
          </Field>
          <Field label="km por litro" hint="Rendimiento">
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="ej. 14.5"
              className={inputClass}
              value={form.rendimientoKmL}
              onChange={(e) => set("rendimientoKmL")(e.target.value)}
            />
          </Field>
          <Field label="Precio litro" hint="$ por litro">
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="ej. 23.90"
              className={inputClass}
              value={form.precioGasolina}
              onChange={(e) => set("precioGasolina")(e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SALDO Y EFECTIVO — rediseñado
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-3">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
          💵 Saldo y efectivo
        </p>

        {/* Total acumulado de los días anteriores */}
        <div className="rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/15 to-sky-400/5 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200/70">
                Acumulado de días anteriores
              </p>
              <p className="mt-1 text-2xl font-black tabular-nums text-cyan-300">
                {money(acumuladoSemana)}
              </p>
            </div>
            <span className="text-3xl opacity-30">🏦</span>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-cyan-200/50">
            Es el saldo que Uber te debe de los días que trabajaste antes de hoy.
            Cada día que no te pagaron en efectivo, se fue sumando aquí.
          </p>
        </div>

        {/* Saldo acumulado que muestra Uber hoy */}
        <div className="mt-3">
          <Field label="Saldo acumulado de hoy" hint="Lo que muestra la app de Uber">
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              className={inputClass}
              value={form.saldoAcumulado}
              onChange={(e) => set("saldoAcumulado")(e.target.value)}
            />
          </Field>
        </div>

        {/* ── Pago registrado ── */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              const next = !pagoRegistrado;
              setPagoRegistrado(next);
              if (next) {
                setForm((prev) => ({ ...prev, retiro: String(acumuladoSemana) }));
              } else {
                setForm((prev) => ({ ...prev, retiro: "0" }));
              }
            }}
            className={`w-full rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
              pagoRegistrado
                ? "border-violet-400/40 bg-violet-500/15 shadow-lg shadow-violet-950/20"
                : "border-white/10 bg-slate-950/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition ${
                  pagoRegistrado
                    ? "border-violet-400 bg-violet-500 text-white"
                    : "border-white/20 bg-transparent"
                }`}
              >
                {pagoRegistrado ? "✓" : ""}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-black ${pagoRegistrado ? "text-violet-300" : "text-slate-300"}`}>
                  💳 Pago registrado
                </p>
                <p className="text-[10px] text-slate-500">
                  {pagoRegistrado
                    ? `Uber depositó ${money(acumuladoSemana)} a tu cuenta`
                    : "Marca esto cuando Uber te deposite el saldo acumulado"}
                </p>
              </div>
            </div>
          </button>

          {/* Input manual solo si NO está registrado como pago */}
          {!pagoRegistrado ? (
            <div className="mt-2.5">
              <Field label="Depósito recibido" hint="Si te depositaron algo, ponlo aquí">
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  className={inputClass}
                  value={form.retiro}
                  onChange={(e) => set("retiro")(e.target.value)}
                />
              </Field>
            </div>
          ) : null}
        </div>

        {/* Desglose visual del cálculo */}
        {autoEfectivo ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Ganancia del día (Uber)</span>
                <span className="font-bold tabular-nums text-white">{money(preview.totalUber)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Saldo ayer → hoy</span>
                <span className="tabular-nums text-cyan-300">
                  {money(saldoPrevio)} → {money(preview.saldoAcumulado)}
                </span>
              </div>
              {retiroEfectivo > 0 ? (
                <div className="flex justify-between text-slate-400">
                  <span>{pagoRegistrado ? "💳 Pago registrado" : "Depósito recibido"}</span>
                  <span className="tabular-nums text-violet-300">{money(retiroEfectivo)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-white/10 pt-2 text-slate-300">
                <span>Fue al saldo hoy</span>
                <span className="font-bold tabular-nums text-cyan-300">{money(preview.deltaSaldo)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Efectivo que te quedaste</span>
                <span className="text-sm font-black tabular-nums text-emerald-400">
                  {money(preview.efectivo)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            <Field label="Efectivo que te quedaste">
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                className={inputClass}
                value={form.efectivoManual}
                onChange={(e) => set("efectivoManual")(e.target.value)}
              />
            </Field>
          </div>
        )}

        <label className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={autoEfectivo}
            onChange={(e) => setAutoEfectivo(e.target.checked)}
            className="h-3.5 w-3.5 accent-emerald-400"
          />
          Calcular efectivo automáticamente
        </label>
      </div>

      {/* ── Extras ── */}
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Otros gastos" hint="Casetas…">
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            className={inputClass}
            value={form.otrosGastos}
            onChange={(e) => set("otrosGastos")(e.target.value)}
          />
        </Field>
        <Field label="Notas">
          <input
            type="text"
            placeholder="Opcional"
            className={inputClass}
            value={form.notas}
            onChange={(e) => set("notas")(e.target.value)}
          />
        </Field>
      </div>

      {/* ── Vista previa compacta ── */}
      <div className="grid grid-cols-4 gap-2">
        <PrevMini label="Km" value={`${num(preview.km, 0)}`} />
        <PrevMini label="Litros" value={`${num(preview.litros, 1)}`} />
        <PrevMini label="Gas" value={money(preview.costoGasolina)} />
        <PrevMini
          label="Neta"
          value={money(preview.gananciaNeta)}
          accent={preview.gananciaNeta >= 0 ? "text-emerald-400" : "text-rose-400"}
        />
      </div>

      {/* ── Estado / Errores ── */}
      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      ) : null}
      {exito ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          ✅ Jornada guardada correctamente
        </p>
      ) : null}

      <button
        type="submit"
        disabled={guardando}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition active:scale-[0.98] disabled:opacity-50"
      >
        {guardando
          ? "Guardando…"
          : editando
            ? "Actualizar jornada"
            : "Guardar jornada"}
      </button>
    </form>
  );
}

function PrevMini({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950/50 px-2 py-1.5 text-center">
      <p className="text-[9px] uppercase text-slate-500">{label}</p>
      <p className={`text-xs font-bold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}
