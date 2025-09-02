# INSTRUCCIONES DE DESARROLLO - DR INSURANCE

## 🏢 INFORMACIÓN DEL CLIENTE
- **Empresa:** DR Insurance / DR Protection & Insurance
- **Ubicación:** Florida, USA
- **Mercado:** Hispano
- **Fundadores:** Augusto Dias & Geraldine Rosales
- **Directorio:** C:\Users\sica2\source\repos\dr-insurance-website

## 🌎 CONSIDERACIONES MERCADO HISPANO

### COPY Y CONTENIDO
- Español natural de LATAM/USA
- Evitar traducciones literales
- Usar "tú" no "usted"
- Valores: familia, protección, legado
- Testimonios con nombres hispanos reales

### IMÁGENES Y DISEÑO
- Familias latinas/hispanas
- Colores cálidos y vibrantes
- WhatsApp como canal principal
- Diseño emocional vs corporativo

### CULTURALES
- Énfasis en confianza personal
- Historias de éxito relatable
- Fundadores como figuras cercanas
- Comunidad y apoyo mutuo

## 🎨 INFORMACIÓN CRÍTICA SIEMPRE PRESENTE

### 🎨 PALETA DE COLORES

--primary-blue: #003F7F;    /* Azul profundo del logo */
--primary-gold: #D4AF37;    /* Dorado premium */
--accent-blue: #0066CC;     /* Azul brillante para CTAs */
--dark-navy: #001A33;       /* Azul muy oscuro para textos */
--light-blue: #E6F2FF;      /* Azul muy claro para fondos */
--white: #FFFFFF;
--gray-dark: #333333;
--gray-medium: #666666;
--gray-light: #F5F5F5;
--success: #00A86B;
--trust: #4A90E2;
```
  ### Archivos Principales:
  - `public/index.html` - Landing page (vanilla HTML/CSS/JS)
  - `public/components/*.css` - Estilos modulares vanilla
  - `public/js/*.js` - Scripts por componente (IIFE)
  - `public/images/` - Logo y fotos
  - `pages/login.tsx` - Login/Registro (React)
  - `pages/dashboard.tsx` - Dashboard (React)
  - `pages/api/auth/*` - Endpoints autenticación
  - `pages/api/users/*` - Endpoints gestión usuarios
  - `prisma/schema.prisma` - Esquema de base de datos
  - `lib/auth.ts` - Utilidades de autenticación
  - `lib/prisma.ts` - Cliente Prisma

## 🔗 RECURSOS APROBADOS

### CDNs permitidos:
- Google Fonts
- Font Awesome (si necesario)

### Herramientas:
- Chrome DevTools
- Lighthouse
- Mobile simulator
- Color contrast checker

### Referencias:
- Material Design (inspiración)
- Awwwards (tendencias)
- Dribbble (ideas visuales)

## 🎯 PRIORIDADES DE MEJORA

### VISUAL (Primera Prioridad)
- Animaciones de entrada más suaves
- Micro-interacciones en hover
- Efectos parallax sutiles
- Transiciones entre secciones
- Loading states elegantes

### FUNCIONAL (Segunda Prioridad)
- Validación de formularios
- Integración con APIs
- Optimización de imágenes
- Lazy loading
- Analytics

### TÉCNICA (Tercera Prioridad)
- Minificación
- Concatenación
- Cache strategy
- Service workers
- PWA features

## 🎨 DECISIONES IMPORTANTES
  - Arquitectura híbrida: Mantener landing page vanilla para performance, React solo para login/dashboard
  - Un solo proyecto Next.js que sirve ambos (vanilla desde /public, React desde /pages)
  - Prisma como ORM conectado a Neon PostgreSQL
  - 3 tipos de usuario: Administrador, Asistente, Agente
  - Usuarios nuevos requieren autorización manual de un Admin antes de acceder
  - Estoy trabajando en wsl en /mnt/c/ no en /home/ si claude necesita ejecutar comandos bash que requieran afectar muchos archivos pedirme ejecutarlos manualmente.

## ⚠️ RECORDATORIO FINAL

> "Un sitio funcional pero aburrido no convierte. Un sitio hermoso y emocional crea conexión instantánea con el usuario hispano que valora la estética y la atención al detalle."

**SIEMPRE** prioriza la experiencia visual y emocional sobre la optimización técnica prematura.
