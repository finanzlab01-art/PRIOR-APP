# PRIOR — demo web (rebanada vertical)

## Qué es
PRIOR es una app de educación financiera para venezolanos y la diáspora. No enseña desde cero:
primero diagnostica cómo decide la persona (situaciones reales) y detecta creencias heredadas de
la crisis ("dogmas"). Luego arma una ruta con tres materias: Economía, Finanzas, Conducta y sociedad.
Lema: "El futuro se practica." Subtítulo: "Equivócate aquí. Acierta afuera."

## Cómo está hecha
- Un solo archivo `index.html` con HTML, CSS y JavaScript sin frameworks. Sin compilación.
- Publicada con GitHub Pages desde la rama main (carpeta raíz). No se usa Netlify.
- Supabase para cuentas (correo y contraseña) y datos: tablas `diagnostico_resultados` y
  `leccion_resultados`. Seguridad por fila activa: cada persona solo ve y escribe lo suyo.
- En el código va SOLO la clave publishable de Supabase. Nunca la clave de servicio.
- Invitaciones con `?ref=` en el enlace.
- Medición anónima en la tabla `visitas_pasos` (solo insertar; uuid de visita por pestaña en
  sessionStorage, cada paso una vez por visita, sin datos personales). Pasos: `bienvenida`,
  `perfil_1`–`perfil_2`, `situacion_1`–`situacion_10`, `resultado`, `cuenta`, `cuenta_creada`,
  `con_sesion`, `sin_cuenta`, `leccion_intro`, `leccion_1`–`leccion_N` (N = pantallas de la lección), `leccion_fin`.

## Cómo funciona hoy
- Mini perfil (edad y moneda en que cobra) y diagnóstico v4: 10 situaciones, con opción
  E "Otra respuesta" (texto libre que no cuenta para la mezcla).
- El diagnóstico es un test: al elegir no se muestra ninguna consecuencia ni si acertó;
  pasa solo a la siguiente situación. La interpretación de las decisiones va al final.
- Resultado: mezcla de las tres materias (piso de 20%) y creencias a revisar.
- Lección E1 "Tasas, bancos y tu bolívar" en 5 momentos. En pantallas con opciones pasa sola
  al terminar; en pantallas de lectura o exploración hay botón "Seguir".
- Criterio: puntos que premian razonar, no acertar.

## Marca "Horizonte"
- Colores: principal #1B2A4A, acento/sol #E8A33D, cielo #7FB3D5, arena #E6DFD3, fondo #F7F3EA.
  Hay versión oscura con prefers-color-scheme: mantenerla.
- Tipografías: Plus Jakarta Sans (títulos) e Inter (texto).
- Símbolo: un sol que sube sobre una línea de horizonte (también es la barra de progreso).

## Contenido (no inventar)
- No cambies textos, cifras, puntajes, preguntas ni contenido financiero salvo que la tarea lo pida
  con el texto exacto. Si falta contenido, deja un marcador visible [PENDIENTE: ...] y avísame.
- Nunca recomendar activos concretos ni prometer rendimientos.

## Voz
Tuteo, español venezolano claro, frases cortas, una idea por pantalla. Sin jerga financiera
sin explicar. Cálida, nunca regañona: la app no debe generar tensión ni hacer sentir que
la persona decidió mal.

## Reglas de trabajo
- Antes de editar, explica tu plan y espera mi confirmación.
- Una tarea por sesión. No toques nada fuera de lo pedido.
- Móvil primero (pantallas de unos 380 px). Pocos toques: no agregues botones innecesarios.
- Liviano (datos móviles caros en Venezuela): nada de videos ni imágenes pesadas;
  ilustraciones en SVG dentro del archivo. Animaciones con CSS/SVG; respetar prefers-reduced-motion.
- No cambies la estructura de las tablas de Supabase sin pedírmelo.
- Al terminar, resume en español qué cambiaste y cómo probarlo en el teléfono.
