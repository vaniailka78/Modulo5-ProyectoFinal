
# Product Gallery FRONTEND

Esta es una app web para gestionar una galería de productos utilizando NextJs.

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
      NEXT_PUBLIC_API_URL=http://localhost:3000
      NEXT_JS_URL=http://localhost:5050
      REVALIDATION_TOKEN=tu_token_secreto_aqui
      PORT=3000
      ```

3. Iniciar la aplicación:
    ```bash
    npm run start:dev
    ```
