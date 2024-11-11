import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import { AppModule } from "src/app.module";
import { LoginDto } from "src/auth/dto/login.dto";
import * as request from 'supertest';
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from "./dto/update-user.dto";

describe('UsersController (Integration)', () => {
    let app: INestApplication;
    let token: string;
    let newUser: User;
    let numUsers: number;

    const errorUnauthorized = { 
        message: 'Unauthorized', 
        statusCode: 401 };

    const errorUserNotFound = {
        message: 'No se pudo encontrar el usuario',
        error: 'Not Found',
        statusCode: 404
      }
    
    const errorAlreadyRegisteredUser = {
        message: 'Ese usuario ya esta registrado',
        error: 'Bad Request',
        statusCode: 400
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

    it('Integracion 5: /users Listar los usuarios antes de iniciar test', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/users')
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        numUsers = respuesta.length;
        expect(numUsers).toBeGreaterThan(-1);
      });

      it('Integracion 6: /users Crear un usuario', async() => {
        const userNuevo: CreateUserDto = {  
          email: 'integracionmailde@ejemplo.test.com',
          password: "clave_UsuarioPru384",
        }

        const resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();

        newUser = respuesta;
        expect(newUser.id).toBeGreaterThan(0);
        expect(newUser.email).toEqual(userNuevo.email);
        
        const esigual = await bcrypt.compare(userNuevo.password, newUser.password);
        expect(esigual).toBe(true);
      });

      it('Integracion 7: /users Listar los usuarios despues de añadir uno', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/users')
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        const num = respuesta.length;
        expect(num).toEqual(numUsers + 1);
        numUsers = num;
        expect(numUsers).toBeGreaterThan(0);
      });

      it('Integracion 8: /users/:id Listar el usuario que se acaba de añadir', async() => {
        const resultado = await request(app.getHttpServer())
        .get(`/users/${newUser.id}`)
        .auth(token, {type: "bearer"})

        const usuario = resultado.body
        expect(usuario).toBeDefined();
        expect(usuario.id).toEqual(newUser.id);
        expect(usuario.email).toEqual(newUser.email);
        expect(usuario.password).toEqual(newUser.password);
    
        newUser = usuario;
      });

      it('Integracion 9: /users/:id Modificar el usuario que se acaba de añadir', async() => {
        const usuarioMod: UpdateUserDto = {  
          email: 'otromailMODIFICADOde@ejemplo.test.com',
          password: "Nuevaclave_UsuarioPru384",
        }

        const resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser.id}`)
        .send(usuarioMod)
        .auth(token, {type: "bearer"})
    
        const usuariomodificado = resultado.body
        expect(usuariomodificado).toBeDefined();
    
        expect(usuariomodificado.id).toEqual(newUser.id);
        expect(usuariomodificado.email).toEqual(usuarioMod.email);
    
        const esigual = await bcrypt.compare(usuarioMod.password, usuariomodificado.password);
        expect(esigual).toBe(true);
    
        newUser = usuariomodificado;
      });

      it('Integracion 10: /users/:id Eliminar el usuario que se acaba de modificar', async() => {
        const resultado = await request(app.getHttpServer())
        .delete(`/users/${newUser.id}`)
        .auth(token, {type: "bearer"})

        const usuariuoeliminado = resultado.body
        expect(usuariuoeliminado).toBeDefined();
      });

      it('Integracion 11: /users Listar los usuarios despues de eliminar uno', async() => {
        const resultado = await request(app.getHttpServer())
        .get('/users')
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        const num = respuesta.length;
        expect(num).toEqual(numUsers - 1);
        numUsers = num;
        expect(numUsers).toBeGreaterThan(-1);
      });

      it('Integracion 12: /users/:id Modificar un usuario que no existe', async() => {
        const usuarioMod: UpdateUserDto = {  
          email: 'mailMODIFICADOde@ejemplo.test.com',
          password: "Nuevaclave_UsuarioPru384",
        }

        const resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser.id}`)
        .send(usuarioMod)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body
        expect(respuesta).toEqual(errorUserNotFound);
      });

      it('Integracion 13: /users/:id Eliminar un usuario que no existe', async() => {
        const resultado = await request(app.getHttpServer())
        .delete(`/users/${newUser.id}`)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body;
        expect(respuesta).toEqual(errorUserNotFound);
      });

      it('Integracion 14: /users Crear un usuario con un email ya registrado', async() => {
        const userNuevo: CreateUserDto = {  
            email: 'user1@example.com',
            password: "clave_UsuarioPru384",
          }

        const resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo)
        .auth(token, {type: "bearer"})

        const respuesta = resultado.body;
        expect(respuesta).toEqual(errorAlreadyRegisteredUser);
      });

      it('Integracion 15: /users No se deben hacer operaciones CRUD sin autorizacion', async() => {
        
        //Añadir usuario
        const userNuevo: CreateUserDto = {  
            email: 'testuser@example.com',
            password: "clave_UsuarioPru384",
          }

        let resultado = await request(app.getHttpServer())
        .post('/users')
        .send(userNuevo)
        let respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Listar usuarios
        resultado = await request(app.getHttpServer())
        .get('/users')
        respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Listar un usuario
        resultado = await request(app.getHttpServer())
        .get(`/users/${newUser.id}`)
        respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Modificar usuario
        const usuarioMod: UpdateUserDto = {  
            email: 'mailMODIFICADOde@ejemplo.test.com',
            password: "Nuevaclave_UsuarioPru384",
          }
  
        resultado = await request(app.getHttpServer())
        .patch(`/users/${newUser.id}`)
        .send(usuarioMod)
        respuesta = resultado.body;
        expect(respuesta).toEqual(errorUnauthorized);

        //Borrar usuario
        resultado = await request(app.getHttpServer())
        .delete(`/users/${newUser.id}`)
      });
});