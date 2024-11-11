import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Paginacion } from 'src/common/paginacion';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, userId: number) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  
  getWholeList() {
    return this.prisma.product.findMany();
  }
  

  async findAll(page: number, pageSize: number): Promise<Paginacion<{id: number; name: string; description: string; price: number }>> 
  {
    const skip = (page - 1) * pageSize;
    const [productos, total] = await Promise.all([
        this.prisma.product.findMany({
            skip,
            take: pageSize,
        }),
        this.prisma.product.count(),
    ]);

    return {
      productsList: productos,
      totalCount: total
    }
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) 
  {
    const producto = await this.findOne(id);
    if (!producto) 
      {
      throw new NotFoundException('No se pudo encontrar el producto');
      }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) 
  {
    const producto = await this.findOne(id);
    if (!producto) 
      {
      throw new NotFoundException('No se pudo encontrar el producto');
      }

    return this.prisma.product.delete({ where: { id } });
  }
}