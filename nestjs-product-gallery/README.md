
# Product Gallery API

Esta es una API para gestionar una galería de productos utilizando NestJS, Prisma, SQLite y JWT para la autenticación. La API permite crear, leer, actualizar y eliminar productos, con rutas protegidas para la creación y edición de productos.

## Requisitos

- Node.js (versión 20 o superior)
- npm (versión 10 o superior)

## Instalación

Sigue los pasos a continuación para instalar y ejecutar la aplicación:

1. Instalar las dependencias:
    ```bash
    npm install
    ```

2. Configurar el archivo `.env`:
    - Crea un archivo `.env` en el directorio raíz del proyecto y agrega las siguientes líneas:
      ```plaintext
      JWT_SECRET=your_jwt_secret_key
      PORT=3000
      NEXT_JS_URL=http://localhost:5050
      REVALIDATION_TOKEN=tu_token_secreto_aqui
      ```

3. Configurar Prisma:
    - Asegúrate de que el archivo `prisma/.env` contenga la URL de la base de datos apuntando a `file:./dev.db`.

4. Inicializar la base de datos:
    ```bash
    npx prisma migrate dev --name init
    ```

5. Ejecutar el script de seed para agregar datos de prueba:
    ```bash
    npm run seed
    ```

6. Iniciar la aplicación:
    ```bash
    npm run start:dev
    ```

7. Acceder a la documentación de la API:
    - Abre tu navegador y navega a `http://localhost:3000/api` para ver la documentación de Swagger.
## Uso

### Autenticación

La API utiliza JWT para la autenticación. Para acceder a las rutas protegidas, primero debes iniciar sesión y obtener un token.

#### Registro de usuario
```bash
POST /api/auth/register
```
Cuerpo de la solicitud:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Inicio de sesión
```bash
POST /api/auth/login
```
Cuerpo de la solicitud:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
Respuesta:
```json
{
  "access_token": "your_jwt_token"
}
```

### Gestión de productos

#### Crear producto
```bash
POST /api/products
```
Encabezados:
```plaintext
Authorization: Bearer your_jwt_token
```
Cuerpo de la solicitud:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99
}
```

#### Obtener todos los productos
```bash
GET /api/products
```

#### Obtener un producto por ID
```bash
GET /api/products/:id
```

#### Actualizar producto
```bash
PATCH /api/products/:id
```
Encabezados:
```plaintext
Authorization: Bearer your_jwt_token
```
Cuerpo de la solicitud:
```json
{
  "name": "Updated Product Name",
  "description": "Updated Product Description",
  "price": 149.99
}
```

#### Eliminar producto
```bash
DELETE /api/products/:id
```
Encabezados:
```plaintext
Authorization: Bearer your_jwt_token
```
