# SIVOU - Sistema de Votación Universitario

Sistema web de votaciones electrónicas para la Universidad Antonio José Camacho (UNIAJC), Cali, Colombia.

## Estructura del proyecto

```bash
sivou/
├── sivou-api/    # Backend - Spring Boot + Java
└── sivou-ui/     # Frontend - React + TypeScript
```
## Requisitos

- Java 21+
- Node.js 18+
- Maven

## Levantar el proyecto

### Backend
```bash
cd sivou-api
./mvnw spring-boot:run
```

### Frontend
```bash
cd sivou-ui
npm install
npm run dev
```

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api/v1
- H2 Console: http://localhost:8080/api/v1/h2-console
