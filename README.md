# Backend ExtraHours - Sistema de Gestión de Horas Extra

## Descripción

Sistema para el registro y gestión de horas extra, desarrollado como ejercicio académico. Permite a los empleados registrar sus horas extra, a los líderes aprobarlas o rechazarlas, y a los administradores gestionar grupos y generar reportes.

## Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.3.5**
- **MySQL**
- **Spring Security + JWT**
- **Spring Data JPA**
- **Spring Mail**

## Arquitectura

El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador) con las siguientes capas:

### Modelo (Model)

- Entidades JPA que representan las tablas de la base de datos
- DTOs para transferencia de datos
- Enums para roles y estados

### Controladores (Controllers)

- AuthenticationController: Manejo de autenticación
- ExtraHourController: Gestión de horas extra
- GroupController: Administración de grupos
- UserController: Gestión de usuarios

### Servicios (Services)

- AuthenticationService: Lógica de autenticación y códigos de verificación
- EmailService: Envío de correos
- ExtraHourService: Lógica de negocio para horas extra
- GroupService: Gestión de grupos y asignaciones
- JwtService: Manejo de tokens JWT

## Características Principales

## Autenticación

El sistema implementa un proceso de autenticación sin contraseñas basado en códigos de verificación:

- Sistema basado en códigos de verificación enviados por email

  1. El usuario ingresa su cédula (ID)
  2. El sistema envía un código de 6 dígitos al correo eléctronico registrado

- Tokens JWT para mantener la sesión
  1. El código tiene una validez de 5 minutos
  2. Al validar el código correctamente, el sistema genera un token JWT
  3. El token se utiliza para autenticar las siguientes peticiones
  4. Después de 3 intentos fallidos, la cuenta se bloquea

### Consideraciones de Seguridad

- Los códigos son numéricos y aleatorios
- Cada código es de un solo uso
- Se registran los intentos fallidos
- El token JWT expira después de 1 hora

### Gestión de Horas Extra

- Registro de horas con validaciones
- Aprobación/Rechazo por parte de líderes
- Cálculo automático de tipos de hora según legislación colombiana
- Límite de 2 horas diarias y 12 semanales

### Gestión de Grupos

- Creación y administración de grupos
- Asignación de líderes
- Gestión de miembros

## Estructura del Proyecto

```
com.amadeus.extraours
├───config
│       MailConfig.java
│       SecurityConfig.java
│
├───controller
│       AuthenticationController.java
│       ExtraHourController.java
│       GroupController.java
│       UserController.java
│
├───dto
│   ├───request
│   │       AuthenticationRequest.java
│   │       CreateGroupRequest.java
│   │       ExtraHourRequest.java
│   │
│   └───response
│           AuthenticationResponse.java
│           ExtraHourDTO.java
│           ExtraHourValidationDTO.java
│           GroupDTO.java
│           UserDTO.java
│
├───exception
│       ExtraHourNotFoundException.java
│       GlobalExceptionHandler.java
│       InvalidVerificationCodeException.java
│       UserLockedException.java
│       UserNotFoundException.java
│
├───model
│       ExtraHour.java
│       ExtraHourStatus.java
│       ExtraHourType.java
│       Group.java
│       User.java
│       UserRole.java
│
├───repository
│       ExtraHourRepository.java
│       GroupRepository.java
│       UserRepository.java
│
├───security
│       CustomUserDetailsService.java
│       JwtAuthenticationFilter.java
│       JwtService.java
│       VerificationCodeAuthenticatorProvider.java
│       VerificationCodeAuthFilter.java
│
└───service
        AuthenticationService.java
        EmailService.java
        ExtraHourService.java
        ExtraHourTypeCalculator.java
        GroupService.java
        ReportService.java
        UserService.java
```

## Clases Principales y sus Responsabilidades

### Modelos (Entities)

- **User**:

  - Almacena información del usuario (ID, nombre, email, rol)
  - Gestiona códigos de verificación y su expiración
  - Controla intentos fallidos y bloqueo de cuenta

- **ExtraHour**:

  - Registra las horas extra (fecha inicio, fecha fin, tipo)
  - Calcula automáticamente la duración
  - Maneja el estado de aprobación
  - Valida límites de horas permitidas

- **Group**:
  - Gestiona grupos de trabajo
  - Relaciona líderes con empleados
  - Mantiene la estructura organizacional

### Servicios

- **AuthenticationService**:

  - Genera y valida códigos de verificación
  - Gestiona el proceso de autenticación
  - Controla bloqueo de cuentas
  - Maneja la emisión de tokens JWT

- **EmailService**:

  - Envía códigos de verificación
  - Maneja la configuración de correo
  - Asegura la entrega de códigos

- **ExtraHourService**:

  - Procesa registros de horas extra
  - Aplica reglas de negocio y validaciones
  - Calcula tipos de hora según horarios
  - Gestiona aprobaciones y rechazos

- **GroupService**:
  - Administra la creación y modificación de grupos
  - Gestiona asignación de líderes
  - Maneja la relación líder-empleados

### Controladores

- **AuthenticationController**:

  - Expone endpoints de autenticación
  - Maneja envío y verificación de códigos
  - Gestiona respuestas de autenticación

- **ExtraHourController**:

  - Procesa solicitudes de registro de horas
  - Maneja listados y consultas
  - Gestiona aprobaciones/rechazos

- **GroupController**:
  - Administra operaciones de grupos
  - Controla asignaciones
  - Gestiona permisos por rol

### Seguridad

- **JwtService**:

  - Genera tokens JWT
  - Valida tokens en peticiones
  - Maneja la seguridad de la sesión

- **JwtAuthenticationFilter**:
  - Intercepta y valida peticiones
  - Verifica tokens JWT
  - Establece el contexto de seguridad

## Roles y Permisos

### EMPLEADO

- Recibe código de verificación
- Registra horas extra
- Consulta su historial
- Modifica horas pendientes

### TEAM_LEADER

- Acceso al historial de su grupo
- Aprueba/Rechaza horas extra
- Visualiza reportes de su grupo

### MASTER

- Gestiona usuarios y grupos
- Asigna líderes
- Acceso a todos los reportes
- Administra el sistema

## Configuración del Proyecto

1. Requisitos:

   - Java 17
   - MySQL
   - Maven

2. Configuración de Base de Datos:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/extrahours
   spring.datasource.username=grupo4
   spring.datasource.password=grupo4
   ```

## Ejecución

```bash
# Clonar el repositorio
git clone [URL_REPOSITORIO]

# Navegar al directorio
cd backend

# Instalar dependencias
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

## Endpoints Principales

- `POST /api/auth/send-code`: Enviar código de verificación
- `POST /api/auth/verify`: Verificar código y obtener token
- `POST /api/extra-hours`: Registrar hora extra
- `GET /api/extra-hours`: Listar horas extra
- `PUT /api/extra-hours/{id}/approve`: Aprobar hora extra
- `PUT /api/extra-hours/{id}/reject`: Rechazar hora extra

## Estado del Proyecto

Proyecto académico en desarrollo, versión MVP.

# Manual de Usuario

## Uso del Sistema

### Inicio de Sesión
1. Ingresa tu cédula (ID).
2. Recibe un código de verificación en tu correo.
3. Introduce el código para iniciar sesión.

### Registro de Horas Extra
1. Accede a la sección de horas extra.
2. Completa el formulario con la fecha y duración.
3. Envía el registro para aprobación.

### Generación de Reportes
1. Accede a la sección de reportes.
2. Genera informes detallados según los filtros deseados.

---

# User Manual

## System Usage

### Login
1. Enter your ID.
2. Receive a verification code in your email.
3. Enter the code to log in.

### Overtime Registration
1. Access the overtime section.
2. Complete the form with the date and duration.
3. Submit the entry for approval.

### Report Generation
1. Access the report section.
2. Generate detailed reports based on desired filters.

