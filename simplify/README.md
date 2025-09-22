# Simplify

Simplify AI es una SPA ligera con frontend estático y API serverless lista para desplegar en Vercel.

## Requisitos previos

- Node.js 18 o superior
- Una cuenta en Vercel
- Clave de API de OpenAI con acceso al modelo `gpt-4o-mini`

## Instalación y desarrollo local

```bash
npm install
npm run dev
```

El comando `npm run dev` utiliza `serve` para exponer el contenido de `public/` en `http://localhost:3000`.

## Variables de entorno

Configura `OPENAI_API_KEY` en los entornos **Development**, **Preview** y **Production** de Vercel. En local puedes exportarla antes de usar `vercel dev` o realizar peticiones manuales.

## Despliegue

```bash
vercel --prod
```

El proyecto incluye `vercel.json` con las rutas necesarias para servir el frontend estático y las funciones serverless.

## Recursos estáticos

- Coloca tu imagen de avatar (512×512) en `public/avatar.png` antes de desplegar.
- Los textos de la interfaz están localizados en `public/locales/`. Para añadir un idioma duplica cualquier JSON existente, renombra el archivo con el código ISO-639-1 y ajusta los textos.

## Exportaciones

La interfaz permite copiar resultados, exportar a DOCX y exportar a PDF desde la tarjeta de resultados.

## Licencia

MIT

<!--
sitemap.txt
/
/api/ai
/api/health
-->
