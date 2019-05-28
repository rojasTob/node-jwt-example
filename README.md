### Ejemplo de Node Authentication

- instalar postman o cualquier cliente para probar el API
- crear una database en mongo atlas (sandbox for free), crear el user y copiar el string de conexion a la bdd
- ir a la carpeta del proyecto
- npm install
- npm install -g nodemon
- nodemon server.js

#### Rutas

- http://localhost:8080/setup (crea un usuario)
- http://localhost:8080/api/autenthicate (busca un usuario, si existe y password es correcto crea token)
- http://localhost:8080/api/ (muestra un mensaje de bienvenida si el token es valido)
- http://localhost:8080/api/users (devuelve todos los usuarios si el token es valido)
