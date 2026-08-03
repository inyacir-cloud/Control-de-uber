"use client";

import type { ReactNode } from "react";

export type NavItem = { id: string; label: string; icon: ReactNode };

export default function BottomNav({
  items,
  active,
  onChange,
}: {
  items: NavItem[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-50 px-4 pb-3 sm:hidden">
      <div className="mx-auto flex max-w-md items-center gap-1 rounded-[28px] border border-white/15 bg-slate-950/80 p-1.5 shadow-2xl shadow-black/45 backdrop-blur-2xl ring-1 ring-white/[0.04]">
        {items.map((t) => {
          const isOn = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 overflow-hidden rounded-3xl px-1 py-2.5 text-[10px] font-black transition active:scale-[0.97] ${
                isOn
                  ? "bg-gradient-to-br from-emerald-400 to-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30"
                  : "text-slate-500 active:bg-white/10 active:text-slate-200"
              }`}
            >
              <span className="relative z-10">{t.icon}</span>
              <span className="relative z-10 max-w-[72px] truncate">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
