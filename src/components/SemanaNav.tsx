"use client";

import type { Semana } from "@/lib/calc";

export default function SemanaNav({
  semanas,
  activa,
  onChange,
}: {
  semanas: Semana[];
  activa: string;
  onChange: (key: string) => void;
}) {
  if (semanas.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 text-center text-sm text-slate-400 backdrop-blur-xl">
        No hay datos registrados aún.
      </div>
    );
  }

  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {semanas.map((s) => {
          const on = s.key === activa;
          return (
            <button
              key={s.key}
              onClick={() => onChange(s.key)}
              className={`group shrink-0 rounded-2xl border px-3.5 py-2.5 text-left text-xs font-black transition active:scale-[0.98] ${
                on
                  ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-950/30"
                  : "border-white/10 bg-white/[0.06] text-slate-400 backdrop-blur-xl active:bg-white/[0.1]"
              }`}
            >
              <span className="block text-[9px] uppercase tracking-[0.18em] opacity-60">
                Semana
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
