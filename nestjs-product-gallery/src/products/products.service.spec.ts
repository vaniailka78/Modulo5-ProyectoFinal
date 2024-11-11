import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';


describe('ProductsService', () => {
  let service: ProductsService;
  let newProduct: Product;
  let userid: number;
  let numProductos: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

  });

  it('Unitaria 4: El servicio deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Unitaria 5: Listar los productos antes de iniciar test', async() => {
    const listaProductos = await service.getWholeList();
    expect(listaProductos).toBeDefined();
    numProductos = listaProductos.length;
    expect(numProductos).toBeGreaterThan(-1);
  });

  it('Unitaria 6: Crear un producto', async() => {
  const producto1: CreateProductDto = {  
    name: 'Producto 1',
    description: "Descripcion producto de prueba",
    price: 10.5
  }
  userid = 1;
  newProduct = await service.create(producto1, userid);
  expect(newProduct).toBeDefined();
  
  expect(newProduct.name).toEqual(producto1.name);
  expect(newProduct.description).toEqual(producto1.description);
  expect(newProduct.price).toEqual(producto1.price);
  });

  it('Unitaria 7: Revisión de datos del producto creado', () => {
    expect(newProduct).toBeDefined();
    expect(newProduct.id).toBeGreaterThan(0);
    expect(newProduct.userId).toEqual(userid);
    expect(newProduct.createdAt).toEqual(newProduct.updatedAt);
  });

  it('Unitaria 8: Listar los productos despues de añadir uno', async() => {
    const listaProductos = await service.getWholeList();
    expect(listaProductos).toBeDefined();
    const num = listaProductos.length;
    expect(num).toEqual(numProductos + 1);
    numProductos = num;
    expect(numProductos).toBeGreaterThan(0);
  });

  it('Unitaria 9: Listar el producto que se acaba de añadir', async() => {
    const productonuevo = await service.findOne(newProduct.id);
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

  it('Unitaria 10: Modificar el producto que se acaba de añadir', async() => {
    const producto2: UpdateProductDto = {  
      name: 'Producto 1 MOD',
      description: "Descripcion producto de prueba modificado",
      price: 99.99
    }

    const productomodificado = await service.update(newProduct.id, producto2);
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

  it('Unitaria 11: Eliminar el producto que se acaba de modificar', async() => {
    const productoeliminado = await service.remove(newProduct.id);
    expect(productoeliminado).toBeDefined();
  });

  it('Unitaria 12: Listar los productos despues de eliminar uno', async() => {
    const listaProductos = await service.getWholeList();
    expect(listaProductos).toBeDefined();
    const num = listaProductos.length;
    expect(num).toEqual(numProductos - 1);
    numProductos = num;
    expect(numProductos).toBeGreaterThan(-1);
  });

  it('Unitaria 13: Listar los productos paginados', async() => {
    const hayProductos = Boolean(numProductos);
    if (!hayProductos)
    {
      expect(service).toBeDefined();
    }
    else
    {
      const numpagina = (numProductos > 5) ? 2 : 1;
      const tampagina = 5;
      const listaProductos = await service.findAll(numpagina, tampagina);
      expect(listaProductos).toBeDefined();
      expect(listaProductos.totalCount).toEqual(numProductos);
      expect(listaProductos.productsList.length).toBeLessThanOrEqual(5);
    }
  });

  it('Unitaria 14: Modificar un producto que no existe', async() => {
    const producto3: UpdateProductDto = {  
      name: 'Producto 2 MOD',
      description: "Descripcion producto de prueba modificado",
      price: 22.001
    }

    expect(() => service.update(-1, producto3)).rejects.toThrow(NotFoundException);
  });

  it('Unitaria 15: Eliminar un producto que no existe', async() => {
    expect(() => service.remove(-1)).rejects.toThrow(NotFoundException);
  });

});
