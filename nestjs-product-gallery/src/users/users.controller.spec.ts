import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let newUser: User;
  let numUsers: number;

  const authInfo = {
    user: {
      id: 1,
      email: 'user1@example.com',
      password: '$2a$10$nuCAatrveBtIcqi3BtRHHeBWjwz/amyxde9bKRGPc4cm9KC8PQ7ZG'
    }}; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('Unitaria en controlador 44: El controlador deberia estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Unitaria en controlador 45: Listar los usuarios antes de iniciar test', async() => {
    const listaUsuarios = await controller.findAll();
    expect(listaUsuarios).toBeDefined();
    numUsers = listaUsuarios.length;
    expect(numUsers).toBeGreaterThan(-1);
  });

  it('Unitaria en controlador 46: Crear un usuario', async() => {
    const userNuevo: CreateUserDto = {  
      email: 'otromailde@ejemplo.test.com',
      password: "clave_UsuarioPru384",
    }
    newUser = await controller.create(userNuevo, authInfo);
    expect(newUser).toBeDefined();
    
    expect(newUser.id).toBeGreaterThan(0);
    expect(newUser.email).toEqual(userNuevo.email);
    
    const esigual = await bcrypt.compare(userNuevo.password, newUser.password);
    expect(esigual).toBe(true);
  });

  it('Unitaria en controlador 47: Listar los usuarios despues de añadir uno', async() => {
    const listaUsuarios = await controller.findAll();
    expect(listaUsuarios).toBeDefined();
    const num = listaUsuarios.length;
    expect(num).toEqual(numUsers + 1);
    numUsers = num;
    expect(numUsers).toBeGreaterThan(0);
  });

  it('Unitaria en controlador 48: Listar el usuario que se acaba de añadir', async() => {
    const usuario = await controller.findOne(String(newUser.id));
    expect(usuario).toBeDefined();
    expect(usuario.id).toEqual(newUser.id);
    expect(usuario.email).toEqual(newUser.email);
    expect(usuario.password).toEqual(newUser.password);

    newUser = usuario;
  });

  it('Unitaria en controlador 49: Modificar el usuario que se acaba de añadir', async() => {
    const usuarioMod: UpdateUserDto = {  
      email: 'otromailMODIFICADOde@ejemplo.test.com',
      password: "Nuevaclave_UsuarioPru384",
    }

    const usuariomodificado = await controller.update(String(newUser.id), usuarioMod);
    expect(usuariomodificado).toBeDefined();

    expect(usuariomodificado.id).toEqual(newUser.id);
    expect(usuariomodificado.email).toEqual(usuarioMod.email);

    const esigual = await bcrypt.compare(usuarioMod.password, usuariomodificado.password);
    expect(esigual).toBe(true);

    newUser = usuariomodificado;
  });

  it('Unitaria en controlador 50: Eliminar el usuario que se acaba de modificar', async() => {
    const usuariuoeliminado = await controller.remove(String(newUser.id));
    expect(usuariuoeliminado).toBeDefined();
  });

  it('Unitaria en controlador 51: Listar los usuarios despues de eliminar uno', async() => {
    const listaUsuarios = await controller.findAll();
    expect(listaUsuarios).toBeDefined();
    const num = listaUsuarios.length;
    expect(num).toEqual(numUsers-1);
    numUsers = num;
    expect(numUsers).toBeGreaterThan(-1);
  });

  it('Unitaria en controlador 52: Modificar un usuario que no existe', async() => {
    const usuarioMod: UpdateUserDto = {  
      email: 'mailMODIFICADOde@ejemplo.test.com',
      password: "Nuevaclave_UsuarioPru384",
    }

    expect(() => controller.update('-1', usuarioMod)).rejects.toThrow(NotFoundException);
  });

  it('Unitaria en controlador 53: Eliminar un usuario que no existe', async() => {
    expect(() => controller.remove('-1')).rejects.toThrow(NotFoundException);
  });

  it('Unitaria en controlador 54: Crear un usuario con un email ya registrado', async() => {
    const userNuevo: CreateUserDto = {  
      email: 'user1@example.com',
      password: "clave_UsuarioPru384",
    }

    expect(() => controller.create(userNuevo, authInfo)).rejects.toThrow(BadRequestException);
  });

});
