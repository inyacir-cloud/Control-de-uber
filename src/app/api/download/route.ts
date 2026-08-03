import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") ?? "instrucciones";

  if (tipo === "instrucciones") {
    const txt = `
╔═══════════════════════════════════════════════════════════════════╗
║           MIS INGRESOS UBER - GUÍA DE INSTALACIÓN                ║
╚═══════════════════════════════════════════════════════════════════╝

📱 OPCIÓN 1: INSTALAR COMO APP WEB (RECOMENDADO)
═══════════════════════════════════════════════════════════════════

En Android (Chrome, Firefox, Edge, Opera):
─────────────────────────────────────────────────────────────────
1. Abre la app en tu navegador
2. Toca el menú ⋮ (3 puntos arriba a la derecha)
3. Selecciona "Instalar app" o "Agregar a pantalla de inicio"
4. ¡Listo! La app aparecer en tu pantalla de inicio

En iPhone (Safari):
─────────────────────────────────────────────────────────────────
1. Abre la app en Safari
2. Toca Compartir (cuadro con flecha)
3. Selecciona "Agregar a la pantalla de inicio"
4. Elige el nombre y confirma

En Escritorio (Chrome, Firefox, Edge):
─────────────────────────────────────────────────────────────────
1. Abre la app en tu navegador
2. Haz clic en el icono de instalación (arriba a la derecha)
3. Confirma la instalación

✨ CARACTERÍSTICAS DE LA APP INSTALADA
═════════════════════════════════════════════════════════════════
✓ Funciona sin conexión (datos cacheados)
✓ Acceso desde la pantalla de inicio
✓ Sin barras del navegador (interfaz limpia)
✓ Actualizaciones automáticas
✓ Sincronización cuando vuelve la conexión

🔒 PRIVACIDAD
═════════════════════════════════════════════════════════════════
Todos tus datos se almacenan en tu base de datos local.
La app NO envía información a servidores externos.
Los datos se cachean localmente en el dispositivo.

📊 REQUISITOS
═════════════════════════════════════════════════════════════════
• Conexión a internet (para sincronizar)
• Navegador moderno (Chrome 88+, Firefox 87+, Safari 14+)
• ~50 MB de almacenamiento disponible

🆘 SOLUCIONAR PROBLEMAS
═════════════════════════════════════════════════════════════════
Si tienes problemas:

1. Limpia el cache:
   Ajustes → Aplicaciones → [Tu App] → Almacenamiento → Borrar datos

2. Asegúrate de que el servidor está activo

3. Revisa la consola del navegador (F12) para mensajes de error

4. Intenta desinstalar y reinstalar la app

📝 NOTA IMPORTANTE
═════════════════════════════════════════════════════════════════
Esta es una Progressive Web App (PWA). Es tan nativa y fluida como
una app descargada de Play Store, pero sin necesidad de aprobación
ni espacio en la tienda.

¿Necesitas ayuda? Contacta al soporte técnico.
    `.trim();

    return new NextResponse(txt, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="INSTRUCCIONES.txt"',
      },
    });
  }

  return NextResponse.json({ error: "Tipo no reconocido" }, { status: 400 });
}
