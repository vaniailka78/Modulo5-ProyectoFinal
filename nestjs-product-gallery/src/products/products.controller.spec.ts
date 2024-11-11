import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let newProduct: Product;
  let numProductos: number;

  const authInfo = {
    user: {
      id: 1,
      email: 'user1@example.com',
      password: '$2a$10$nuCAatrveBtIcqi3BtRHHeBWjwz/amyxde9bKRGPc4cm9KC8PQ7ZG'
    }}; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ PrismaService, ProductsService],
      controllers: [ProductsController],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    controller = module.get<ProductsController>(ProductsController);
  });

  it('Unitaria en controlador 32: El controlador deberia estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Unitaria en controlador 33: Listar los productos antes de iniciar test', async() => {
    const listaProductos = await controller.getWholeList();
    expect(listaProductos).toBeDefined();
    numProductos = listaProductos.length;
    expect(numProductos).toBeGreaterThan(-1);
  });

  it('Unitaria en controlador 34: Crear un producto', async() => {
    const producto1: CreateProductDto = {  
      name: 'Producto 1',
      description: "Descripcion producto de prueba",
      price: 22.5
    }

    newProduct = await controller.create(producto1, authInfo);
    expect(newProduct).toBeDefined();
    
    expect(newProduct.name).toEqual(producto1.name);
    expect(newProduct.description).toEqual(producto1.description);
    expect(newProduct.price).toEqual(producto1.price);
    });
  
    it('Unitaria en controlador 35: Revisión de datos del producto creado', () => {
      expect(newProduct).toBeDefined();
      expect(newProduct.id).toBeGreaterThan(0);
      expect(newProduct.userId).toEqual(authInfo.user.id);
      expect(newProduct.createdAt).toEqual(newProduct.updatedAt);
    });
  
    it('Unitaria en controlador 36: Listar los productos despues de añadir uno', async() => {
      const listaProductos = await controller.getWholeList();
      expect(listaProductos).toBeDefined();
      const num = listaProductos.length;
      expect(num).toEqual(numProductos + 1);
      numProductos = num;
      expect(numProductos).toBeGreaterThan(0);
    });
  
    it('Unitaria en controlador 37: Listar el producto que se acaba de añadir', async() => {
      const prodID = String(newProduct.id);
      const productonuevo = await controller.findOne(prodID);
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
  
    it('Unitaria en controlador 38: Modificar el producto que se acaba de añadir', async() => {
      const producto2: UpdateProductDto = {  
        name: 'Producto 1 MOD',
        description: "Descripcion producto de prueba modificado",
        price: 99.99
      }
  
      const prodID = String(newProduct.id);
      const productomodificado = await controller.update(prodID, producto2);
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
  
    it('Unitaria en controlador 39: Eliminar el producto que se acaba de modificar', async() => {
      const prodID = String(newProduct.id);
      const productoeliminado = await controller.remove(prodID);
      expect(productoeliminado).toBeDefined();
    });
  
    it('Unitaria en controlador 40: Listar los productos despues de eliminar uno', async() => {
      const listaProductos = await controller.getWholeList();
      expect(listaProductos).toBeDefined();
      const num = listaProductos.length;
      expect(num).toEqual(numProductos - 1);
      numProductos = num;
      expect(numProductos).toBeGreaterThan(-1);
    });
  
    it('Unitaria en controlador 41: Listar los productos paginados', async() => {
      const hayProductos = Boolean(numProductos);
      if (!hayProductos)
      {
        expect(service).toBeDefined();
      }
      else
      {
        const numpagina = (numProductos > 5) ? 2 : 1;
        const tampagina = 5;
        const listaProductos = await controller.findAll(String(numpagina), String(tampagina));
        expect(listaProductos).toBeDefined();
        expect(listaProductos.totalCount).toEqual(numProductos);
        expect(listaProductos.productsList.length).toBeLessThanOrEqual(5);
      }
    });
  
    it('Unitaria en controlador 42: Modificar un producto que no existe', async() => {
      const producto3: UpdateProductDto = {  
        name: 'Producto 2 MOD',
        description: "Descripcion producto de prueba modificado",
        price: 22.001
      }
  
      expect(() => controller.update(String(-1), producto3)).rejects.toThrow(NotFoundException);
    });
  
    it('Unitaria en controlador 43: Eliminar un producto que no existe', async() => {
      expect(() => controller.remove(String(-1))).rejects.toThrow(NotFoundException);
    });
});
