import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@something.com',
    description: 'El correo electronico del usuario',
  })
  email: string;

  @ApiProperty({
    example: 'password%167AA',
    description: 'El password del usuario',
  })
  password: string;
}

