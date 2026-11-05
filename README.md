# El camarote del capitán

Proyecto Integrador 3: una Single Page Application (SPA) responsive para conversar con una versión ficticia del capitán Jack Sparrow mediante Google Gemini.

- **Aplicación:** [Abrir el camarote del capitán](https://camarote-del-capitan.vercel.app)

- **Repositorio:** [ProyectoM3_JoseReategui](https://github.com/jose-reategui/ProyectoM3_JoseReategui)

## Personaje elegido

Jack Sparrow, de la saga *Piratas del Caribe*, se caracteriza por su ingenio, humor, teatralidad e imprevisibilidad. El system prompt le indica responder normalmente en español, con una a tres frases, mantener el contexto y utilizar referencias ocasionales a barcos, tesoros y aventuras. Ante temas modernos, reconoce sus límites o recurre a comparaciones piratas. Es una simulación educativa y no un producto oficial.

## Funcionalidades

- Rutas `/home`, `/chat` y `/about` renderizadas dinámicamente.

- Navegación con History API y evento `popstate`, incluidos atrás y adelante.

- Historial en memoria que se conserva al cambiar de vista y se reinicia al recargar.

- Mensajes del personaje y del usuario diferenciados visualmente.

- Envío mediante botón o Enter, validación de mensajes vacíos y scroll al último mensaje.

- Indicador de escritura y controles deshabilitados durante la petición.

- Manejo de errores de conexión, respuesta vacía y errores del servidor. Ante un fallo se restaura el mensaje en el input para volver a enviarlo.

- Diseño mobile-first con Flexbox, Grid y media queries en 768 px y 1200 px.

- Estética de pergamino cálido con camarote, barco, sombrero y botella decorativa con calavera y X.

## Tecnologías

HTML, CSS y JavaScript con módulos ES; Vite para desarrollo y build; Fetch API con async/await; Google Gemini; Vercel Functions; Vitest; Git y GitHub.

## Organización

El código está en `Desarrollo/`. Este README reúne la documentación y la carpeta `Documentacion/` contiene las capturas del aplicativo y las evidencias de uso de IA.

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `Desarrollo/api/functions.js` | Proxy seguro, validación, system prompt, transformación del historial y parseo de Gemini |
| `Desarrollo/src/index.html` | Contenedor HTML, header, navegación y footer |
| `Desarrollo/src/styles.css` | Estilos mobile-first, estados y decoraciones |
| `Desarrollo/src/assets/` | Fondo y decoraciones en WebP |
| `Desarrollo/src/app.js` | Rutas, renderizado de vistas y History API |
| `Desarrollo/src/chat.js` | Historial en memoria, formulario y renderizado de mensajes |
| `Desarrollo/src/utils.js` | Fetch al proxy y parseo de su respuesta |
| `Desarrollo/tests/utils.test.js` | Seis pruebas unitarias sin red |
| `Desarrollo/.env.example` | Nombres de variables sin valores reales |
| `Desarrollo/vercel.json` | Comandos, carpeta de salida y rewrites SPA |
| `Documentacion/Capturas del aplicativo/` | Capturas reales de la aplicación |
| `Documentacion/Documentacion IA/` | Capturas de las dos consultas documentadas |
| `README.md` | Documentación completa del proyecto |

## Requisitos

- Node.js 24.x y npm.

- Git para clonar el repositorio.

- Una cuenta de Google AI Studio y una API key con acceso a un modelo de Gemini.

- Una cuenta de Vercel para ejecutar `vercel dev` y desplegar.

Los comandos siguientes usan PowerShell en Windows. Se utiliza `npm.cmd` y `npx.cmd` para evitar el bloqueo de scripts `.ps1`. En otros entornos pueden usarse `npm` y `npx`.

## Ejecución local

### 1. Clonar e instalar

```powershell
git clone https://github.com/jose-reategui/ProyectoM3_JoseReategui.git
cd ProyectoM3_JoseReategui\Desarrollo
npm.cmd ci
```

### 2. Configurar el entorno

Dentro de `Desarrollo`, copia el ejemplo:

```powershell
Copy-Item .env.example .env
```

Completa `.env` con tu clave real y el identificador de un modelo disponible para tu proyecto:

```dotenv
GEMINI_API_KEY=tu_clave_real
GEMINI_MODEL=identificador_del_modelo
```

Reemplaza `identificador_del_modelo` por un modelo disponible en tu cuenta de Google AI Studio. Su disponibilidad y cuota dependen de la cuenta. Utiliza el identificador correspondiente tanto localmente como en Vercel.

`.env` se encuentra junto a `package.json`, fuera de `src`. Está excluido de Git. `.env.example` debe conservar únicamente los nombres de las variables, sin claves ni valores reales.

### 3. Iniciar frontend y función

```powershell
npx.cmd vercel dev
```

En el primer inicio, sigue las indicaciones de autenticación y vinculación del proyecto en Vercel. Para una copia propia, vincula un proyecto de tu cuenta. Abre la dirección indicada por `Ready! Available at`, normalmente http://localhost:3000.

- Inicio: http://localhost:3000/home

- Chat: http://localhost:3000/chat

- Acerca de: http://localhost:3000/about

Mantén la terminal abierta. Para detener el servidor, presiona Ctrl + C. Después de cambiar variables de entorno, reinicia el servidor.

`npm.cmd run dev` inicia solo Vite: sirve para trabajar la interfaz, pero no ejecuta por sí solo la función de `/api`. Para probar el chat completo se utiliza `vercel dev`.

### Problemas encontrados en Windows

- **PowerShell bloquea npm.ps1:** ejecutar `npm.cmd` o `npx.cmd`.

- **EPERM al crear symlinks en la caché de Vercel:** se resolvió habilitando el Modo de desarrollador de Windows y reiniciando VS Code. Se puede abrir la configuración con Windows + R y `ms-settings:developers`.

- **Vercel espera mientras Vite arranca en otro puerto:** el comando de desarrollo en `vercel.json` pasa el puerto asignado con `npm run dev -- --port $PORT`.

## Pruebas unitarias

Desde `Desarrollo`:

```powershell
npm.cmd test
```

Se ejecuta `vitest run`. Las seis pruebas verifican:

1. Extracción de texto y eliminación de espacios en los extremos.

2. Rechazo de una respuesta sin `text`.

3. Rechazo de texto compuesto solo por espacios.

4. Envío del historial completo por POST y lectura de la respuesta.

5. Propagación del error informado por el servidor.

6. Propagación de un fallo de conexión.

Se reemplaza `fetch` mediante `vi.stubGlobal` y se restaura después de cada prueba con `vi.unstubAllGlobals`. No se usa la red, no se necesita una API key y no se consume cuota de Gemini. Las pruebas unitarias no sustituyen las comprobaciones manuales del chat y del despliegue.

## Build

```powershell
npm.cmd run build
```

Vite genera el frontend de producción en `Desarrollo/dist`. Vercel procesa por separado las funciones de `Desarrollo/api`. La carpeta `dist` no se sube a Git.

## Integración con Gemini y seguridad

El navegador envía `{ messages: [{ role, text }] }` por POST a `/api/functions`. La función valida el historial y lo transforma al formato `contents`, con roles `user` y `model`, y partes de texto. Omite el saludo inicial anterior al primer mensaje del usuario.

En cada petición se envía el historial de la conversación: Gemini no conserva por sí solo la memoria entre estas llamadas. La función agrega `systemInstruction`, consulta `generateContent` y transforma el resultado en `{ text }` para el cliente.

La API key se lee con `process.env.GEMINI_API_KEY` en el servidor y se envía a Google mediante el header `x-goog-api-key`. No se incluye en el JavaScript del navegador, no usa el prefijo `VITE_` y no se registra en Git. Los mensajes se muestran con `textContent` para no interpretar el texto como HTML.

La función acepta únicamente POST, valida los mensajes, aplica un timeout de 25 segundos y trata respuestas sin texto y errores de Gemini. Los errores 429 se muestran como límite de solicitudes. Los demás errores de Gemini se comunican con un mensaje genérico.

### Conceptos utilizados

- **Tokens:** unidades de texto que procesa el modelo. El historial y las respuestas consumen tokens; las conversaciones largas aumentan el contexto enviado.

- **Temperature:** parámetro que influye en la variación de las respuestas. Se configuró en `1`; no garantiza exactitud ni coherencia por sí solo.

- **Rate limiting:** límites de solicitudes o tokens impuestos por el proveedor. La aplicación maneja el estado 429, pero no implementa un limitador propio por usuario.

El proyecto no incorpora autenticación, base de datos ni persistencia con localStorage. El historial vive en memoria y se pierde al recargar. Una API key oculta no impide por sí sola que terceros llamen al endpoint público.

## Despliegue en Vercel desde GitHub

1. Subir el proyecto a un repositorio público de GitHub.

2. Crear un proyecto en Vercel o conectar el repositorio desde Settings > Git de un proyecto existente.

3. Configurar **Root Directory: `Desarrollo`**.

4. Verificar el framework **Vite**, Build Command **`npm run build`** y Output Directory **`dist`**. Estas opciones también se declaran en `vercel.json`.

5. Agregar `GEMINI_API_KEY` y `GEMINI_MODEL` en las variables del proyecto, para Production y Preview. En la interfaz utilizada están dentro de Settings > Environments.

6. Configurar `main` como rama de producción y crear el despliegue desde esa rama.

7. Esperar el estado Ready y abrir el dominio público.

8. Si se cambian variables de entorno, crear un nuevo despliegue para que surtan efecto.

Con el repositorio conectado, los siguientes pushes a la rama de producción generan nuevos despliegues. Las reglas de `vercel.json` permiten abrir directamente `/home`, `/chat` y `/about`.

## Comprobación manual

Antes de entregar, comprobar en la aplicación publicada:

- Conversación de varios turnos y recuerdo de un dato, por ejemplo el nombre del usuario.

- Personalidad del personaje y respuestas breves.

- Conservación del historial al cambiar de vista y reinicio al recargar.

- Navegación con enlaces y botones atrás/adelante.

- Apertura directa y recarga de `/chat`.

- Indicador de escritura, bloqueo de envíos simultáneos y scroll al último mensaje.

- Mensaje de error al fallar una petición.

- Diseño en 375 × 667, 768 × 1024 y 1440 × 900, sin desbordamiento horizontal.

- Acceso público en una ventana de incógnito y funcionamiento de la función en producción.

## Capturas de pantalla

Las imágenes siguientes deben corresponder a la versión final publicada. Se guardan en `Documentacion/Capturas del aplicativo` respetando nombres y mayúsculas.

### Inicio

![Página de inicio](<Documentacion/Capturas del aplicativo/home.png>)

### Chat en escritorio

![Conversación con el capitán en escritorio](<Documentacion/Capturas del aplicativo/chat-desktop.png>)

### Chat en tablet

![Chat en tablet a 768 por 1024](<Documentacion/Capturas del aplicativo/chat-tablet.png>)

### Chat en celular

![Chat en celular a 375 por 667](<Documentacion/Capturas del aplicativo/chat-mobile.png>)

### Acerca del proyecto

![Vista Acerca de](<Documentacion/Capturas del aplicativo/about.png>)

## Registro del uso de IA

### Herramientas y forma de trabajo

Utilicé ChatGPT como apoyo para resolver dudas y desarrollar partes concretas del proyecto. Solicité sugerencias de pruebas unitarias con Vitest, apoyo en la revisión del código y orientación para resolver errores de configuración y despliegue.

La herramienta también proporcionó ejemplos y propuestas de código que incorporé al proyecto. Fui aplicando los cambios en VS Code y comprobando los resultados mediante pruebas, la terminal y el navegador. Cuando surgían errores o el resultado no coincidía con lo que buscaba, compartía capturas para revisarlo y realizar ajustes.

Para la apariencia visual, solicité propuestas de diseño y utilicé el generador de imágenes de ChatGPT para crear el fondo y las decoraciones. Elegí el estilo de pergamino cálido y solicité ajustes de distribución. Google Gemini se utilizó como el servicio que genera las respuestas del personaje dentro de la aplicación.

### Consultas, resultados y decisiones

Las siguientes capturas recrean dos consultas realizadas durante el desarrollo para documentar el problema y la orientación recibida.

#### 1. Centrado y adaptación responsive del chat

**Consulta:** solicité apoyo porque el panel del chat no quedaba centrado y presentaba problemas de tamaño en algunas pantallas.

**Respuesta recibida:** ChatGPT sugirió revisar el ancho máximo, los márgenes automáticos, el modelo de caja y las media queries.

**Decisión y resultado:** ajusté el CSS para centrar el panel y revisé su presentación en distintos tamaños de pantalla.

![Consulta sobre el centrado del chat](<Documentacion/Documentacion IA/1.Chat_centrado1.jpeg>)

![Respuesta sobre el centrado del chat](<Documentacion/Documentacion IA/1.Chat_centrado2.jpeg>)

#### 2. Corrección del puerto de desarrollo en Vercel

**Consulta:** solicité apoyo porque Vite iniciaba en localhost:5173, pero Vercel no terminaba de arrancar.

**Respuesta recibida:** ChatGPT recomendó configurar devCommand como `npm run dev -- --port $PORT` para utilizar el puerto asignado por Vercel.

**Decisión y resultado:** apliqué la corrección en vercel.json, reinicié el servidor y comprobé que Vercel mostraba el estado Ready.

![Consulta sobre el puerto de Vercel](<Documentacion/Documentacion IA/2.Corrección_del_puerto_de_desarrollo1.png>)

![Respuesta sobre el puerto de Vercel](<Documentacion/Documentacion IA/2.Corrección_del_puerto_de_desarrollo2.png>)

### Diseño del system prompt

El prompt del personaje está en [`Desarrollo/api/functions.js`](Desarrollo/api/functions.js) y se envía desde el servidor como `systemInstruction`. Define:

- La personalidad de Jack Sparrow: ingenioso, teatral, impredecible y algo presumido.

- El uso de humor y referencias a aventuras, sin repetir siempre las mismas frases.

- Respuestas normalmente en español, de una a tres frases.

- La continuidad de la conversación sin inventar mensajes o decisiones del usuario.

- Límites frente a temas modernos y reconocimiento de que se trata de una simulación mediante IA cuando se le pregunta.

La IA ayudó a redactarlo. Elegí al personaje y comprobé el resultado conversando con él. No se realizaron pruebas exhaustivas de todos los temas o posibles formas de romper el personaje.

### Cómo evalué las sugerencias

Algunos problemas que encontré durante el desarrollo fueron:

- **Puerto de desarrollo:** el primer `devCommand` propuesto no pasaba el puerto asignado por Vercel. Vite arrancaba en `5173`, pero Vercel quedaba esperando. Se corrigió a `npm run dev -- --port $PORT` y después apareció el estado `Ready!`.

- **Alineación del diseño:** la primera propuesta colocaba el panel a la izquierda. Solicité centrarlo porque prefería esa distribución.

- **Archivo sin guardar:** el README de portada se subió vacío. Al revisar el commit, se detectaron cero inserciones; guardé el archivo y subí la corrección.

Estos casos me ayudaron a ver que una sugerencia de IA necesita comprobarse con el código, el navegador y los resultados de la terminal. También aprendí la importancia de guardar los archivos y revisar los cambios antes de subirlos.

Para verificar el proyecto utilicé la ejecución local, pruebas de navegación e historial, una conversación que recuerda el nombre del usuario, seis tests unitarios, el build y una conversación en producción. También incorporé capturas de Home, Chat en escritorio, tablet y celular, y About. Estas comprobaciones cubren casos concretos; no garantizan que no existan otros errores.
