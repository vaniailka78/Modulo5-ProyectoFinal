import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import axios from "../config/axios";

   // Función para llamar a la API de revalidación de Next.js
   async function revalidatePage(path: string) {
    try {
      const revalidateUrl = `${process.env.NEXT_JS_URL}/api/revalidate?secret=${process.env.REVALIDATION_TOKEN}&path=${path}`;
      await axios.post(revalidateUrl);
      //console.log(`Revalidated path: ${path}`);
    } catch (error) {
      //console.error('Error revalidating:', error);
    }
  }

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const user: User = req.user;  // Obtener el usuario del request
    const newProduct = this.productsService.create(createProductDto, user.id);

    await revalidatePage ('/');
    return newProduct;
  }

  @Get('/all')
  getWholeList() {
    return this.productsService.getWholeList();
  }
  

  @Get()
  findAll
  (
    @Query('page') pageStr: string,
    @Query('pageSize') pageSizeStr: string,
  ) 
  {
    const page = parseInt(pageStr) || 1;
    const pageSize = parseInt(pageSizeStr) || 100;
    return this.productsService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const updatedProduct = this.productsService.update(+id, updateProductDto);
    
    await revalidatePage ('/');
    await revalidatePage(`/api/products/${id}`);
    return updatedProduct;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedProduct = this.productsService.remove(+id);

    await revalidatePage ('/');
    await revalidatePage(`/api/products/${id}`);
    return deletedProduct;
  }

}