# CHMD · Instrumento de Valoración Final (versión digital)

Valoración de las candidatas Daniela y Lila por parte del Comité de Selección, con tablero de resultados protegido por contraseña.
Un solo enlace, en celular o computadora, sin cuentas ni inicio de sesión.

**Archivos**
- `index.html`: la aplicación completa (formulario y tablero de resultados).
- `apps-script/Code.gs`: el servicio de Google que guarda las respuestas en una hoja de cálculo tuya (el mismo esquema que la invitación del Bar Mitzvá).

**Cómo funciona**
- El equipo abre el enlace y responde. **No necesita cuenta** de Google, Claude ni nada.
- Cada respuesta se guarda en una **hoja de Google Sheets privada tuya**.
- La sección de resultados (`#resultados`) pide contraseña. **La valida Google**, no la página, así que no aparece en el código.
- Una sola respuesta por nombre (controlada en la hoja) y por dispositivo.

**Contraseña de administración**
- En **modo demo**: `demo`.
- En **vivo**: la eliges tú en el paso 1 y **solo existe en tu Apps Script**. Este repositorio es **público**: nunca escribas la contraseña real en GitHub.

---

## Paso 0: practicar sin tocar la hoja real

1. Abre el enlace agregando `?demo=1`: `https://75tk67fw72-web.github.io/Personal-1/committee-scoring/?demo=1`
2. Verás un aviso naranja de **"Modo demo"**: las respuestas se guardan solo en ese navegador.
3. Llena 2 o 3 valoraciones con nombres distintos (para simular a otra persona, usa una ventana de incógnito).
4. Entra a "Administración" con `demo` para ver el tablero.

> La página necesita estar publicada (dirección `https://`). Abierto como archivo desde tu computadora, Google no acepta la conexión.

---

## Paso 1: crear el servicio de Google (7 minutos)

1. En la computadora, entra a <https://script.google.com> con tu cuenta de Google y da clic en **Nuevo proyecto**.
2. Arriba a la izquierda, cambia "Proyecto sin título" por **CHMD Valoraciones**.
3. Borra el código que aparece, pega **todo** el contenido de `apps-script/Code.gs` y, **ahí mismo**, cambia `CAMBIA-ESTA-CONTRASEÑA` por tu contraseña (conserva las comillas).
4. Guarda (ícono de disco).
5. En la barra de arriba elige la función **crearHoja** y da clic en **▶ Ejecutar**. Google pedirá permiso: **Revisar permisos → tu cuenta → Configuración avanzada → Ir a CHMD Valoraciones (no seguro) → Permitir**. Esto crea en tu Google Drive la hoja **"CHMD · Valoraciones del Comité"**, donde llegarán las respuestas.
6. **Implementar → Nueva implementación**. En el engrane de "Seleccionar tipo" elige **Aplicación web** y configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
7. Da clic en **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).

> ¿Prefieres partir de una hoja existente? Desde Google Sheets: **Extensiones → Apps Script** y sigue desde el punto 3 (el punto 5 no hace falta). Si no ves "Apps Script" en Extensiones, es porque el archivo es de Excel o tu cuenta lo tiene limitado: usa la ruta de arriba.

> Si después cambias el código o la contraseña: **Implementar → Administrar implementaciones → lápiz → Versión: Nueva versión → Implementar**. La URL no cambia.

## Paso 2: conectar la página (2 minutos, desde GitHub)

1. En GitHub, abre `committee-scoring/index.html` y da clic en el lápiz (**Edit this file**, editar).
2. En el bloque `CONFIGURACIÓN`, reemplaza `PEGA-AQUI-LA-DIRECCION-DE-APPS-SCRIPT` por la URL que copiaste:

   ```js
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfy.../exec",
   ```
3. Da clic en **Commit changes** (guardar cambios). La URL puede estar en un repositorio público; la contraseña **no**.

## Paso 3: publicarla con GitHub Pages

Tu repositorio **ya publica con GitHub Pages** la rama `main` (ahí vive la invitación del Bar Mitzvá). En cuanto la carpeta `committee-scoring` esté en `main`, el enlace para el Comité queda activo en 1 o 2 minutos:

**`https://75tk67fw72-web.github.io/Personal-1/committee-scoring/`**

El tablero de resultados está en la misma dirección terminada en `#resultados`.

Mientras la página no tenga la URL de Apps Script, el enlace muestra "La valoración aún no está disponible" en lugar del formulario, para que nadie responda en modo demo y se pierda su respuesta.

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
| Contraseña de administración | En Apps Script: cambia `ADMIN_PASSWORD`, guarda y publica una **nueva versión** (ver nota del paso 1). **Nunca en GitHub.** |
| Guías y descripciones de criterios | `index.html` → lista `CRITERIA`, campos `guide` (breve) y `desc` (completa). |
| Pesos | `index.html` → lista `CRITERIA`, campo `weight` (deben sumar 100). |
| Preguntas de contraste | `index.html` → lista `QUESTIONS`. |
| Borrar todo al cerrar el proceso | En la hoja de Google, borra las filas debajo del encabezado (o elimina la hoja completa). |

Haz los cambios de criterios y pesos **antes** de que el Comité empiece a responder: el tablero recalcula con los pesos vigentes.

> Los nombres internos del código (`CRITERIA`, `weight`, `evaluations`, etc.) son identificadores técnicos; no se ven en la aplicación y conviene no cambiarlos.

## Solución de problemas

- **"No se pudo enviar… respuesta inesperada del servidor"**: en Apps Script, revisa que la implementación diga **Quién tiene acceso: Cualquier persona** y que la URL copiada termine en `/exec`.
- **"Contraseña incorrecta"** con la contraseña correcta: si la cambiaste en Apps Script, falta publicar una **nueva versión** (nota del paso 1).
- **Un evaluador dice que ya envió pero no aparece**: pídele que lo intente desde el mismo dispositivo; si ve "Ya existe una valoración con este nombre", su respuesta sí está guardada.
- **Ver las respuestas en crudo**: abre tu hoja de Google; cada valoración es una fila (la columna `datos_json` guarda el detalle completo).
- **Alguien necesita volver a responder**: elimina su respuesta desde el tablero y pídele que abra la página en otro navegador o en modo incógnito.
