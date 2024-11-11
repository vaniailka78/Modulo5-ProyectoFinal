
# Proyecto Final Modulo 5

Este repositorio contiene los repositorios del backend y del frontend de la Galería de Productos con Next.js.

## Instalación

Sigue los pasos a continuación para instalar y ejecutar la aplicación:

1. Clonar el repositorio:
    ```bash
    git clone git https://github.com/vaniailka78/Modulo5-ProyectoFinal.git
    cd Modulo5-ProyectoFinal
    ```
2. Preparar el backend: Desde la carpeta Modulo5-ProyectoFinal
    ```bash
   cd nestjs-product-gallery
   npm install
    ```
3. Correr las pruebas del backend
    ```bash
   npm runtest:unitarias
   npm runtest:unitariasController
   npm runtest:integracion
   npm runtest:aceptacion
    ```
4. Correr el servidor en http://localhost:3000
    ```bash
   npm run start
    ```
5. Para el frontend: Desde la carpeta Modulo5-ProyectoFinal
    ```bash
   cd proyecto-final-galeria-productos
   npm install
    ```
6. Correr el frontend en http://localhost:5050
    ```bash
   npm run build
   npm run start
    ```
7. Correr las pruebas del frontend
    ```bash
   npx cypress open
    ```
8. Elegir las pruebas E2E en el Cypress
