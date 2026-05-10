# Plan de corrección — APP_MOVIL_SENTINEL_FACE

> Instrucciones para el agente: aplica los pasos en el orden exacto indicado. Cada paso especifica el archivo, la ubicación exacta y el código resultante. Los pasos 1, 2 y 3 dependen de que el backend ya haya sido corregido con su plan correspondiente. No crees archivos nuevos, solo modifica los existentes salvo donde se indique eliminar.

---

## Paso 1 — `store/authStore.ts` — eliminar escrituras redundantes en SecureStore

**Problema:** el token se escribe tres veces en SecureStore: manualmente en `login()`, automáticamente por el middleware `persist`, y nuevamente en `onRehydrateStorage`. Genera race conditions y escrituras innecesarias.

**Localiza** la función `login` dentro del store. Elimina únicamente la línea de escritura manual:

```typescript
// ELIMINAR esta línea de login():
await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
```

El bloque `login` resultante debe quedar así:

```typescript
login: async (email, password) => {
  const { data } = await api.login(email, password);
  if (!data.success) throw new Error("Credenciales inválidas.");

  const user: AuthUser = {
    id:    String(data.usuario_id),
    name:  data.name,
    email: data.email,
    roles: data.roles ?? [],
  };

  set({ token: data.access_token, user, isAuthenticated: true });
},
```

**Localiza** `onRehydrateStorage`. Elimina la línea de re-escritura del token en el bloque `else`:

```typescript
// ELIMINAR esta línea dentro del else de onRehydrateStorage:
SecureStore.setItemAsync(TOKEN_KEY, state.token).catch(() => {});
```

El bloque `onRehydrateStorage` resultante debe quedar así:

```typescript
onRehydrateStorage: () => (state) => {
  if (state?.token) {
    if (isTokenExpired(state.token)) {
      SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      useAuthStore.setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } else {
      useAuthStore.setState({
        isAuthenticated: !!state.user,
        isLoading: false,
      });
    }
  } else {
    useAuthStore.setState({ isLoading: false });
  }
},
```

---

## Paso 2 — `services/api.ts` — corregir `deactivateEmployee`

**Problema:** `deactivateEmployee` llama a `PATCH /employees/:id/deactivate` que no existía en el backend. Ahora que el backend fue corregido (Paso 3 del plan de backend), el endpoint existe. Verificar que el método en `api.ts` coincida exactamente con lo que el backend espera.

**Localiza** la línea de `deactivateEmployee` en el objeto `api`:

```typescript
// VERIFICAR que quede exactamente así (no cambiar si ya está así):
deactivateEmployee: (id: number, usuarioId: number | string) =>
  client.patch(`/employees/${id}/deactivate`, { usuario_id: usuarioId }),
```

Si está diferente, corregirla a esa forma. El backend ahora acepta `PATCH /employees/:id/deactivate` con body `{ usuario_id }`.

---

## Paso 3 — `app/(admin)/register.tsx` — corregir FormData keys

**Problema:** el formulario manda `full_name` y `photo` pero el backend (después de su corrección) espera esos mismos nombres. Verificar que el FormData use exactamente los nombres correctos.

**Localiza** la función `handleRegister` en `app/(admin)/register.tsx`. Encuentra el bloque de construcción del FormData:

```typescript
// VERIFICAR que quede exactamente así:
const formData = new FormData();
formData.append("full_name", name.trim());
formData.append("document_id", documentId.trim() || "Sin documento");
formData.append("usuario_id", user?.id ?? "");
formData.append("photo", {
  uri: photoUri,
  name: `employee_${Date.now()}.jpg`,
  type: "image/jpeg",
} as any);
```

Si actualmente tiene `"name"` en lugar de `"full_name"`, o `"image"` en lugar de `"photo"`, corrígelo a los valores mostrados arriba. El backend fue corregido para leer estos mismos nombres.

---

## Paso 4 — `app/(admin)/gallery.tsx` — eliminar `item.snapshot_color`

**Problema:** `snapshot_color` no es un campo que retorne el backend. Los tiles de la galería muestran fondo transparente porque el campo siempre es `undefined`.

**Localiza** el componente `SnapshotTile` en `app/(admin)/gallery.tsx`.

Encuentra estas líneas al inicio del componente donde se calculan las variables:

```typescript
const ok    = item.access_result === "GRANTED";
const spoof = item.liveness === "SPOOFING";
const color = ok
  ? Colors.Status.success
  : spoof
    ? Colors.Status.warning
    : Colors.Status.error;
```

Agrega debajo de esas líneas la variable `tileBackground`:

```typescript
const tileBackground = ok
  ? "rgba(0, 180, 80, 0.15)"
  : spoof
    ? "rgba(220, 160, 0, 0.15)"
    : "rgba(220, 50, 50, 0.15)";
```

Luego **localiza** la línea que usa `snapshot_color` en el JSX del componente:

```typescript
// ANTES
style={[styles.tileInner, { backgroundColor: item.snapshot_color }]}
```

```typescript
// DESPUÉS
style={[styles.tileInner, { backgroundColor: tileBackground }]}
```

No toques ninguna otra parte del componente.

---

## Paso 5 — `app/(admin)/alerts.tsx` — corregir filtro "Resueltas"

**Problema:** la carga inicial trae solo alertas con `resolved=0`. El filtro "Resueltas" filtra localmente `a.resolved === true`, que nunca es verdadero porque el servidor ya las filtró. La pestaña "Resueltas" siempre está vacía.

**Solución:** al hacer clic en el filtro "Resueltas", hacer una request con `resolved=1` al servidor y almacenar ambos conjuntos por separado.

**Localiza** los estados al inicio del componente `AlertsScreen`:

```typescript
const [alerts,  setAlerts]  = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [filter,  setFilter]  = useState<FilterKey>("all");
```

Reemplázalos por:

```typescript
const [activeAlerts,   setActiveAlerts]   = useState<any[]>([]);
const [resolvedAlerts, setResolvedAlerts] = useState<any[]>([]);
const [loading,        setLoading]        = useState(true);
const [filter,         setFilter]         = useState<FilterKey>("all");
```

**Localiza** el `useEffect` que carga las alertas:

```typescript
// ANTES
useEffect(() => {
  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts();
      setAlerts(res.data.alerts ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  loadAlerts();
}, []);
```

```typescript
// DESPUÉS
useEffect(() => {
  const loadAlerts = async () => {
    try {
      const [activeRes, resolvedRes] = await Promise.all([
        api.getAlerts(0),
        api.getAlerts(1),
      ]);
      setActiveAlerts(activeRes.data.alerts ?? []);
      setResolvedAlerts(resolvedRes.data.alerts ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  loadAlerts();
}, []);
```

**Localiza** la variable `alerts` que se usa para calcular `displayed` y `unread`:

```typescript
// ANTES
const displayed = alerts.filter((a) => {
  if (filter === "resolved") return a.resolved;
  if (filter === "all") return !a.resolved;
  return !a.resolved && a.alert_type === filter;
});

const unread = alerts.filter((a) => !a.resolved).length;
```

```typescript
// DESPUÉS
const displayed =
  filter === "resolved"
    ? resolvedAlerts
    : filter === "all"
      ? activeAlerts
      : activeAlerts.filter((a) => a.alert_type === filter);

const unread = activeAlerts.length;
```

**Localiza** la función `resolveAlert` que actualiza el estado local tras resolver una alerta:

```typescript
// ANTES
const resolveAlert = async (alert_id: number) => {
  try {
    await api.resolveAlert(alert_id, user?.id ?? "");
    setAlerts((prev) =>
      prev.map((a) =>
        a.alert_id === alert_id
          ? { ...a, resolved: true, resolved_by: user?.name }
          : a,
      ),
    );
  } catch (error) {
    console.error(error);
  }
};
```

```typescript
// DESPUÉS
const resolveAlert = async (alert_id: number) => {
  try {
    await api.resolveAlert(alert_id, user?.id ?? "");
    const resolved = activeAlerts.find((a) => a.alert_id === alert_id);
    if (resolved) {
      setActiveAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
      setResolvedAlerts((prev) => [
        { ...resolved, resolved: true, resolved_by: user?.name },
        ...prev,
      ]);
    }
  } catch (error) {
    console.error(error);
  }
};
```

---

## Paso 6 — Eliminar el directorio `app/(tabs)/` completo

**Problema:** el grupo `(tabs)` contiene 5 pantallas de una versión anterior de la app. El layout solo redirige a `/(admin)/dashboard`. Los archivos son código muerto que aumenta el bundle y confunde la navegación.

**Elimina** los siguientes archivos:

```
app/(tabs)/_layout.tsx
app/(tabs)/alerts.tsx
app/(tabs)/history.tsx
app/(tabs)/home.tsx
app/(tabs)/profile.tsx
app/(tabs)/scan.tsx
```

Después de eliminarlos, elimina también el directorio `app/(tabs)/` si queda vacío.

---

## Paso 7 — `app/_layout.tsx` — eliminar el Stack.Screen de `(tabs)`

**Problema:** el root layout registra el grupo `(tabs)` como una pantalla del Stack, pero ese grupo ya no existe.

**Localiza** el componente `RootNavigator` en `app/_layout.tsx`. Encuentra y elimina esta línea:

```typescript
// ELIMINAR esta línea:
<Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
```

El bloque `Stack` resultante debe quedar así:

```typescript
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
  <Stack.Screen name="+not-found" />
</Stack>
```

---

## Verificación final

Después de aplicar todos los pasos, verificar los siguientes flujos en la app:

**Autenticación:**
- Login con credenciales correctas → redirige a dashboard ✓
- Login con credenciales incorrectas → muestra mensaje de error ✓
- Cerrar app y reabrir con sesión activa → va directo al dashboard sin flash de login ✓
- Token expirado → interceptor hace refresh o ejecuta logout ✓

**Dashboard:**
- Las tarjetas de actividad reciente muestran el nombre real del empleado (no "Desconocido") ✓
- Los contadores de activos, accesos y alertas muestran números reales ✓

**Galería:**
- Los tiles muestran fondo de color según resultado (verde/rojo/amarillo) ✓
- Los filtros (Todos, Accesos, Denegados, Spoofing) funcionan correctamente ✓

**Usuarios:**
- El botón de registro navega a la pantalla de registro ✓
- El formulario de registro sube la foto y crea el empleado exitosamente ✓
- El botón de desactivar muestra el Alert de confirmación ✓
- Al confirmar desactivación, el empleado pasa a inactivo sin recarga completa ✓

**Alertas:**
- La pestaña "Todas" muestra alertas no resueltas ✓
- La pestaña "Resueltas" muestra alertas ya resueltas (ya no vacía) ✓
- Marcar como resuelta mueve la alerta de "Todas" a "Resueltas" sin recargar ✓

**Navegación:**
- No existen rutas `/(tabs)/*` accesibles ✓
- Deep links a rutas inexistentes caen en `+not-found` ✓
