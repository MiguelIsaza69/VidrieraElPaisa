# Vidriera El Paisa

Sitio web de catálogo y gestión para **Vidriera El Paisa**, empresa de soluciones arquitectónicas en vidrio y aluminio en Medellín, Colombia.

---

## Qué hace

- **Vitrina pública** con hero, servicios, portafolio y testimonios.
- **Catálogo de productos** filtrable por categoría, con modal de detalle por publicación.
- **Panel de administración** protegido por roles para gestionar publicaciones, slides del hero y reseñas.
- **Autenticación** con email/contraseña, recuperación de contraseña y confirmación por correo.
- **Testimonios** que los clientes autenticados pueden publicar.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) |
| Backend / Auth / Storage | [Supabase](https://supabase.com/) |
| Notificaciones | [Sonner](https://sonner.emilkowal.ski/) |
| Imágenes estáticas | [Cloudinary](https://cloudinary.com/) |
| Iconos | [Lucide](https://lucide.dev/) |

---

## Requisitos

- Node.js 18 o superior
- npm
- Proyecto en Supabase con el esquema configurado
- (Opcional) Cuenta de Cloudinary para imágenes estáticas

---

## Configuración local

1. **Clonar e instalar:**

   ```bash
   git clone https://github.com/MiguelIsaza69/VidrieraElPaisa.git
   cd VidrieraElPaisa
   npm install
   ```

2. **Variables de entorno:**

   Copia `.env.local.example` a `.env.local` y completa las credenciales:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Configurar Supabase Auth:**

   En el dashboard de Supabase → **Authentication → URL Configuration**, agrega las URLs de redirección:

   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`
   - (Y las versiones con tu dominio de producción)

4. **Levantar el proyecto:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Ejecuta el build de producción |
| `npm run lint` | Linter |

---

## Estructura

```
app/
  admin/         Panel de administración (publicaciones, hero, reseñas)
  auth/          Rutas de autenticación (callback, reset-password)
  catalogo/      Catálogo público con filtros y modal de detalle
  contacto/      Página de contacto
  login/         Login, registro y recuperación
  perfil/        Perfil del usuario logueado
components/      Componentes compartidos (Navbar, Footer, Hero, etc.)
utils/supabase/  Clientes de Supabase (browser y server)
middleware.ts    Refresco de sesión en cada request
```

---

## Seguridad

Este proyecto implementa varias capas de seguridad:

- Headers HTTP de seguridad (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Row Level Security (RLS) en Supabase con políticas estrictas por tabla
- Permisos a nivel de columna en `profiles` para impedir escalada de privilegios
- Validación server-side del límite de reseñas por usuario
- Validación de URLs de imagen contra una allowlist en el panel admin
- Bloqueo de subidas de archivos con extensiones peligrosas en Storage
- Eliminación automática de `console.log` en builds de producción

---

## Licencia

Privado — todos los derechos reservados.
