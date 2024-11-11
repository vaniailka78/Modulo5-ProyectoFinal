import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Request() req) {
      const user: User = req.user;  // Obtener el usuario del request
      const newUser = this.userService.createUser(createUserDto.email, createUserDto.password, user.id);
      return newUser;
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    findAll()
    {
      return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.update(+id, updateUserDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.userService.remove(+id);
    }

}
