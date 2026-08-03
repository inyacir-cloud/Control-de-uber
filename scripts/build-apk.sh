#!/bin/bash
set -e

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║        MIS INGRESOS UBER - COMPILADOR DE APK                      ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si Android SDK está instalado
if [ -z "$ANDROID_SDK_ROOT" ]; then
  echo "⚠️  ANDROID_SDK_ROOT no está configurado."
  echo ""
  echo "Para compilar el APK necesitas:"
  echo "1. Android Studio (https://developer.android.com/studio)"
  echo "2. JDK 17+ (https://www.oracle.com/java/technologies/javase/jdk17-archive.html)"
  echo ""
  echo "Alternativa (RECOMENDADA): Usa la app como PWA"
  echo "Visita: tu-app-url/descargar"
  echo ""
  exit 1
fi

echo "✓ Android SDK encontrado"
echo ""

# Pasos
echo "Pasos:"
echo "1. Construyendo app Next.js..."
npm run build

echo ""
echo "2. Inicializando Capacitor Android..."
npm run cap:add:android 2>/dev/null || echo "ℹ️ Android ya inicializado"

echo ""
echo "3. Sincronizando archivos con Android..."
npm run cap:sync

echo ""
echo "4. Abriendo Android Studio..."
npm run cap:open

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                    ¡LISTO!                                         ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "Android Studio se abrió con el proyecto. Para compilar el APK:"
echo ""
echo "1. Haz clic en: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "2. Espera a que compile (puede tardar 2-5 minutos)"
echo "3. Cuando termine, haz clic en «Locate» para abrir la carpeta"
echo "4. Busca el archivo .apk y cópialo a tu teléfono"
echo ""
echo "💡 TIP: Si prefieres no compilar un APK, simplemente instala la app"
echo "    como PWA desde tu navegador (más fácil y sin requiere Android Studio)"
echo ""
