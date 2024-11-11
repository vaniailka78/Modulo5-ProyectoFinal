import { INestApplication } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { ProductsController } from "./products.controller"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma.service";
import { LoginDto } from "src/auth/dto/login.dto";
import * as request from 'supertest';
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "@prisma/client";

describe('ProductsController  (Aceptación)', () => {
    let app: INestApplication;
    let productsService: ProductsService;
    let productsController: ProductsController;

    let newProduct1: Product;
    let newProduct2: Product;
    let newProduct3: Product;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule =  await Test.createTestingModule({
        imports: [AppModule],
        providers: [ProductsService, ProductsController, PrismaService],
      }).compile()
  
      app = moduleFixture.createNestApplication()
      productsService= moduleFixture.get<ProductsService>(ProductsService)
      productsController = moduleFixture.get<ProductsController>(ProductsController)
  
      await app.init()
    });
  
    afterAll(async () => {
      await app.close()
    });

    //Llegaron nuevos productos a la tienda, deben ser registrados
    it('Aceptacion 1: Validar creación de varios productos', async () => {
        //Primero hacer log-in
        const logindto : LoginDto = {
            email: 'user1@example.com',
            password: 'password123'
        }

        let resultado = await request(app.getHttpServer())
        .post('/auth/login')
        .send(logindto)

        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        let token = resultado.body.access_token;
        expect(token).not.toBeNull();

        //Creamos el primer producto y lo añadimos
        let productoNuevo: CreateProductDto = {  
        name: 'Producto de prueba',
        description: "Descripcion producto de prueba",
        price: 19.99
        }

        resultado = await request(app.getHttpServer())
        .post('/products')
        .send(productoNuevo)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newProduct1 = resultado.body
        expect(newProduct1).toBeDefined();
        
        expect(newProduct1.name).toEqual(productoNuevo.name);
        expect(newProduct1.description).toEqual(productoNuevo.description);
        expect(newProduct1.price).toEqual(productoNuevo.price);
        expect(newProduct1.id).toBeGreaterThan(0);
        expect(newProduct1.userId).toEqual(1);
        expect(newProduct1.createdAt).toEqual(newProduct1.updatedAt);

        //Creamos el segundo producto y lo añadimos
        let productoNuevo2: CreateProductDto = {  
            name: 'Producto de prueba 2',
            description: "Descripcion producto de prueba 2",
            price: 50.24
        }
 
        resultado = await request(app.getHttpServer())
        .post('/products')
        .send(productoNuevo2)
        .auth(token, {type: "bearer"})

        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newProduct2 = resultado.body
        expect(newProduct2).toBeDefined();
        
        expect(newProduct2.name).toEqual(productoNuevo2.name);
        expect(newProduct2.description).toEqual(productoNuevo2.description);
        expect(newProduct2.price).toEqual(productoNuevo2.price);
        expect(newProduct2.id).toBeGreaterThan(0);
        expect(newProduct2.userId).toEqual(1);
        expect(newProduct2.createdAt).toEqual(newProduct2.updatedAt);

        //Creamos el tercer producto y lo añadimos
        let productoNuevo3: CreateProductDto = {  
            name: 'Producto de prueba 3',
            description: "Descripcion producto de prueba 2",
            price: 1.75
        }
 
        resultado = await request(app.getHttpServer())
        .post('/products')
        .send(productoNuevo3)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newProduct3 = resultado.body
        expect(newProduct3).toBeDefined();
        
        expect(newProduct3.name).toEqual(productoNuevo3.name);
        expect(newProduct3.description).toEqual(productoNuevo3.description);
        expect(newProduct3.price).toEqual(productoNuevo3.price);
        expect(newProduct3.id).toBeGreaterThan(0);
        expect(newProduct3.userId).toEqual(1);
        expect(newProduct3.createdAt).toEqual(newProduct3.updatedAt);

        //Notamos que la descripcion del producto 3 es erronea, debemos cambiarla
        //Modificamos el producto 3
        const producto3: UpdateProductDto = {  
            name: 'Producto de prueba 3',
            description: "Descripcion producto de prueba 3",
            price: 1.75
        }

        resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct3.id}`)
        .send(producto3)
        .auth(token, {type: "bearer"})

        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
  
        const productomodificado = resultado.body;
        expect(productomodificado).toBeDefined();
    
        expect(productomodificado.id).toEqual(newProduct3.id);
        expect(productomodificado.name).toEqual(producto3.name);
        expect(productomodificado.description).toEqual(producto3.description);
        expect(productomodificado.price).toEqual(producto3.price);
        expect(productomodificado.userId).toEqual(newProduct3.userId);
        expect(productomodificado.createdAt).toEqual(newProduct3.createdAt);
        expect(productomodificado.updatedAt).not.toEqual(newProduct3.updatedAt);
    });

    //Cambio de temporada, se liquidaran los sobrantes, se deben cambiar los precios
    it('Aceptacion 2: Validar modificacion de varios productos', async () => {
        //Primero hacer log-in
        const logindto : LoginDto = {
            email: 'user1@example.com',
            password: 'password123'
        }

        let resultado = await request(app.getHttpServer())
        .post('/auth/login')
        .send(logindto)

        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        let token = resultado.body.access_token;
        expect(token).not.toBeNull();

        //Cambiamos el precio del primer producto
        const producto1: UpdateProductDto = {  
            name: 'Producto de prueba',
            description: "Descripcion producto de prueba",
            price: 15.24
        }

        resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct1.id}`)
        .send(producto1)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
  
        let productomodificado = resultado.body;
        expect(productomodificado).toBeDefined();
        expect(productomodificado.id).toEqual(newProduct1.id);
        expect(productomodificado.name).toEqual(producto1.name);
        expect(productomodificado.description).toEqual(producto1.description);
        expect(productomodificado.price).toEqual(producto1.price);
        expect(productomodificado.userId).toEqual(newProduct1.userId);
        expect(productomodificado.createdAt).toEqual(newProduct1.createdAt);
        expect(productomodificado.updatedAt).not.toEqual(newProduct1.updatedAt);
        newProduct1 = productomodificado;

        //Cambiamos el precio del segundo producto
        const producto2: UpdateProductDto = {  
            name: 'Producto de prueba 2',
            description: "Descripcion producto de prueba 2",
            price: 30.00
        }

        resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct2.id}`)
        .send(producto2)
        .auth(token, {type: "bearer"})

        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();

        productomodificado = resultado.body;
        expect(productomodificado).toBeDefined();
        expect(productomodificado.id).toEqual(newProduct2.id);
        expect(productomodificado.name).toEqual(producto2.name);
        expect(productomodificado.description).toEqual(producto2.description);
        expect(productomodificado.price).toEqual(producto2.price);
        expect(productomodificado.userId).toEqual(newProduct2.userId);
        expect(productomodificado.createdAt).toEqual(newProduct2.createdAt);
        expect(productomodificado.updatedAt).not.toEqual(newProduct2.updatedAt);
        newProduct2 = productomodificado;

        //Cambiamos el precio del tercer producto
        const producto3: UpdateProductDto = {  
            name: 'Producto de prueba 3',
            description: "Descripcion producto de prueba 3",
            price: 0.25
        }

        resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct3.id}`)
        .send(producto3)
        .auth(token, {type: "bearer"})

        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
  
        productomodificado = resultado.body;
        expect(productomodificado).toBeDefined();
    
        expect(productomodificado.id).toEqual(newProduct3.id);
        expect(productomodificado.name).toEqual(producto3.name);
        expect(productomodificado.description).toEqual(producto3.description);
        expect(productomodificado.price).toEqual(producto3.price);
        expect(productomodificado.userId).toEqual(newProduct3.userId);
        expect(productomodificado.createdAt).toEqual(newProduct3.createdAt);
        expect(productomodificado.updatedAt).not.toEqual(newProduct3.updatedAt);
        newProduct3 = productomodificado;
    });

    //Se agotaron las existencias, se deben borrar los productos agotados
    it('Aceptacion 3: Validar eliminación de varios productos', async () => {
        //Primero hacer log-in
        const logindto : LoginDto = {
            email: 'user1@example.com',
            password: 'password123'
        }

        let resultado = await request(app.getHttpServer())
        .post('/auth/login')
        .send(logindto)

        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        let token = resultado.body.access_token;
        expect(token).not.toBeNull();

        //Eliminamos el primer producto
        resultado = await request(app.getHttpServer())
        .delete(`/products/${newProduct1.id}`)
        .auth(token, {type: "bearer"})
 
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();

        //Eliminamos el segundo producto
        resultado = await request(app.getHttpServer())
        .delete(`/products/${newProduct2.id}`)
        .auth(token, {type: "bearer"})

        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();

         //Eliminamos el tercer producto
         resultado = await request(app.getHttpServer())
         .delete(`/products/${newProduct3.id}`)
         .auth(token, {type: "bearer"})
 
         expect(resultado.status).toBe(200);
         expect(resultado.body).toBeDefined();
    });
})