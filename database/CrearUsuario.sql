USE extrahours;

-- Ejemplo de inserción de usuario con cédula como ID
INSERT INTO users (id, email, verification_code, role, active, failed_attempts, locked, name) 
VALUES (3102382586, 'usuario@amadeus.com', '123456', 'EMPLEADO', 1, 0, 0, 'Usuario Pruebas');