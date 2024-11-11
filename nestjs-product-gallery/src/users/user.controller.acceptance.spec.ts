import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma.service";
import { LoginDto } from "src/auth/dto/login.dto";
import * as request from 'supertest';
import { Product, User } from "@prisma/client";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

describe('UsersController  (Aceptación)', () => {
    let app: INestApplication;
    let usersService: UsersService;
    let usersController: UsersController;

    let newUser1: User;
    let newUser2: User;
    let newUser3: User;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule =  await Test.createTestingModule({
        imports: [AppModule],
        providers: [UsersService, UsersController, PrismaService],
      }).compile()
  
      app = moduleFixture.createNestApplication()
      usersService= moduleFixture.get<UsersService>(UsersService)
      usersController = moduleFixture.get<UsersController>(UsersController)
  
      await app.init()
    });
  
    afterAll(async () => {
      await app.close()
    });

    //La tienda tiene nuevos clientes, deben ser registrados
    it('Aceptacion 4: Validar creación de varios usuarios', async () => {
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

        //Creamos el primer usuario y lo añadimos
        const userNuevo: CreateUserDto = {  
            email: 'usuario1.aceptacion@testeo.com',
            password: "clave_usuario1",
          }

        resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newUser1 = resultado.body

        //Creamos el segundo usuario y lo añadimos
        const userNuevo2: CreateUserDto = {  
            email: 'usuario2.aceptacion@testeo.com',
            password: "clave_usuario2",
          }

        resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo2)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newUser2 = resultado.body

        //Creamos el tercer usuario y lo añadimos
        const userNuevo3: CreateUserDto = {  
            email: 'usuario3.aceptacion@testeo.com',
            password: "clave_usuario3",
          }

        resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo3)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(201);
        expect(resultado.body).toBeDefined();

        newUser3 = resultado.body
    });

    //la tienda cambio de dominio, se deben actualizar los email de los usuarios
    it('Aceptacion 2: Validar modificacion de varios usuarios', async () => {
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

        //Cambiamos los datos del primer usuario
        const usuarioMod1: UpdateUserDto = {  
            email: 'usuario1.aceptacion@nuevo.testeo.com',
            password: "clave_usuario1",
          }

        resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser1.id}`)
        .send(usuarioMod1)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
        newUser1 = resultado.body;

        //Cambiamos los datos del segundo usuario
        const usuarioMod2: UpdateUserDto = {  
            email: 'usuario2.aceptacion@nuevo.testeo.com',
            password: "clave_usuario2",
          }

        resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser2.id}`)
        .send(usuarioMod2)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
        newUser2 = resultado.body;

        //Cambiamos los datos del tercer usuario
        const usuarioMod3: UpdateUserDto = {  
            email: 'usuario3.aceptacion@nuevo.testeo.com',
            password: "clave_usuario3",
          }

        resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser3.id}`)
        .send(usuarioMod3)
        .auth(token, {type: "bearer"})
        
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();
        newUser3 = resultado.body;
    });

    //Algunos clientes se dieron de baja, hay que borrar sus registros
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

        //Eliminamos el primer usuario
        resultado = await request(app.getHttpServer())
        .delete(`/users/${newUser1.id}`)
        .auth(token, {type: "bearer"})
 
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();

        //Eliminamos el segundo usuario
        resultado = await request(app.getHttpServer())
        .delete(`/users/${newUser2.id}`)
        .auth(token, {type: "bearer"})
 
        expect(resultado.status).toBe(200);
        expect(resultado.body).toBeDefined();

         //Eliminamos el tercer usuario
         resultado = await request(app.getHttpServer())
         .delete(`/users/${newUser3.id}`)
         .auth(token, {type: "bearer"})
  
         expect(resultado.status).toBe(200);
         expect(resultado.body).toBeDefined();
    });
})