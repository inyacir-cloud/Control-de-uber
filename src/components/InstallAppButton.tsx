"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallAppButtonProps = {
  className?: string;
  compact?: boolean;
};

export default function InstallAppButton({
  className,
  compact = false,
}: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsStandalone(standalone);

    const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    setShowIosHelp(isIOS && !standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const label = useMemo(() => {
    if (isStandalone) return "App instalada";
    if (deferredPrompt) return "Instalar app";
    if (showIosHelp) return "Cómo instalar en iPhone";
    return "Instalar app";
  }, [deferredPrompt, isStandalone, showIosHelp]);

  async function onInstallClick() {
    if (isStandalone) return;

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome !== "accepted") {
        setDeferredPrompt(null);
      }
      return;
    }

    if (showIosHelp) {
      alert("En iPhone: Safari > Compartir > Agregar a pantalla de inicio");
      return;
    }

    alert("Si no aparece el botón, usa el menú del navegador y toca 'Instalar app'.");
  }

  if (isStandalone) return null;

  return (
    <button
      onClick={() => {
        void onInstallClick();
      }}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition active:scale-95"
      }
      type="button"
      title={label}
      aria-label={label}
    >
      <span>{compact ? "📲" : "📲 Instalar app"}</span>
    </button>
  );
}
