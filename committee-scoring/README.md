# CHMD · Herramienta de evaluación del Comité

Versión digital del *Instrumento de Valoración Final* (sept. 2026): evaluación de candidatas (Daniela y Lila) con dashboard de resultados protegido por contraseña.
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
- Para entrar al dashboard: link **"Administración"** al pie de la página, o agrega `#admin` al final de la URL.

---

## Paso 0: probarla sin configurar nada (5 minutos)

1. Descarga `index.html` y ábrelo con doble clic en tu navegador.
2. Verás un aviso naranja de **"Modo demo"**: las respuestas se guardan solo en ese navegador.
3. Llena 2 o 3 evaluaciones con nombres distintos. Después de cada envío, para simular a otra persona, abre la página en una ventana de incógnito.
4. Entra a "Administración" con `MaguenDavid-2026` para ver el dashboard.

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
3. Guarda. Al abrir la página ya **no** debe aparecer el aviso naranja de "Modo demo".

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
3. En la tarjeta de `PRUEBA`, usa **Eliminar esta respuesta** para borrarla.
4. Manda el link al comité. **No compartas** la contraseña ni el link con `#admin`.

---

## Cambios frecuentes

| Qué quieres cambiar | Dónde |
|---|---|
| Contraseña de admin | `supabase-setup.sql`, línea marcada `ADMIN PASSWORD` → vuelve a correr el archivo completo en SQL Editor. (En modo demo: `DEMO_ADMIN_PASSWORD` en `index.html`.) |
| Descripciones de criterios (hoy: texto literal del Instrumento) | `index.html` → lista `CRITERIA`, campo `desc`. |
| Pesos | `index.html` → lista `CRITERIA`, campo `weight` (deben sumar 100). |
| Preguntas de comparación | `index.html` → lista `QUESTIONS`. |
| Borrar todo al cerrar el proceso | Supabase → SQL Editor → `delete from public.evaluations;` |

Cambia descripciones y pesos **antes** de que el comité empiece a responder: el dashboard recalcula con los pesos actuales.

## Reglas de llenado (ajustes del Comité)

- **Guía breve** visible en cada criterio; la guía completa del Instrumento queda en "Ver guía completa".
- **El evaluador no calcula nada**: la herramienta calcula el ponderado.
- **N/O – no observado / información insuficiente**: disponible en cada criterio y para cada candidata. Se excluye del cálculo individual y el ponderado se reescala sobre el peso efectivamente evaluado (p. ej., si se marca N/O en el criterio 4, el resto se calcula sobre 82%).
- **Evidencia escrita obligatoria solo** con puntaje extremo (1 o 5) o con 2+ puntos de diferencia entre candidatas. En los demás casos es opcional. Se configura en `EVIDENCE_RULE`.
- **Identidad judía y alineación cultural** se mantiene en 18%.
- **Finanzas (10a) y operación (10b)** se evalúan por separado y comparten el 2% original (1% cada uno).
- **Total del Comité** = promedio de los ponderados individuales (cada uno ya ajustado por N/O).

## Qué muestra el dashboard

- Puntaje ponderado total por candidata (sobre 5), número de votos finales y total de respuestas N/O.
- Preferencia final: Daniela vs Lila.
- Por criterio: promedio de cada candidata sin contar N/O, quién tiene ventaja y cuántos N/O hubo (★ = criterio de mayor peso).
- Preguntas de comparación: conteo y % por pregunta.
- Respuestas individuales desplegables (puntajes, notas, comparaciones y razonamiento final). La etiqueta **"≠ puntajes"** marca a quien eligió una candidata distinta a la que salió mejor en sus propios puntajes: conviene conversarlo en la sesión.
- **Exportar CSV** para archivo o para abrir en Excel.

## Solución de problemas

- **"No se pudo enviar… Error del servidor (401/404)"**: la URL o la llave de Supabase están mal copiadas, o no corriste el SQL.
- **"Contraseña incorrecta"** con la contraseña correcta: revisa que corriste la versión más reciente del SQL (paso 1.4).
- **Un evaluador dice que ya envió pero no aparece**: pídele que lo haga desde el mismo dispositivo; si el mensaje es "Ya existe una valoración con este nombre", su respuesta sí está guardada.
- **Alguien necesita volver a responder**: bórralo desde el dashboard y pídele que abra la página en otro navegador o en modo incógnito.
