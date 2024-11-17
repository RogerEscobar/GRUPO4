USE extrahours;

-- Crear usuario empleado
INSERT INTO users (id, email, verification_code, role, active, failed_attempts, locked, name) 
VALUES (123456789, 'empleado@example.com', '123456', 'EMPLEADO', 1, 0, 0, 'Empleado Ejemplo');

-- Crear usuario líder de equipo  
INSERT INTO users (id, email, verification_code, role, active, failed_attempts, locked, name)
VALUES (987654321, 'lider@example.com', '456789', 'TEAM_LEADER', 1, 0, 0, 'Lider Muestra');

-- Crear usuario master
INSERT INTO users (id, email, verification_code, role, active, failed_attempts, locked, name)
VALUES (555555555, 'master@example.com', '987654', 'MASTER', 1, 0, 0, 'Usuario Maestro');

-- Crear grupo de prueba
INSERT INTO user_groups (name, leader_id)
VALUES ('Grupo de Prueba', 2);

-- Crear hora extra de prueba
INSERT INTO extra_hours (employee_id, start_date_time, end_date_time, type, observations, hours)
VALUES (1, '2024-11-16 08:00:00', '2024-11-16 10:00:00', 'EXTRA_DIURNA', 'Hora extra de prueba', 2);