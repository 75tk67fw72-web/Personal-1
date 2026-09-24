# CHMD · Instrumento de Valoración Final (versión digital)

Valoración de las candidatas Daniela y Lila por parte del Comité de Selección, con tablero de resultados protegido por contraseña.
No requiere cuentas ni inicio de sesión: un solo enlace que funciona en celular o computadora.

**Archivos**
- `index.html`: la aplicación completa (formulario y tablero de resultados).
- `supabase-setup.sql`: crea la base de datos y las reglas de seguridad.

**Contraseña de administración**
- En **modo demo** (sin Supabase): `demo`.
- En **vivo**: la eliges tú en el paso 1 y **solo existe en Supabase**. Este repositorio es **público**: nunca escribas la contraseña real en GitHub.

> Supabase y Netlify tienen su interfaz en inglés. En esta guía, los nombres de sus botones y menús aparecen **tal como se ven en pantalla**, con su traducción entre paréntesis.

---

## Cómo funciona la seguridad

- Cada evaluador solo puede **enviar** su valoración. Nadie puede leer las respuestas con el enlace público.
- Los resultados solo se entregan con la contraseña correcta. **La valida Supabase en su servidor**, así que la contraseña no aparece en el código de la página.
- Una sola respuesta por nombre (controlada en la base de datos) y por dispositivo (controlada en la memoria del navegador).
- Para entrar al tablero: enlace **"Administración"** al pie de la página, o agrega `#resultados` al final de la dirección.

---

## Paso 0: probarla sin configurar nada (5 minutos)

1. Descarga `index.html` y ábrelo con doble clic en tu navegador.
2. Verás un aviso naranja de **"Modo demo"**: las respuestas se guardan solo en ese navegador.
3. Llena 2 o 3 valoraciones con nombres distintos. Para simular a otra persona, abre la página en una ventana de incógnito después de cada envío.
4. Entra a "Administración" con `demo` para ver el tablero.

---

## Paso 1: crear la base de datos en Supabase (10 minutos, gratis)

1. Entra a <https://supabase.com> → **Start your project** (iniciar proyecto) → crea una cuenta con tu correo.
2. **New project** (nuevo proyecto):
   - **Name** (nombre): `chmd-comite`
   - **Database password** (contraseña de la base): genera una y guárdala; la aplicación no la usa.
   - **Region** (región): la más cercana, p. ej. *East US*.
   - Da clic en **Create new project** (crear proyecto) y espera unos 2 minutos.
3. Menú izquierdo → **SQL Editor** (editor SQL) → **New query** (nueva consulta).
4. Abre `supabase-setup.sql`, copia **todo** el contenido y pégalo en el editor de Supabase.
5. **Ahí mismo, en Supabase**, busca la línea marcada `CONTRASEÑA DE ADMINISTRACIÓN (solo esta línea)` y reemplaza `CAMBIA-ESTA-CONTRASEÑA` por tu contraseña (conserva las comillas). Mientras no la cambies, nadie puede ver los resultados.
6. Da clic en **Run** (ejecutar). Debe aparecer *"Success. No rows returned"* (éxito, sin filas).
7. Menú izquierdo → **Project Settings** (configuración del proyecto, ícono de engrane) → **API** o **API Keys** (llaves). Copia dos datos:
   - **Project URL** (dirección del proyecto), algo como `https://abcd1234.supabase.co`
   - **anon public key** o **publishable key** (llave pública): una cadena larga que empieza con `eyJ...` o con `sb_publishable_...`

> La llave pública está hecha para ir en la página. **Nunca** uses la llave **service_role** / **secret** (llave secreta).

## Paso 2: conectar la página con Supabase (2 minutos, desde GitHub)

1. En GitHub, abre el archivo `committee-scoring/index.html` y da clic en el ícono del lápiz (**Edit this file**, editar).
2. Busca el bloque que dice `CONFIGURACIÓN` cerca del inicio y reemplaza los dos valores:

   ```js
   SUPABASE_URL: "https://abcd1234.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGciOi...tu-llave-completa...",
   ```
3. Da clic en **Commit changes** (guardar cambios). La dirección y la llave pública pueden estar en un repositorio público; la contraseña **no**.
4. Al abrir la página ya **no** debe aparecer el aviso naranja de "Modo demo".

## Paso 3: publicarla con GitHub Pages (3 minutos, gratis)

1. La aplicación debe estar en la rama principal (`main`) del repositorio.
2. En GitHub, entra al repositorio → **Settings** (configuración) → menú izquierdo **Pages** (páginas).
3. En **Build and deployment** (publicación), elige **Source: Deploy from a branch** (publicar desde una rama).
4. En **Branch** (rama) elige `main` y la carpeta `/ (root)` (raíz) → **Save** (guardar).
5. Espera 1 o 2 minutos y recarga la página de configuración. Arriba aparecerá **"Your site is live at…"** (tu sitio está publicado en…).
6. El enlace para el Comité es:

   **`https://75tk67fw72-web.github.io/Personal-1/committee-scoring/`**

   El tablero de resultados está en la misma dirección terminada en `#resultados`.
7. Cada cambio que se guarde en `main` se publica solo en 1 o 2 minutos.

**Alternativa sin GitHub: Netlify Drop.** Entra a <https://app.netlify.com/drop> y arrastra una carpeta que contenga solo `index.html`. Sirve si prefieres que el código no quede en un repositorio público.

## Paso 4: prueba final antes de enviarlo al Comité

1. Abre el enlace en tu celular y llena una valoración de prueba con el nombre `PRUEBA`.
2. Entra a `#resultados` con la contraseña y confirma que aparece.
3. En la tarjeta de `PRUEBA`, usa **Eliminar esta respuesta**.
4. Envía el enlace al Comité. **No compartas** la contraseña ni el enlace con `#resultados`.

---

## Reglas de llenado (ajustes del Comité)

- **Guía breve** visible en cada criterio; la guía completa del Instrumento queda en "Ver guía completa".
- **El evaluador no calcula nada**: la herramienta calcula el ponderado.
- **N/O – no observado / información insuficiente**: disponible en cada criterio y para cada candidata. Se excluye del cálculo individual y el ponderado se ajusta sobre el peso efectivamente evaluado (p. ej., con N/O en el criterio 4, el resto se calcula sobre 82%).
- **Evidencia escrita obligatoria solo** con puntaje extremo (1 o 5) o con 2 o más puntos de diferencia entre candidatas. En los demás casos es opcional. Se configura en `EVIDENCE_RULE`.
- **Identidad judía y alineación cultural** se mantiene en 18%.
- **Finanzas (10a) y operación (10b)** se evalúan por separado y comparten el 2% original (1% cada uno).
- **Total del Comité** = promedio de los ponderados individuales (cada uno ya ajustado por N/O).

## Qué muestra el tablero de resultados

- Total ponderado por candidata (sobre 5), número de preferencias finales y total de respuestas N/O.
- Preferencia final: Daniela frente a Lila.
- Por criterio: promedio de cada candidata sin contar N/O, quién tiene ventaja y cuántos N/O hubo (★ = criterio de mayor peso).
- Preguntas de contraste: conteo y porcentaje por pregunta.
- Respuestas individuales desplegables: puntajes, evidencias, contrastes y razón principal. La etiqueta **"≠ puntajes"** marca a quien eligió una candidata distinta a la que salió mejor en sus propios puntajes; conviene conversarlo en la sesión de cierre.
- **Exportar CSV**: archivo para abrir en Excel o archivar.

## Cambios frecuentes

| Qué quieres cambiar | Dónde |
|---|---|
| Contraseña de administración | En Supabase → SQL Editor: pega `supabase-setup.sql`, pon la nueva contraseña en la línea marcada y ejecútalo. **Nunca en GitHub.** |
| Guías y descripciones de criterios | `index.html` → lista `CRITERIA`, campos `guide` (breve) y `desc` (completa). |
| Pesos | `index.html` → lista `CRITERIA`, campo `weight` (deben sumar 100). |
| Preguntas de contraste | `index.html` → lista `QUESTIONS`. |
| Borrar todo al cerrar el proceso | Supabase → SQL Editor → `delete from public.evaluations;` → Run |

Haz los cambios de criterios y pesos **antes** de que el Comité empiece a responder: el tablero recalcula con los pesos vigentes.

> Los nombres internos del código (`CRITERIA`, `weight`, `evaluations`, etc.) son identificadores técnicos; no se ven en la aplicación y conviene no cambiarlos.

## Solución de problemas

- **"No se pudo enviar… error del servidor, código 401 o 404"**: la dirección o la llave de Supabase están mal copiadas, o no se ejecutó el SQL.
- **"Contraseña incorrecta"** con la contraseña correcta: revisa que cambiaste `CAMBIA-ESTA-CONTRASEÑA` antes de ejecutar el SQL (paso 1.5). Si no, repítelo con tu contraseña.
- **Un evaluador dice que ya envió pero no aparece**: pídele que lo intente desde el mismo dispositivo; si ve "Ya existe una valoración con este nombre", su respuesta sí está guardada.
- **Alguien necesita volver a responder**: elimina su respuesta desde el tablero y pídele que abra la página en otro navegador o en modo incógnito.
