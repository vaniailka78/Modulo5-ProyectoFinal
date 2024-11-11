import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ AuthService, UsersService, JwtService, PrismaService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('Unitaria en controlador 29: El controlador deberia estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Unitaria en controlador 30: Validar el usuario con id: 1, password correcto', async() => {
    const logindto : LoginDto = {
      email: 'user1@example.com',
      password: 'password123'
    }

    const payload = { id: 1, email: logindto.email};

    jest.spyOn(service, 'validateUser').mockImplementation(async () => payload);
    const result = await controller.validar(logindto);
    expect(result).toEqual(payload);
  });

  it('Unitaria en controlador 31: Validar el usuario con id: 1, password incorrecto', async() => {
    const logindto : LoginDto = {
      email: 'user1@example.com',
      password: 'no es el password'
    }

    jest.spyOn(service, 'validateUser').mockImplementation(async () => null);
    const result = await controller.validar(logindto);
    expect(result).toEqual(null);
  });
});
