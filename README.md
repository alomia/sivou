# SIVOU — Sistema de Votación Universitaria

Sistema web de votaciones electrónicas para la Universidad Antonio José Camacho (UNIAJC), Cali, Colombia.

## Repositorio
sivou/
├── sivou-api/   # Backend — Spring Boot 3.5 + Java 21
├── sivou-ui/    # Frontend — React 19 + TypeScript
└── compose.yaml # Base de datos PostgreSQL con Docker

## Requisitos mínimos

| Herramienta | Versión mínima |
|-------------|----------------|
| Java JDK    | 21             |
| Maven       | 3.9+           |
| Node.js     | 20.x LTS       |
| npm         | 10+            |

> Si no tienes Java 21 instalado globalmente, puedes descargarlo desde
> https://adoptium.net o usar IntelliJ IDEA que lo incluye automáticamente.

> Para Node.js se recomienda usar nvm:
> `nvm install 20 && nvm use 20`

## Base de datos

### Opción A — Docker (recomendada)
```bash
docker compose up -d
```
Levanta PostgreSQL 16 en `localhost:5432`.

### Opción B — Sin Docker
Instala PostgreSQL 16 localmente y crea una base de datos con estos datos:
DB:       sivoudb
Usuario:  sivouadmin
Password: p4ssw0rd
Puerto:   5432

## Levantar el proyecto

### 1. Backend
```bash
cd sivou-api
./mvnw spring-boot:run
```
Disponible en: http://localhost:8080/api/v1

### 2. Frontend
```bash
cd sivou-ui
npm install
npm run dev
```
Disponible en: http://localhost:5173

## Credenciales de prueba

Al arrancar el backend se crea un usuario administrador:
Email:    admin@uniajc.edu.co
Password: Admin1234*
