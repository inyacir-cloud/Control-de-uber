import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-white/12 bg-white/[0.08] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl ring-1 ring-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "green" | "amber" | "cyan" | "rose";
}) {
  const tones: Record<string, string> = {
    default: "text-white",
    green: "text-emerald-300",
    amber: "text-amber-300",
    cyan: "text-sky-300",
    rose: "text-rose-300",
  };
  const glows: Record<string, string> = {
    default: "from-white/12 to-white/5",
    green: "from-emerald-400/20 to-teal-400/5",
    amber: "from-amber-400/20 to-orange-400/5",
    cyan: "from-sky-400/20 to-cyan-400/5",
    rose: "from-rose-400/20 to-pink-400/5",
  };
  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${glows[tone]} p-4 shadow-lg shadow-black/20`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-black tabular-nums ${tones[tone]}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[10px] text-slate-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-sm font-semibold text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-cyan-300/10";
