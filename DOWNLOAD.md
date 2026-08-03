# 📱 Descargar la App - Mis Ingresos Uber

## Opción 1: Instalar como App Web (Recomendado - Funciona en Android, iPhone, Escritorio)

### En Android (Chrome, Firefox, Edge):
1. Abre la app en tu navegador
2. Toca el **menú ⋮** (3 puntos arriba a la derecha)
3. Selecciona **"Instalar app"** o **"Agregar a pantalla de inicio"**
4. La app aparecerá en tu pantalla de inicio y se ejecutará como app nativa

### En iPhone (Safari):
1. Abre la app en Safari
2. Toca el botón **Compartir** (cuadro con flecha)
3. Selecciona **"Agregar a la pantalla de inicio"**
4. Elige el nombre y confirma

### En Escritorio (Chrome, Edge, Firefox):
1. Abre la app en tu navegador
2. Haz clic en el **icono de instalación** (arriba a la derecha)
3. Confirma la instalación

---

## Opción 2: APK Nativo para Android

Si prefieres un APK tradicional (requiere Android Studio y Java instalados):

```bash
npm run cap:add:android
npm run cap:build
npm run cap:open
# Se abrirá Android Studio para compilar el APK
```

---

## ✨ Características de la App Instalada

- ✅ Funciona sin conexión (datos cacheados)
- ✅ Acceso desde la pantalla de inicio
- ✅ Sin barras del navegador (interfaz limpia)
- ✅ Actualizaciones automáticas
- ✅ Sincronización cuando vuelve la conexión

---

## Requisitos para que Funcione

1. **Conexión a internet** para sincronizar datos con tu servidor
2. **Navegador moderno** (Chrome 88+, Firefox 87+, Safari 14+, Edge 88+)
3. **Almacenamiento**: ~50 MB de espacio disponible

---

## 🔐 Privacidad

- Todos tus datos se almacenan en tu **base de datos PostgreSQL local**
- La app **NO** envía información a servidores externos
- Los datos se cachenan localmente en el dispositivo para acceso offline

---

## 📧 Soporte

Si tienes problemas:
1. Limpia el cache: Ajustes → Aplicaciones → [Tu App] → Almacenamiento → Borrar datos
2. Asegúrate de que la conexión a tu servidor está activa
3. Revisa la consola del navegador (F12) para mensajes de error

---

## 🚀 Actualizar la App

La app se actualiza automáticamente cada vez que visitas la web. Para forzar actualización:
- **Android**: Desliza hacia abajo para refrescar
- **iPhone**: Desliza hacia abajo para refrescar
- **Escritorio**: Presiona `Ctrl+R` o `Cmd+R`
