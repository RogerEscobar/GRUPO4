USE extrahours;

SELECT 
  email, 
  verification_code
FROM users
WHERE email IN ('empleado@example.com', 'lider@example.com', 'master@example.com');