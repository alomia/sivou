# SIVOU API

REST API del sistema de votaciones de la UNIAJC.

## Stack
- Java 21
- Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA + Flyway
- PostgreSQL 16

## Configurar base de datos

En `src/main/resources/application.properties` ajusta si es necesario:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sivoudb
spring.datasource.username=sivouadmin
spring.datasource.password=p4ssw0rd
```

## Ejecutar

```bash
./mvnw spring-boot:run
```

## Endpoints

### Auth — público
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/v1/auth/register | Registro de usuario |
| POST | /api/v1/auth/login | Inicio de sesión → devuelve JWT |
| PUT | /api/v1/auth/change-password | Cambiar contraseña (requiere token) |

### Elecciones — requiere token
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/elections | Listar elecciones |
| POST | /api/v1/elections | Crear elección (ADMIN) |
| PATCH | /api/v1/elections/{id}/status | Cambiar estado (ADMIN) |

### Candidaturas — requiere token
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/v1/candidacies | Registrar candidatura |
| GET | /api/v1/candidacies/election/{id} | Candidaturas por elección |
| PATCH | /api/v1/candidacies/{id}/review | Aprobar/rechazar (ADMIN) |

### Votación — requiere token
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/voting/{electionId}/ballot | Ver tarjetón |
| POST | /api/v1/voting/cast | Emitir voto |

### Resultados — requiere token
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/results/{electionId} | Ver resultados |

## Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```
El token se obtiene al hacer login o registro.
