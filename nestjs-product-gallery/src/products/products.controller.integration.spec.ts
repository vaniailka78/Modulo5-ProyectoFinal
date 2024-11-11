import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { LoginDto } from 'src/auth/dto/login.dto';
import * as request from 'supertest';

describe('ProductsController  (Integration)', () => {
    let app: INestApplication;
    let token: string;
    let newProduct: Product;
    let numProductos: number;

    const errorUnauthorized = { 
        message: 'Unauthorized', 
        statusCode: 401 };

    const errorProductNotFound = {
        message: 'No se pudo encontrar el producto',
        error: 'Not Found',
        statusCode: 404
      }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
  
      });
    
      afterAll(async () => {
        await app.close();
      });

    //Obtenemos el token, esta prueba esta en las pruebas de integracion de Auth, por eso solo se la copio aqui
    it('Integracion 3: /auth/login Hacer log-in con el usuario con id: 1, password correcto', async() => {
        const logindto : LoginDto = {
            email: 'user1@example.com',
            password: 'password123'
        }

        const resultado = await request(app.getHttpServer())
        .post('/auth/login')
        .send(logindto)

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        token = respuesta.access_token;
        expect(token).not.toBeNull();
    });

    it('Integracion 16: /products/all Listar los productos antes de iniciar test', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/products/all')

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        numProductos = respuesta.length;
        expect(numProductos).toBeGreaterThan(-1);
    });

    it('Integracion 17: /products Crear un producto', async() => {
        const producto1: CreateProductDto = {  
        name: 'Producto 1',
        description: "Descripcion producto de prueba",
        price: 22.5
        }

        const resultado = await request(app.getHttpServer())
        .post('/products')
        .send(producto1)
        .auth(token, {type: "bearer"})

        newProduct = resultado.body
        expect(newProduct).toBeDefined();
        
        expect(newProduct.name).toEqual(producto1.name);
        expect(newProduct.description).toEqual(producto1.description);
        expect(newProduct.price).toEqual(producto1.price);
        expect(newProduct.id).toBeGreaterThan(0);
        expect(newProduct.userId).toEqual(1);
        expect(newProduct.createdAt).toEqual(newProduct.updatedAt);
    });

    it('Integracion 18: /products/all Listar los productos despues de añadir uno', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/products/all')

        const listaProductos = resultado.body
        expect(listaProductos).toBeDefined();
        const num = listaProductos.length;
        expect(num).toEqual(numProductos + 1);
        numProductos = num;
        expect(numProductos).toBeGreaterThan(0);
    });
  
    it('Integracion 19: /products/:id Listar el producto que se acaba de añadir', async() => {
        const resultado = await request(app.getHttpServer())
        .get(`/products/${newProduct.id}`)

        const productonuevo = resultado.body
        expect(productonuevo).toBeDefined();
        expect(productonuevo.id).toEqual(newProduct.id);
        expect(productonuevo.name).toEqual(newProduct.name);
        expect(productonuevo.description).toEqual(newProduct.description);
        expect(productonuevo.price).toEqual(newProduct.price);
        expect(productonuevo.userId).toEqual(newProduct.userId);
        expect(productonuevo.createdAt).toEqual(newProduct.createdAt);
        expect(productonuevo.updatedAt).toEqual(newProduct.updatedAt);
    
        newProduct = productonuevo;
    });
  
    it('Integracion 20: /products/:id Modificar el producto que se acaba de añadir', async() => {
        const producto2: UpdateProductDto = {  
            name: 'Producto 1 MOD',
            description: "Descripcion producto de prueba modificado",
            price: 99.99
        }

        const resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct.id}`)
        .send(producto2)
        .auth(token, {type: "bearer"})
  
        const productomodificado = resultado.body;
        expect(productomodificado).toBeDefined();
    
        expect(productomodificado.id).toEqual(newProduct.id);
        expect(productomodificado.name).toEqual(producto2.name);
        expect(productomodificado.description).toEqual(producto2.description);
        expect(productomodificado.price).toEqual(producto2.price);
        expect(productomodificado.userId).toEqual(newProduct.userId);
        expect(productomodificado.createdAt).toEqual(newProduct.createdAt);
        expect(productomodificado.updatedAt).not.toEqual(newProduct.updatedAt);
    
        newProduct = productomodificado;
    });
  
    it('Integracion 21: /products/:id MEliminar el producto que se acaba de modificar', async() => {
        const resultado = await request(app.getHttpServer())
        .delete(`/products/${newProduct.id}`)
        .auth(token, {type: "bearer"})

        const productoeliminado = resultado.body;
        expect(productoeliminado).toBeDefined();
    });

    it('Integracion 22: /products/all Listar los productos despues de eliminar uno', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/products/all')

        const listaProductos = resultado.body
        expect(listaProductos).toBeDefined();
        const num = listaProductos.length;
        expect(num).toEqual(numProductos - 1);
        numProductos = num;
        expect(numProductos).toBeGreaterThan(0);
    });
  
    it('Integracion 23: /products Listar los productos paginados', async() => {
      const hayProductos = Boolean(numProductos);
      if (!hayProductos)
      {
        expect(numProductos).toEqual(0);
      }
      else
      {
        const numpagina = (numProductos > 5) ? 2 : 1;
        const tampagina = 5;

        const resultado = await request(app.getHttpServer())
        .get('/products')
        .query({'page': numpagina, 'pageSize': tampagina})

        const listaProductos = resultado.body;
        expect(listaProductos).toBeDefined();
        expect(listaProductos.totalCount).toEqual(numProductos);
        expect(listaProductos.productsList.length).toBeLessThanOrEqual(5);
      }
    });
  
    it('Integracion 24: /products/:id Modificar un producto que no existe', async() => {
        const producto3: UpdateProductDto = {  
            name: 'Producto 2 MOD',
            description: "Descripcion producto de prueba modificado",
            price: 22.001
        }
    
        const resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct.id}`)
        .send(producto3)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toEqual(errorProductNotFound);
    });
  
    it('Integracion 25: /products/:id Eliminar un producto que no existe', async() => {
        const resultado = await request(app.getHttpServer())
        .delete(`/products/${newProduct.id}`)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body;
        expect(respuesta).toEqual(errorProductNotFound);
    });
    
    it('Integracion 26: /products No se deben hacer operaciones CRUD sin autorizacion (salvo las de listado)', async() => {
        
        //Añadir producto
        const producto1: CreateProductDto = {  
            name: 'Producto 1',
            description: "Descripcion producto de prueba",
            price: 22.5
            }

        let resultado = await request(app.getHttpServer())
        .post('/products')
        .send(producto1)
        let respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Modificar producto
        const producto2: UpdateProductDto = {  
            name: 'Producto 1 MOD',
            description: "Descripcion producto de prueba modificado",
            price: 99.99
        }
  
        resultado = await request(app.getHttpServer())
        .patch(`/products/${newProduct.id}`)
        .send(producto2)
        respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Borrar producto
        resultado = await request(app.getHttpServer())
        .delete(`/products/${newProduct.id}`)
      });
});