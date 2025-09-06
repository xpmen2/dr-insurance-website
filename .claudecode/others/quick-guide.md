# GUÍA RÁPIDA CLAUDE CODE - DR INSURANCE

## 🚀 INICIO RÁPIDO

### Primera vez en Claude Code:
```bash
# 1. Navegar al proyecto
cd C:\Users\sica2\source\repos\dr-insurance-website

# 2. Iniciar Claude Code con contexto
claude "Lee .claudecode/project-context.md y confirma que entiendes el proyecto"

# 3. Verificar estado
claude "Lista los componentes y su estado actual según components-status.md"
```

## 📝 PROMPTS EFECTIVOS

### Para mejoras visuales:
```bash
claude "Siguiendo instructions.md, añade una micro-interacción elegante al hover del componente products cards"

claude "Mejora el WOW factor del hero section con una animación de entrada para el formulario"
```

### Para funcionalidad:
```bash
claude "Implementa validación en tiempo real para el formulario del hero siguiendo el patrón en instructions.md"

claude "Conecta el formulario de newsletter del footer con console.log temporalmente"
```

### Para optimización:
```bash
claude "Optimiza las imágenes del componente founders para web sin perder calidad"

claude "Mejora el performance móvil del componente testimonials"
```

## 🔄 WORKFLOW TÍPICO

### Mañana - Inicio de sesión:
```bash
# 1. Revisar estado
claude "Resume el estado actual del proyecto y los 3 pendientes prioritarios"

# 2. Elegir tarea
claude "Voy a trabajar en [tarea]. ¿Qué debo considerar?"

# 3. Implementar
claude "Implementa [tarea] siguiendo las instrucciones del proyecto"
```

### Durante el día - Cambios iterativos:
```bash
# Pequeños ajustes
claude "Ajusta el padding del hero form en móvil a 1.5rem"

# Mejoras visuales
claude "Añade una transición suave al accordion del FAQ"

# Debugging
claude "El menú mobile no se cierra al hacer click, revisa y corrige"
```

### Tarde - Cierre de sesión:
```bash
# 1. Documentar cambios
claude "Lista todos los cambios realizados hoy para session-history.md"

# 2. Actualizar status
claude "Actualiza components-status.md con los cambios de hoy"

# 3. Siguiente sesión
claude "¿Cuáles son los próximos 3 pasos prioritarios?"
```

## 🎯 COMANDOS ESPECÍFICOS POR COMPONENTE

### Hero Section:
```bash
claude "Añade validación de teléfono formato (XXX) XXX-XXXX al formulario hero"
claude "Implementa un loading state elegante para el botón de envío"
```

### Testimonials:
```bash
claude "Añade transición fade entre testimonios del carousel"
claude "Implementa autoplay con pausa on hover"
```

### Calculator:
```bash
claude "Añade formateo de moneda a los resultados de la calculadora"
claude "Implementa guardado local de últimos cálculos"
```

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Problema: Cambios no se reflejan
```bash
claude "Limpia el cache del navegador y verifica que los archivos CSS/JS estén correctamente vinculados en index.html"
```

### Problema: Animación laggy en móvil
```bash
claude "Optimiza la animación usando transform en lugar de position y añade will-change"
```

### Problema: Componente rompe en Safari
```bash
claude "Revisa compatibilidad CSS del componente [X] para Safari y añade prefixes necesarios"
```

## 📊 COMANDOS DE REPORTE

### Estado general:
```bash
claude "Genera un reporte del estado actual del proyecto para el cliente"
```

### Performance:
```bash
claude "Analiza y lista oportunidades de mejora de performance"
```

### Pendientes:
```bash
claude "Lista los pendientes organizados por prioridad y tiempo estimado"
```

## 🔥 TIPS AVANZADOS

### 1. Modo contexto completo:
```bash
claude "Con el contexto completo del proyecto en .claudecode/, [tu pregunta específica]"
```

### 2. Modo comparación:
```bash
claude "Compara el componente testimonials con mejores prácticas y sugiere mejoras"
```

### 3. Modo refactor:
```bash
claude "Refactoriza el CSS del componente [X] para mejor mantenibilidad sin cambiar el diseño"
```

## ⚠️ RECORDATORIOS IMPORTANTES

1. **NUNCA** pidas "refactoriza todo el proyecto"
2. **SIEMPRE** trabaja en un componente a la vez
3. **REVISA** en móvil después de cada cambio
4. **DOCUMENTA** cambios significativos
5. **PRIORIZA** experiencia visual sobre optimización

## 🎨 INSPIRACIÓN RÁPIDA

Cuando necesites ideas:
```bash
claude "Sugiere 3 micro-interacciones que añadirían WOW factor al componente [X]"

claude "¿Qué tendencia de diseño 2025 podríamos aplicar al componente [X]?"

claude "Propón una animación de scroll elegante para la sección [X]"
```

---

**PRO TIP:** Guarda tus prompts favoritos que funcionen bien para reutilizarlos.

**RECUERDA:** El objetivo es 60% impacto visual, 40% código limpio.


## 🚀 COMANDOS ÚTILES CLAUDE CODE

### Para componentes visuales:
```bash
"Añade una micro-interacción de hover elegante al componente [X]"
"Crea una animación de entrada suave para [componente]"
"Mejora el WOW factor del [componente] con efectos visuales"
```

### Para funcionalidad:
```bash
"Implementa validación en tiempo real para el formulario de [X]"
"Conecta el componente [X] con el evento de analytics"
"Añade lazy loading a las imágenes de [componente]"
```

### Para optimización:
```bash
"Optimiza el componente [X] para móvil sin perder diseño desktop"
"Reduce el CSS del componente [X] eliminando código muerto"
"Mejora la accesibilidad del componente [X]"
```

## 🔥 COMANDOS FRECUENTES

### Trabajar en componente:
`Revisa el estado de [componente] en components-status.md y mejora su WOW factor`

### Debugging:
`El [componente] tiene [problema]. Revisa js/[componente].js`

### Implementar tarea:
`Implementa la tarea #[número] de pending-tasks.md siguiendo instructions.md`

### Fin de tarea:
`Marca tarea #[número] como completa en pending-tasks.md y haz commit`
