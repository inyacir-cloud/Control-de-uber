"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  filtrarSemana,
  fechaToWeekKey,
  money,
  num,
  resumir,
  semanaActualKey,
  semanaRango,
  weekLabel,
  type JornadaCalculada,
  type Semana,
} from "@/lib/calc";
import BottomNav, { type NavItem } from "@/components/BottomNav";
import { IconBars, IconCard, IconHome } from "@/components/icons";
import JornadaForm from "@/components/JornadaForm";
import InstallAppButton from "@/components/InstallAppButton";
import PwaMobileStatus from "@/components/PwaMobileStatus";
import SemanaNav from "@/components/SemanaNav";
import TabDashboard from "@/components/TabDashboard";
import TabMetricas from "@/components/TabMetricas";
import TabPagos from "@/components/TabPagos";
import { Card } from "@/components/ui";

type TabUber = "inicio" | "pagos" | "metricas";

type JornadasResponse = {
  jornadas: JornadaCalculada[];
  ultimoKmFinal: number;
  ultimoSaldo: number;
  ultimoRendimiento: number;
  ultimoPrecio: number;
};

const NAV_UBER: NavItem[] = [
  { id: "inicio", label: "Inicio", icon: <IconHome /> },
  { id: "pagos", label: "Pagos", icon: <IconCard /> },
  { id: "metricas", label: "Métricas", icon: <IconBars /> },
];

export default function App() {
  const [tab, setTab] = useState<TabUber>("inicio");
  const [jornadasData, setJornadasData] = useState<JornadasResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [semanaActiva, setSemanaActiva] = useState<string>(semanaActualKey());
  const [editando, setEditando] = useState<JornadaCalculada | null>(null);
  const [showForm, setShowForm] = useState(false);

  const cargarJornadas = useCallback(async () => {
    const res = await fetch("/api/jornadas", { cache: "no-store" });
    const json = (await res.json()) as JornadasResponse;
    setJornadasData(json);
  }, []);

  useEffect(() => {
    void cargarJornadas().finally(() => setCargando(false));
  }, [cargarJornadas]);

  const jornadas = useMemo(() => jornadasData?.jornadas ?? [], [jornadasData]);

  const semanas = useMemo<Semana[]>(() => {
    const keys = new Set<string>([semanaActualKey()]);
    jornadas.forEach((j) => keys.add(fechaToWeekKey(j.fecha)));
    return [...keys]
      .sort((a, b) => b.localeCompare(a))
      .map((key) => ({ key, label: weekLabel(key), ...semanaRango(key) }));
  }, [jornadas]);

  useEffect(() => {
    if (semanas.length > 0 && !semanas.some((s) => s.key === semanaActiva)) {
      setSemanaActiva(semanas[0].key);
    }
  }, [semanas, semanaActiva]);

  const semanaUber = useMemo(
    () => filtrarSemana(jornadas, semanaActiva),
    [jornadas, semanaActiva],
  );
  const resumenSemana = useMemo(() => resumir(semanaUber), [semanaUber]);
  const resumenGlobal = useMemo(() => resumir(jornadas), [jornadas]);

  function editarJornada(jornada: JornadaCalculada) {
    setEditando(jornada);
    setShowForm(true);
    setTab("inicio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function borrarJornada(id: number) {
    if (!confirm("¿Eliminar esta jornada?")) return;
    await fetch(`/api/jornadas/${id}`, { method: "DELETE" });
    if (editando?.id === id) {
      setEditando(null);
      setShowForm(false);
    }
    await cargarJornadas();
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <PwaMobileStatus />
      <div className="pointer-events-none fixed left-1/2 top-4 h-44 w-44 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <header className="sticky top-0 z-40 px-3 pt-3 backdrop-blur-xl">
        <div className="mx-auto max-w-lg">
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-gradient-to-br from-white/[0.14] via-white/[0.08] to-white/[0.04] p-4 shadow-2xl shadow-black/30 ring-1 ring-white/[0.05]">
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 left-8 h-28 w-28 rounded-full bg-cyan-300/15 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/80">
                  Control personal
                </p>
                <h1 className="mt-1 text-xl font-black leading-tight text-white">
                  Mis Ingresos Uber
                </h1>
                <p className="mt-1 text-[11px] text-slate-400">
                  {resumenSemana.dias} día(s) · {num(resumenSemana.km, 0)} km · gas{" "}
                  {money(resumenSemana.costoGasolina)}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <InstallAppButton
                  compact
                  className="flex h-11 min-w-11 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/15 text-lg shadow-lg shadow-cyan-950/20 transition active:scale-95"
                />
                <button
                  onClick={() => {
                    setEditando(null);
                    setShowForm(!showForm);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-xl font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition active:scale-95"
                >
                  {showForm ? "×" : "+"}
                </button>
              </div>
            </div>

            <div className="relative mt-4 rounded-[22px] border border-white/10 bg-slate-950/40 p-1.5">
              <div className="rounded-[18px] bg-white px-3 py-2.5 text-center text-xs font-black text-slate-950 shadow-lg shadow-black/20">
                🚕 Control de Uber
              </div>
            </div>

            <div className="relative mt-3">
              <SemanaNav
                semanas={semanas}
                activa={semanaActiva}
                onChange={setSemanaActiva}
              />
            </div>
          </div>

          <div className="mt-2 hidden gap-2 sm:flex">
            {NAV_UBER.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as TabUber)}
                className={`flex-1 rounded-2xl border px-4 py-2.5 text-xs font-black transition ${
                  tab === item.id
                    ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.06] text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4">
        {showForm ? (
          <div className="mb-5">
            <Card>
              <JornadaForm
                jornadas={jornadas}
                editando={editando}
                defaults={{
                  ultimoKmFinal: jornadasData?.ultimoKmFinal ?? 0,
                  ultimoSaldo: jornadasData?.ultimoSaldo ?? 0,
                  ultimoRendimiento: jornadasData?.ultimoRendimiento ?? 0,
                  ultimoPrecio: jornadasData?.ultimoPrecio ?? 0,
                }}
                onSaved={async () => {
                  setEditando(null);
                  setShowForm(false);
                  await cargarJornadas();
                }}
                onCancel={() => {
                  setEditando(null);
                  setShowForm(false);
                }}
              />
            </Card>
          </div>
        ) : null}

        {cargando ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            <p className="text-sm text-slate-400">Cargando datos…</p>
          </div>
        ) : tab === "inicio" ? (
          <TabDashboard semana={semanaUber} resumen={resumenSemana} />
        ) : tab === "pagos" ? (
          <TabPagos
            semana={semanaUber}
            resumen={resumenSemana}
            onEditar={editarJornada}
            onBorrar={borrarJornada}
          />
        ) : (
          <TabMetricas semana={semanaUber} resumen={resumenSemana} />
        )}

        {!cargando && resumenGlobal.dias > 0 ? (
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Historial completo · {resumenGlobal.dias} días
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div>
                <p className="text-slate-500">Ganancia</p>
                <p className="font-black text-emerald-300 tabular-nums">
                  {money(resumenGlobal.gananciaNeta)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Kilómetros</p>
                <p className="font-black text-white tabular-nums">
                  {num(resumenGlobal.km, 0)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Saldo Uber</p>
                <p className="font-black text-cyan-300 tabular-nums">
                  {money(resumenGlobal.saldoActual)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <BottomNav
        items={NAV_UBER}
        active={tab}
        onChange={(next) => setTab(next as TabUber)}
      />
    </div>
  );
}
