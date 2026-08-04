"use client";

import { useEffect, useState } from "react";

export default function PwaMobileStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onControllerChange = () => {
      window.location.reload();
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);

    void (async () => {
      if (!("serviceWorker" in navigator)) return;

      try {
        const reg = await navigator.serviceWorker.register("/sw.js");

        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      } catch {
        // Si falla el SW, la app sigue funcionando en modo web normal.
      }
    })();

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  async function actualizarApp() {
    if (!("serviceWorker" in navigator)) {
      window.location.reload();
      return;
    }

    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
      setTimeout(() => window.location.reload(), 400);
      return;
    }

    window.location.reload();
  }

  if (!isOnline) {
    return (
      <div className="safe-top pointer-events-none fixed inset-x-0 top-0 z-[70] px-3 sm:px-4">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-400/45 bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-200 shadow-xl shadow-black/30 backdrop-blur-xl">
          Sin conexion. Los datos en linea pueden no estar disponibles.
        </div>
      </div>
    );
  }

  if (!updateAvailable) return null;

  return (
    <div className="safe-top pointer-events-none fixed inset-x-0 top-0 z-[70] px-3 sm:px-4">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-cyan-300/45 bg-cyan-400/15 px-3 py-2 text-xs text-cyan-100 shadow-xl shadow-black/30 backdrop-blur-xl">
        <p className="font-bold">Hay una actualizacion disponible.</p>
        <button
          type="button"
          onClick={() => {
            void actualizarApp();
          }}
          className="rounded-lg bg-cyan-300 px-2.5 py-1 text-[11px] font-black text-slate-950 active:scale-95"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
