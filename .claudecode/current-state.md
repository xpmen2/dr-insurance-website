  ## 🎯 ESTADO ACTUAL DEL PROYECTO
  Landing page 90% completa visualmente con funcionalidad básica implementada. Login implementado . Dasboard a un 60% completado. Landing page con diseño responsivo funcional con animaciones y micro-interacciones activas.
  
  ## 🏗️ Stack Técnico
  - Next.js 14 con TypeScript
  - PostgreSQL en Neon (tabla users funcionando)
  - Prisma ORM configurado
  - Autenticación JWT con cookies httpOnly

  ## 🌐 Rutas Funcionando
  ### Landing & Aplicación
  - `/` → index.html (landing vanilla HTML/CSS/JS)
  - `/login` → Login/Registro React (toggle entre ambos modos)
  - `/dashboard` → Dashboard React con diseño original migrado

  ### API - Autenticación
  - `/api/auth/login` → POST - Iniciar sesión
  - `/api/auth/register` → POST - Registrar nuevo usuario
  - `/api/auth/logout` → POST - Cerrar sesión
  - `/api/auth/verify` → GET - Verificar token actual

  ### API - Usuarios
  - `/api/users` → GET - Listar usuarios (solo Admin)
  - `/api/users/[id]` → GET - Obtener usuario específico
  - `/api/users/[id]/authorize` → PUT - Autorizar/rechazar usuario (solo Admin)
  - `/api/users/[id]` → DELETE - Eliminar usuario (solo Admin)

  ### API - Entrenamientos
  - `/api/training/tree` → GET - Árbol completo de secciones y recursos
  - `/api/training/sections` → GET/POST - Listar/crear secciones
  - `/api/training/sections?id=[id]` → PUT/DELETE - Actualizar/eliminar sección
  - `/api/training/sections/[id]/children` → GET - Obtener subsecciones
  - `/api/training/sections/reorder` → PUT - Reordenar secciones
  - `/api/training/resources` → GET/POST - Listar/crear recursos
  - `/api/training/resources?id=[id]` → PUT/DELETE - Actualizar/eliminar recurso
  - `/api/training/resources/reorder` → PUT - Reordenar recursos

  ## Archivos Principales
  ### Landing (Vanilla)
  - `public/index.html` - Landing page (vanilla HTML/CSS/JS)
  - `public/components/*.css` - Estilos modulares vanilla
  - `public/js/*.js` - Scripts por componente (IIFE)
  - `public/images/` - Logo y fotos

  ### Aplicación React
  - `pages/login.tsx` - Login/Registro (React)
  - `pages/dashboard.tsx` - Dashboard (React)

  ### Componentes Dashboard
  - `components/TrainingSection.tsx` - Módulo de entrenamientos con árbol navegable
  - `components/TrainingSection.module.css` - Estilos del módulo
  - `components/AddResourceModal.tsx` - Modal para agregar/editar recursos
  - `components/AddResourceModal.module.css` - Estilos del modal de recursos
  - `components/SectionModal.tsx` - Modal para agregar/editar secciones
  - `components/SectionModal.module.css` - Estilos del modal de secciones
  - `components/ConfirmDialog.tsx` - Modal de confirmación reutilizable
  - `components/ConfirmDialog.module.css` - Estilos del diálogo de confirmación

  ### API Endpoints
  - `pages/api/auth/*` - Endpoints autenticación
  - `pages/api/users/*` - Endpoints gestión usuarios
  - `pages/api/training/tree.ts` - Endpoint árbol completo
  - `pages/api/training/sections/*` - CRUD de secciones
  - `pages/api/training/resources/*` - CRUD de recursos

  ### Base de Datos
  - `prisma/schema.prisma` - Esquema con User, TrainingSection y TrainingResource
  - `lib/auth.ts` - Utilidades de autenticación
  - `lib/prisma.ts` - Cliente Prisma

  ## 👤 Credenciales de Prueba
  - Admin: admin@drinsurance.com / AdminDR2024!

  ## ✨ Funcionalidades Implementadas
  - Login/logout funcional
  - Registro de usuarios nuevos (quedan pendientes de autorización)
  - Filtros de usuarios: todos/pendientes/autorizados

  ### Dashboard
  - Dashboard con gestión de usuarios (solo Admin)
  - Base de datos: Esquema completo con secciones jerárquicas (3 niveles) y recursos
  - API endpoints: CRUD completo para secciones/recursos con auto-detección de tipos
  - UI integrada: Tree view profesional en dashboard (2 columnas)
  - Migración CSS Modules: Solución al problema de styled-jsx hash

  #### Modulo Entrenamientos 
  - Módulo Entrenamientos: Sistema CRUD completo para secciones y recursos implementado
  - Interfaz de usuario: Botones contextuales dinámicos con estados según selección
  - Modales: Sistema unificado para agregar/editar secciones y recursos
  - APIs: Endpoints completos para gestión de secciones y recursos con validaciones
  - Borrado en cascada: Implementado eliminación automática de recursos al borrar secciones
  - Videos embebidos: Sistema de detección automática de URLs y generación de embedUrl
  - Selector manual Google Drive: Radio buttons para elegir tipo (Video/PDF) en enlaces ambiguos
  - Modal fullscreen: Implementado para tablets y desktop con overlay y controles

## Tareas Pendientes
  - [ ] Menú contextual: Implementar click derecho en el árbol para acciones rápidas
  - [ ] Sistema de permisos: Mostrar/ocultar botones según rol de usuario (Administrador/Asistente/Agente)
  - [ ] Notificaciones toast: Reemplazar console.log con feedback visual de acciones
  - [ ] Reordenar recursos: Funcionalidad drag & drop para cambiar orden  
  - [x] Mostrar los videos embebidos
  - [x] Mostrar los documentos en un nuevo tab
