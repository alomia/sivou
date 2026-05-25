# SIVOU UI

Frontend del sistema de votaciones de la UNIAJC.

## Stack
- React 19
- TypeScript 6
- Vite 8
- Radix UI Themes
- React Router 7
- React Hook Form + Zod
- TanStack Query
- Zustand
- Axios
- Sonner

## Requisito de Node.js

**Node.js 20 LTS es obligatorio.** Versiones anteriores no son compatibles.

Verificar versión actual:
```bash
node -v   # debe mostrar v20.x.x o superior
```

Instalar con nvm (recomendado):
```bash
nvm install 20
nvm use 20
```

Descargar directo: https://nodejs.org/en/download

## Ejecutar

```bash
npm install
npm run dev
```

Disponible en: http://localhost:5173

El backend debe estar corriendo en http://localhost:8080 antes de usar la app.

## Estructura

```
src/
├── auth/          # Login, registro, autenticación
├── elections/     # Gestión de elecciones
├── candidacies/   # Gestión de candidaturas
├── voting/        # Tarjetón y emisión de voto
├── results/       # Resultados por elección
├── dashboard/     # Layout y home
└── users/         # Gestión de usuarios
```