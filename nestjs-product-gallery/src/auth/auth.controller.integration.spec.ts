import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { LoginDto } from "./dto/login.dto";
import * as request from 'supertest';

    describe('AuthController (Integration)', () => {
    let app: INestApplication;
    const errorMessage = { message: 'Unauthorized', statusCode: 401 };
  
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

    it('Integracion 1: /auth/validar Validar el usuario con id: 1, password correcto', async() => {
        const logindto : LoginDto = {
          email: 'user1@example.com',
          password: 'password123'
        }
    
        const payload = { id: 1, email: logindto.email};

        const resultado = await request(app.getHttpServer())
        .post('/auth/validar')
        .send(logindto)

        const respuesta = resultado.body
        expect(respuesta).toBeDefined()
        expect(respuesta).toEqual(payload);
      });

      it('Integracion 2: /auth/validar Validar el usuario con id: 1, password incorrecto', async() => {
        const logindto : LoginDto = {
          email: 'user1@example.com',
          password: 'no es el password'
        }
    
        const resultado = await request(app.getHttpServer())
        .post('/auth/validar')
        .send(logindto)

        const respuesta = resultado.body;
        expect(respuesta).toEqual(errorMessage);
      });

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
        const token = respuesta.access_token;
        expect(token).not.toBeNull();
      });

      it('Integracion 4: /auth/login Hacer log-in con el usuario con id: 1, password incorrecto', async() => {
        const logindto : LoginDto = {
          email: 'user1@example.com',
          password: 'no es el password'
        }

        const resultado = await request(app.getHttpServer())
        .post('/auth/login')
        .send(logindto)

        const respuesta = resultado.body
        expect(respuesta).toBeDefined();
        expect(respuesta).toEqual(errorMessage);
      });
  });