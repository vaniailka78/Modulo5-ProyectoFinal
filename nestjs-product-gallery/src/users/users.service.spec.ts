import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let newUser: User;
  let userid: number;
  let numUsers: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Unitaria 16: El servicio deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Unitaria 17: Listar los usuarios antes de iniciar test', async() => {
    const listaUsuarios = await service.findAll();
    expect(listaUsuarios).toBeDefined();
    numUsers = listaUsuarios.length;
    expect(numUsers).toBeGreaterThan(-1);
  });

  it('Unitaria 18: Crear un usuario', async() => {
    const userNuevo: CreateUserDto = {  
      email: 'mailde@ejemplo.test.com',
      password: "clave_UsuarioPru384",
    }
    userid = 1;
    newUser = await service.createUser(userNuevo.email, userNuevo.password, userid);
    expect(newUser).toBeDefined();
    
    expect(newUser.id).toBeGreaterThan(0);
    expect(newUser.email).toEqual(userNuevo.email);
    
    const esigual = await bcrypt.compare(userNuevo.password, newUser.password);
    expect(esigual).toBe(true);
  });

  it('Unitaria 19: Listar los usuarios despues de añadir uno', async() => {
    const listaUsuarios = await service.findAll();
    expect(listaUsuarios).toBeDefined();
    const num = listaUsuarios.length;
    expect(num).toEqual(numUsers + 1);
    numUsers = num;
    expect(numUsers).toBeGreaterThan(0);
  });

  it('Unitaria 20: Listar el usuario que se acaba de añadir', async() => {
    const usuario = await service.findOne(newUser.id);
    expect(usuario).toBeDefined();
    expect(usuario.id).toEqual(newUser.id);
    expect(usuario.email).toEqual(newUser.email);
    expect(usuario.password).toEqual(newUser.password);

    newUser = usuario;
  });

  it('Unitaria 21: Listar el usuario que se acaba de añadir, por su email', async() => {
    const usuario = await service.findByEmail(newUser.email);
    expect(usuario).toBeDefined();
    expect(usuario.id).toEqual(newUser.id);
    expect(usuario.email).toEqual(newUser.email);
    expect(usuario.password).toEqual(newUser.password);
  });

  it('Unitaria 22: Modificar el usuario que se acaba de añadir', async() => {
    const usuarioMod: UpdateUserDto = {  
      email: 'mailMODIFICADOde@ejemplo.test.com',
      password: "Nuevaclave_UsuarioPru384",
    }

    const usuariomodificado = await service.update(newUser.id, usuarioMod);
    expect(usuariomodificado).toBeDefined();

    expect(usuariomodificado.id).toEqual(newUser.id);
    expect(usuariomodificado.email).toEqual(usuarioMod.email);

    const esigual = await bcrypt.compare(usuarioMod.password, usuariomodificado.password);
    expect(esigual).toBe(true);

    newUser = usuariomodificado;
  });

  it('Unitaria 23: Listar el usuario que se acaba de modificar, por su email', async() => {
    const usuario = await service.findByEmail(newUser.email);
    expect(usuario).toBeDefined();
    expect(usuario.id).toEqual(newUser.id);
    expect(usuario.email).toEqual(newUser.email);
    expect(usuario.password).toEqual(newUser.password);
  });

  it('Unitaria 24: Eliminar el usuario que se acaba de modificar', async() => {
    const usuariuoeliminado = await service.remove(newUser.id);
    expect(usuariuoeliminado).toBeDefined();
  });

  it('Unitaria 25: Listar los usuarios despues de eliminar uno', async() => {
    const listaUsuarios = await service.findAll();
    expect(listaUsuarios).toBeDefined();
    const num = listaUsuarios.length;
    expect(num).toEqual(numUsers - 1);
    numUsers = num;
    expect(numUsers).toBeGreaterThan(-1);
  });

  it('Unitaria 26: Modificar un usuario que no existe', async() => {
    const usuarioMod: UpdateUserDto = {  
      email: 'mailMODIFICADOde@ejemplo.test.com',
      password: "Nuevaclave_UsuarioPru384",
    }

    expect(() => service.update(-1, usuarioMod)).rejects.toThrow(NotFoundException);
  });

  it('Unitaria 27: Eliminar un usuario que no existe', async() => {
    expect(() => service.remove(-1)).rejects.toThrow(NotFoundException);
  });

  it('Unitaria 28: Crear un usuario con un email ya registrado', async() => {
    const userNuevo: CreateUserDto = {  
      email: 'user1@example.com',
      password: "clave_UsuarioPru384",
    }
    userid = 1;

    expect(() => service.createUser(userNuevo.email, userNuevo.password, userid)).rejects.toThrow(BadRequestException);
  });

});
