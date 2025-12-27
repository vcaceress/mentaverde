
# Guía de Instalación - Menta Verde Admin

Sigue estos pasos para desplegar la aplicación en tu propio servidor Linux.

## 1. Requisitos Previos
- Node.js (v18 o superior)
- Npm o Yarn
- Un servidor web (Nginx recomendado)

## 2. Instalación Local / Servidor
1. **Descarga los archivos** en una carpeta de tu servidor.
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Configura la Clave de API**:
   Crea un archivo `.env` en la raíz y añade tu clave de Gemini:
   ```env
   VITE_API_KEY=tu_clave_aqui
   ```

## 3. Compilación para Producción
Genera los archivos optimizados para el navegador:
```bash
npm run build
```
Esto creará una carpeta `dist/` con todo el código listo.

## 4. Configuración de Nginx (Ejemplo)
Crea un archivo de configuración en `/etc/nginx/sites-available/mentaverde`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/a/tu/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optimización de caché para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 5. Notas de Seguridad
- Asegúrate de que los permisos de la carpeta `dist` permitan la lectura al usuario `www-data`.
- Utiliza HTTPS (Certbot/Let's Encrypt) para proteger los datos de tus clientes y las comunicaciones con WhatsApp.
