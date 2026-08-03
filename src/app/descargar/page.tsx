import InstallAppButton from "@/components/InstallAppButton";

export default function DescargarPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <p className="text-4xl">🚕</p>
          <h1 className="mt-3 text-3xl font-black text-white">
            Descargar Control Uber
          </h1>
          <p className="mt-2 text-slate-400">
            Tu registro personal de ingresos, gasolina y kilometraje
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <div className="flex gap-3">
            <span className="text-3xl">✅</span>
            <div className="flex-1">
              <h2 className="text-xl font-black text-emerald-400">
                Instalar como app (recomendado)
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Instálala como una app en tu teléfono sin usar Play Store y sin
                perder tus funciones.
              </p>

              <div className="mt-4">
                <InstallAppButton className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition active:scale-95" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    <span>🤖</span> Android
                  </p>
                  <ol className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>1. Toca el menú <b>⋮</b> del navegador</li>
                    <li>2. Selecciona <b>“Instalar app”</b></li>
                    <li>3. Confirma y abre Control Uber desde tu pantalla de inicio</li>
                  </ol>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    <span>🍎</span> iPhone
                  </p>
                  <ol className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>1. Abre la página en Safari</li>
                    <li>2. Toca <b>Compartir</b></li>
                    <li>3. Selecciona <b>“Agregar a pantalla de inicio”</b></li>
                  </ol>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    <span>🖥️</span> Windows, Mac o Linux
                  </p>
                  <ol className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>1. Abre la app en Chrome o Edge</li>
                    <li>2. Haz clic en el icono de instalación</li>
                    <li>3. Confirma para abrirla como aplicación</li>
                  </ol>
                </div>
              </div>

              <p className="mt-3 rounded-lg bg-emerald-500/20 px-3 py-2 text-xs text-emerald-300">
                ✨ Funciona sin barras del navegador, es rápida y se actualiza
                automáticamente.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-cyan-400">
            <span>🚕</span> Incluye todo el control Uber
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>• Registro diario de ganancias de Uber</li>
            <li>• Cálculo automático del efectivo</li>
            <li>• Seguimiento del saldo acumulado</li>
            <li>• Registro de depósitos semanales</li>
            <li>• Kilometraje inicial y final por día</li>
            <li>• Litros, rendimiento y gasto de gasolina diario</li>
            <li>• Ganancia neta, ganancia por km y por litro</li>
            <li>• Resumen semanal, pagos y métricas</li>
            <li>• Historial editable de jornadas</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-lg font-black text-white">📄 Instrucciones</h2>
          <p className="mt-2 text-sm text-slate-300">
            Descarga una guía rápida para instalar Control Uber.
          </p>
          <a
            href="/api/download?tipo=instrucciones"
            download="INSTRUCCIONES-CONTROL-UBER.txt"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition active:bg-emerald-400"
          >
            <span>⬇️</span> Descargar instrucciones
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-lg font-black text-white">🔐 Privacidad</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Tus registros de Uber se guardan en tu base de datos privada. La
            aplicación no utiliza servicios externos para analizar tus ingresos.
          </p>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition active:bg-white/10"
          >
            ← Volver al control Uber
          </a>
        </div>
      </div>
    </main>
  );
}
