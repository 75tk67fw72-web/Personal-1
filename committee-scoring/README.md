# CHMD · Herramienta de evaluación del Comité

Formulario de evaluación de candidatas (Daniela y Lila) con dashboard de resultados protegido por contraseña.
Funciona sin login: un solo link para celular o computadora.

**Archivos**
- `index.html`: la aplicación completa (formulario + dashboard).
- `supabase-setup.sql`: crea la base de datos y las reglas de seguridad.

**Contraseña de admin (pruebas):** `MaguenDavid-2026`

---

## Cómo funciona la seguridad

- Cada evaluador solo puede **enviar** su evaluación. Nadie puede leer las respuestas con el link público.
- Los resultados solo se entregan si la contraseña es correcta. **La revisa Supabase en su servidor**, así que la contraseña no aparece en el código de la página.
- Una sola respuesta por nombre (en la base de datos) y por dispositivo (localStorage).
- Para entrar al dashboard: link **"Committee admin"** al pie de la página, o agrega `#admin` al final de la URL.

---

## Paso 0: probarla sin configurar nada (5 minutos)

1. Descarga `index.html` y ábrelo con doble clic en tu navegador.
2. Verás un aviso naranja de **"Demo mode"**: las respuestas se guardan solo en ese navegador.
3. Llena 2 o 3 evaluaciones con nombres distintos. Después de cada envío, para simular a otra persona, abre la página en una ventana de incógnito.
4. Entra a "Committee admin" con `MaguenDavid-2026` para ver el dashboard.

---

## Paso 1: crear la base de datos en Supabase (10 minutos, gratis)

1. Entra a <https://supabase.com> → **Start your project** → crea una cuenta (puedes usar GitHub o correo).
2. **New project**:
   - Name: `chmd-comite`
   - Database password: genera una y guárdala (no la vas a necesitar para la app).
   - Region: la más cercana (p. ej. *East US* o *West US*).
   - Clic en **Create new project** y espera ~2 minutos.
3. Menú izquierdo → **SQL Editor** → **New query**.
4. Abre `supabase-setup.sql`, copia **todo** el contenido, pégalo y da clic en **Run**. Debe decir *"Success. No rows returned"*.
5. Menú izquierdo → **Project Settings** (engrane) → **API** (o *Data API* / *API Keys*). Copia dos datos:
   - **Project URL** (algo como `https://abcd1234.supabase.co`)
   - **anon public key** (una cadena larga que empieza con `eyJ...`, o una *publishable key* `sb_publishable_...`)

> La *anon key* es pública por diseño. **Nunca** uses la *service_role key* / *secret key* en la página.

## Paso 2: conectar la página a Supabase (2 minutos)

1. Abre `index.html` con un editor de texto (Bloc de notas, TextEdit en modo texto sin formato, o VS Code).
2. Busca el bloque `CONFIGURATION` cerca del inicio del `<script>` y reemplaza:

   ```js
   SUPABASE_URL: "https://abcd1234.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGciOi...tu-llave-completa...",
   ```
3. Guarda. Al abrir la página ya **no** debe aparecer el aviso naranja de "Demo mode".

## Paso 3: publicarla en internet (3 minutos, gratis)

**Opción recomendada: Netlify Drop (sin cuenta técnica)**
1. Crea una carpeta en tu computadora que contenga solo `index.html`.
2. Entra a <https://app.netlify.com/drop> y arrastra la carpeta a la página.
3. Netlify te da un link tipo `https://nombre-aleatorio.netlify.app`. Crea una cuenta gratuita para que el sitio no expire y, si quieres, cambia el nombre en *Site configuration → Change site name* (p. ej. `chmd-comite.netlify.app`).
4. Para actualizar la página después: *Deploys* → arrastra de nuevo la carpeta.

**Alternativa: GitHub Pages** (este repositorio) → *Settings → Pages → Deploy from branch* → rama y carpeta raíz. El link será `https://<usuario>.github.io/<repo>/committee-scoring/`.

## Paso 4: prueba final antes de mandarlo al comité

1. Abre el link en tu celular, llena una evaluación de prueba con el nombre `PRUEBA`.
2. Entra a `#admin` con la contraseña y confirma que aparece.
3. En la tarjeta de `PRUEBA`, usa **Delete this response** para borrarla.
4. Manda el link al comité. **No compartas** la contraseña ni el link con `#admin`.

---

## Cambios frecuentes

| Qué quieres cambiar | Dónde |
|---|---|
| Contraseña de admin | `supabase-setup.sql`, línea marcada `ADMIN PASSWORD` → vuelve a correr el archivo completo en SQL Editor. (En modo demo: `DEMO_ADMIN_PASSWORD` en `index.html`.) |
| Descripciones de criterios | `index.html` → lista `CRITERIA`, campo `desc`. |
| Pesos | `index.html` → lista `CRITERIA`, campo `weight` (deben sumar 100). |
| Preguntas de comparación | `index.html` → lista `QUESTIONS`. |
| Borrar todo al cerrar el proceso | Supabase → SQL Editor → `delete from public.evaluations;` |

Cambia descripciones y pesos **antes** de que el comité empiece a responder: el dashboard recalcula con los pesos actuales.

## Qué muestra el dashboard

- Puntaje ponderado total por candidata (sobre 5) y número de votos finales.
- Preferencia final: Daniela vs Lila.
- Por criterio: promedio de cada candidata y quién tiene ventaja (★ = criterio de mayor peso).
- Preguntas de comparación: conteo y % por pregunta.
- Respuestas individuales desplegables (puntajes, notas, comparaciones y razonamiento final). La etiqueta **"≠ scores"** marca a quien eligió una candidata distinta a la que salió mejor en sus propios puntajes: conviene conversarlo en la sesión.
- **Export CSV** para archivo o para abrir en Excel.

## Solución de problemas

- **"Could not submit… Server error (401/404)"**: la URL o la llave de Supabase están mal copiadas, o no corriste el SQL.
- **"Incorrect password"** con la contraseña correcta: revisa que corriste la versión más reciente del SQL (paso 1.4).
- **Un evaluador dice que ya envió pero no aparece**: pídele que lo haga desde el mismo dispositivo; si el mensaje es "already been submitted", su respuesta sí está guardada.
- **Alguien necesita volver a responder**: bórralo desde el dashboard y pídele que abra la página en otro navegador o en modo incógnito.
