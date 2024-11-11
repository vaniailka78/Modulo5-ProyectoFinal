import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Unitaria 1: El servicio deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Unitaria 2: Validar el usuario con id: 1, password correcto', async() => {
    const emailU1 = "user1@example.com";
    const passwordU1 = "password123";
    const user = await service.validateUser(emailU1, passwordU1);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(user.email).toEqual(emailU1);
  });

  it('Unitaria 3: Validar el usuario con id: 1, password incorrecto', async() => {
    const emailU1 = "user1@example.com";
    const passwordU1 = "no es el password";
    const user = await service.validateUser(emailU1, passwordU1);
    expect(user).toEqual(null);
  });

});
