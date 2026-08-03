# 📱 Guía Completa de Descarga - Mis Ingresos Uber

## 🚀 Opción Recomendada: Instalar como PWA (90 segundos)

La forma **más rápida y fácil** es instalarla como Progressive Web App. Funciona igual que una app nativa.

### En Android (Chrome, Firefox, Edge, Opera):
```
1. Abre tu navegador con la app
2. Toca el menú ⋮ (tres puntos, arriba a la derecha)
3. Selecciona "Instalar app" o "Agregar a pantalla de inicio"
4. Confirma
5. ¡Listo! Aparece en tu pantalla de inicio como app normal
```

### En iPhone (Safari):
```
1. Abre Safari con la app
2. Toca el botón Compartir (cuadro con flecha hacia arriba)
3. Desliza hasta "Agregar a la pantalla de inicio"
4. Toca "Agregar"
5. ¡Listo! Aparece en la pantalla de inicio
```

### En Escritorio (Windows/Mac/Linux):
```
1. Abre la app en Chrome, Firefox o Edge
2. Haz clic en el icono de instalación (⬇️ arriba a la derecha)
3. Confirma la instalación
4. ¡Listo! Se abre como app independiente
```

## 📦 Opción 2: APK Nativo para Android

Si prefieres un APK tradicional que no dependa del navegador:

### Requisitos:
- Android Studio instalado (`https://developer.android.com/studio`)
- JDK 17+ (`https://www.oracle.com/java/technologies/javase/jdk17-archive.html`)
- ~10 GB de espacio en disco

### Compilar:
```bash
# Desde la carpeta del proyecto:
./scripts/build-apk.sh

# O manualmente:
npm run cap:add:android
npm run cap:build
npm run cap:open
```

Android Studio se abrirá. Luego:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Espera (2-5 minutos)
3. Copia el APK a tu teléfono y instala

## ✨ Ventajas de la PWA vs APK

### PWA (Recomendado)
- ✅ Instalación instantánea (sin Android Studio)
- ✅ Funciona en iOS, Android, PC, Mac
- ✅ Actualizaciones automáticas
- ✅ Sin aprobación de Google Play
- ✅ Offline + sync automático
- ✅ ~2 MB total

### APK Nativo
- ✅ Aparece en Ajustes → Aplicaciones como app normal
- ✅ Acceso a APIs nativas (si las agregamos después)
- ❌ Requiere Android Studio
- ❌ No funciona en iPhone ni escritorio
- ❌ Actualizaciones manuales

## 🔐 Privacidad & Seguridad

✓ **Tus datos nunca salen de tu teléfono**
- Se almacenan en tu PostgreSQL privada
- La app solo sincroniza con tu servidor
- No hay rastreo ni analíticas

✓ **Funciona sin conexión**
- Los datos se cachean localmente
- Puedes trabajar sin internet
- Se sincroniza cuando vuelva la conexión

✓ **No hay datos en la nube** (a menos que lo hagas)
- Control total sobre dónde se guardan tus datos

## 🎯 Características de la App

### 🚕 Sección Uber
- Registra jornadas diarias (km, gasolina, ingresos)
- Calcula automáticamente: efectivo, saldo, ganancia
- Ve gasto de gasolina diario y promedio
- Historial completo con filtros

### 💰 Sección Finanzas
- Define monto semanal y esquema 50/30/20 (editable)
- Bloquea categorías con 🔒 para que no cambien
- Registra cada gasto (sobres: Gastos, Deudas, Disponible)
- Ve cuánto te queda en cada sobre
- Atajos rápidos (Súper, Renta, Tarjeta…)
- Historial de presupuestos

## 📊 Datos Sincronizados Entre Secciones

- El **presupuesto de Finanzas** sugiere usar lo ganado en Uber
- Los **movimientos** se restan automáticamente del sobre asignado
- **Sobres inteligentes**: Te avisan si te pasas

## 🆘 Solucionar Problemas

### La app no se instala
```
Android: Abre en Chrome en lugar de Firefox
iPhone: Asegúrate de usar Safari, no Chrome
Escritorio: Intenta otro navegador (Chrome, Edge)
```

### Datos no sincronizan
```
1. Verifica que tienes conexión a internet
2. Recarga la página (Ctrl+R o Cmd+R)
3. Limpia cache: Ajustes → Aplicaciones → [Tu App] → Almacenamiento
```

### Errores de conexión a BD
```
1. Asegúrate que tu servidor PostgreSQL está activo
2. Verifica la URL de conexión en .env
3. Revisa los logs del servidor: tail -f /var/log/app.log
```

### La app funciona pero muy lenta
```
1. Limpia el cache del navegador (Ctrl+Shift+Del)
2. Desinstala y reinstala la app
3. Revisa si tienes mucha información (meses de datos)
```

## 📚 Documentación Completa

- **Guía de Finanzas**: `/descargar` (en la app)
- **API Reference**: `GET /api/jornadas`, `POST /api/finanzas/movimientos`
- **Configuración**: `.env.local` (copia de `.env`)

## 💬 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12 → Console)
2. Intenta en incógnito/privado
3. Limpia datos: Ajustes → Aplicaciones → [Tu App] → Almacenamiento → Borrar datos

## 🎉 Listo para Usar

Una vez instalada:
- ✅ Registra tu primer día de Uber
- ✅ Define tu presupuesto semanal
- ✅ Empieza a registrar gastos
- ✅ Mira tus estadísticas en tiempo real

¡Que disfrutes la app! 🚀
