# Instrucciones de Configuración - Neon Database

## 1. Crear Proyecto en Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Click en "Create a project"
3. Nombre del proyecto: `dr-insurance-db`
4. Región: Selecciona la más cercana (ej: US East)
5. PostgreSQL version: 15 (o la más reciente)

## 2. Ejecutar el Script SQL

1. En el dashboard de Neon, ve a "SQL Editor"
2. Copia y pega el contenido de `database-schema.sql`
3. Click en "Run" para ejecutar el script
4. Verifica que las tablas se crearon correctamente

## 3. Obtener Connection String

1. En el dashboard de Neon, ve a "Connection Details"
2. Busca "Connection string" y copia el formato: `DATABASE_URL`
3. Debería verse así:
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```

## 4. Guardar las Credenciales

Crea un archivo `.env.local` en la raíz del proyecto (cuando hagamos el setup de Next.js):

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# JWT Secret (generar uno seguro)
JWT_SECRET="tu-secret-key-super-seguro-aqui"

# Opcional: Para desarrollo
NODE_ENV="development"
```

## 5. Generar Password Hash para Admin

Para el usuario admin inicial, necesitarás:

1. Instalar bcrypt en tu proyecto Next.js (lo haremos en el Bloque 2)
2. Generar un hash con:
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash('TuPasswordSeguro123!', 10);
   console.log(hash);
   ```
3. Actualizar el usuario admin en la base de datos con el hash real

## IMPORTANTE - Seguridad

- **NUNCA** subas el archivo `.env.local` a git
- **SIEMPRE** usa contraseñas seguras
- **CAMBIA** el password del admin inicial inmediatamente
- **AGREGA** `.env.local` a tu `.gitignore`

## Verificación

Para verificar que todo está funcionando:

1. En el SQL Editor de Neon, ejecuta:
   ```sql
   SELECT * FROM users;
   ```
2. Deberías ver el usuario admin inicial

## Próximos Pasos

Una vez configurada la base de datos:
1. Continuar con el Bloque 2 (Setup de Next.js)
2. Configurar Prisma ORM para conectar con Neon
3. Implementar la autenticación