# SIVOU API

Backend REST desarrollado con Spring Boot.

## Stack
- Java 21
- Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA
- H2 Database (desarrollo)

## Endpoints disponibles

### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/v1/auth/register | Registro de usuario | No |
| POST | /api/v1/auth/login | Inicio de sesión | No |
| PUT | /api/v1/auth/change-password | Cambiar contraseña | Sí |

## Variables de entorno

```properties
jwt.secret=tu_secret_key
jwt.expiration=86400
```

## Ejecutar

```bash
./mvnw spring-boot:run
```