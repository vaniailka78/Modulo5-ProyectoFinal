import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'A detailed description of the product',
  })
  description: string;

  @ApiProperty({
    example: 99.99,
    description: 'The price of the product',
  })
  price: number;
}