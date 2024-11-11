import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { connect } from 'http2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string, userId: number) {
    const admin = await this.findById(userId);
    if (!admin) 
      {
      throw new NotFoundException('No se pudo encontrar el usuario');
      }

    const usuario = await this.findByEmail(email);
    if (usuario) 
      {
      throw new BadRequestException('Ese usuario ya esta registrado');
      }
      
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll()
  {
    return this.prisma.user.findMany();
  }

  findOne(id: number) 
  {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) 
  {
    const usuario = await this.findById(id);
    if (!usuario) 
      {
      throw new NotFoundException('No se pudo encontrar el usuario');
      }

    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async remove(id: number) 
  {
    const usuario = await this.findById(id);
    if (!usuario) 
      {
      throw new NotFoundException('No se pudo encontrar el usuario');
      }

    return this.prisma.user.delete({ where: { id } });
  }
}