# TAREAS PENDIENTES - DR INSURANCE

## 🔴 CRÍTICAS (Bloquean lanzamiento)

### 1. Conectar Formulario Hero con Backend
**Prioridad:** CRÍTICA
**Componente:** Hero Section
**Descripción:** Implementar envío de formulario de cotización
**Tareas:**
- [ ] Crear endpoint API
- [ ] Validación frontend
- [ ] Mensajes de éxito/error
- [ ] Integración con CRM

### 2. WhatsApp Business API
**Prioridad:** CRÍTICA
**Componente:** Global
**Descripción:** Integrar WhatsApp para comunicación directa
**Tareas:**
- [ ] Configurar WhatsApp Business
- [ ] Implementar click-to-chat
- [ ] Pre-llenar mensajes
- [ ] Analytics de conversión

### 2. Login 
**Prioridad:** CRÍTICA
**Componente:** Login Page
**Descripción:** Crear login del sitio
**Tareas:**
 - [x] Base de datos Neon configurada con tabla users y esquema completo
 - [x] Sistema de autenticación implementado con JWT y cookies httpOnly
 - [x] Gestión de usuarios para Admin con autorización/rechazo de cuentas nuevas
 - [x] API endpoints creados: /api/auth/login, /api/auth/register, /api/auth/logout, /api/users, /api/users/[id]/authorize

### 2. Migrar Dashboard 
**Prioridad:** CRÍTICA
**Componente:** Dashboard
**Descripción:** Migrar Dashboard a React
**Tareas:**

 - [x] Migración a Next.js híbrido: index.html vanilla + login/dashboard en React
 - [x] Dashboard completo migrado preservando diseño original HTML/CSS### 2. Migrar Dashboard 

### 2. Seccion Entrenamientos en Dashboard  
**Prioridad:** CRÍTICA
**Componente:** Dashboard
**Descripción:** Implementar la seccion Entrenamientos en el Dashboard
**Tareas:**
  - [x] Base de datos: Esquema completo con secciones jerárquicas (3 niveles) y recursos
  - [x] API endpoints: CRUD completo para secciones/recursos con auto-detección de tipos
  - [x] UI integrada: Tree view profesional en dashboard (2 columnas)
  - [x] Migración CSS Modules: Solución al problema de styled-jsx hash
  - [x] Permitir agregar videos y documentos
  - [ ] Menú contextual: Implementar click derecho en el árbol para acciones rápidas
  - [ ] Sistema de permisos: Mostrar/ocultar botones según rol de usuario (Administrador/Asistente/Agente)
  - [ ] Notificaciones toast: Reemplazar console.log con feedback visual de acciones
  - [ ] Reordenar recursos: Funcionalidad drag & drop para cambiar orden  
  - [x] Mostrar los videos embebidos
  - [x] Mostrar los documentos en un nuevo tab
  
  ---

## 🟡 IMPORTANTES (Mejoran conversión)

### 3. Videos Reales
**Prioridad:** ALTA
**Componente:** Hero, Recruitment
**Descripción:** Reemplazar placeholders con videos profesionales
**Tareas:**
- [ ] Video hero background
- [ ] Video presentación negocio
- [ ] Optimización para web
- [ ] Fallback para móvil

### 4. Optimización de Imágenes
**Prioridad:** ALTA
**Componente:** Global
**Descripción:** Mejorar performance con imágenes optimizadas
**Tareas:**
- [ ] Convertir a WebP
- [ ] Implementar srcset
- [ ] Lazy loading
- [ ] Comprimir existentes

### 5. Testimonios Reales
**Prioridad:** ALTA
**Componente:** Testimonials
**Descripción:** Contenido real de clientes
**Tareas:**
- [ ] Recopilar testimonios
- [ ] Fotos reales
- [ ] Videos testimoniales
- [ ] Permisos legales


---

## 🟢 DESEABLES (Mejoras futuras)

### 7. Portal de Agentes
**Prioridad:** MEDIA
**Componente:** Nuevo
**Descripción:** Área privada para agentes
**Tareas:**
- [x] Sistema login
- [x] Dashboard
- [ ] Materiales descargables
- [ ] Tracking comisiones

### 9. Versión en Inglés
**Prioridad:** BAJA
**Componente:** Global
**Descripción:** Traducción completa del sitio
**Tareas:**
- [ ] Sistema i18n
- [ ] Traducción profesional
- [ ] Switch idioma
- [ ] URLs multiidioma

---

Para agregar nuevas tareas, usar formato:
```markdown
### [Número]. [Título]
**Prioridad:** [CRÍTICA/ALTA/MEDIA/BAJA]
**Componente:** [Componente afectado]
**Descripción:** [Breve descripción]
**Tareas:**
- [ ] [Subtarea 1]
- [ ] [Subtarea 2]
```
