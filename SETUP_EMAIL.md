# Setup Guía: Email con Mailgun en Astro

## Instalación

No necesitas paquetes adicionales. Astro ya soporta API routes nativas.

## Configuración de Mailgun

### 1. Crear cuenta en Mailgun
- Ve a https://www.mailgun.com/
- Crea una cuenta gratuita (incluye 5,000 emails/mes)
- Accede a tu dashboard

### 2. Obtener credenciales
1. En el dashboard, ve a **Account > Security > API Keys**
2. Copia tu **Private API Key**
3. Ve a **Sending > Domains** y copia tu dominio (ej: `mg.yourdomain.com`)

### 3. Configurar variables de entorno
Edita `.env.local` en la raíz del proyecto:

```env
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
ADMIN_EMAIL=your_email@company.com
```

### 4. Instalar dependencias (opcional)
El proyecto no requiere dependencias nuevas, pero si quieres usar TypeScript strict:

```bash
pnpm add -D @types/node
```

## Estructura de Archivos

```
src/
├── components/
│   ├── Demo.astro          # Componente principal
│   └── DemoForm.tsx        # Componente React con lógica del formulario
└── pages/
    └── api/
        └── send-demo.ts    # API route para enviar emails
```

## Cómo funciona

1. **Frontend (DemoForm.tsx)**: El usuario completa el formulario
2. **API Route (send-demo.ts)**: 
   - Valida los datos
   - Envía email a admin
   - Envía confirmación al usuario
   - Retorna respuesta al frontend

## Pruebas

1. Completa el formulario en http://localhost:3000/#demo
2. Verifica que recibas:
   - Email de admin con la solicitud
   - Email de confirmación en tu inbox

## Troubleshooting

### "Servicio de email no disponible"
- Verifica que `.env.local` tiene los valores correctos
- Recarga el servidor: `pnpm dev`

### Emails no llegan
- Revisa la carpeta de spam
- En Mailgun dashboard > Logs, verifica si hay errores

### Error 401 en Mailgun
- Verifica que la API Key es correcta
- Asegúrate de que sea la **Private Key**, no la Public Key

## Alternativa: Donweb

Si prefieres Donweb, la configuración es similar pero usando SMTP:

```env
SMTP_HOST=smtp.donweb.com
SMTP_PORT=587
SMTP_USER=your_email@donweb.com
SMTP_PASSWORD=your_password
ADMIN_EMAIL=your_admin_email@company.com
```

Y necesitarías instalar `nodemailer`:

```bash
pnpm add nodemailer
```

Luego cambiar el endpoint para usar SMTP en lugar de Mailgun.
