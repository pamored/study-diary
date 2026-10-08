# Diario de Estudio

Aplicación web estática para registrar sesiones de estudio. Los datos se guardan
en `localStorage` del navegador, así que no se sincronizan entre dispositivos.

## Desarrollo local

Se requiere Node.js 22 o superior para ejecutar las pruebas y construir el sitio.

```sh
npm test
npm run build
```

El comando de build genera el sitio estático en `dist/`.

## Flujo de cambios

- `preliminar` es la rama de trabajo inicial.
- Los cambios destinados a producción se integran en `main` mediante pull request.
- GitHub Actions ejecuta las pruebas unitarias y el build en cada push y pull request.
- Los pushes a `main` publican `dist/` en GitHub Pages después de que las pruebas y el build pasan.

Para activar ese despliegue, configura **Settings → Pages → Build and deployment →
Source → GitHub Actions** en el repositorio. La URL de producción es
`https://pamored.github.io/study-diary/`.
