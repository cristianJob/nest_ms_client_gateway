/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productClient.send({ cmd: 'remove_product' }, { id }).pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productClient.send({ cmd: 'update_product' }, { id, ...updateProductDto }) // { id, ...updateProductDto } crea un nuevo objeto combinando id y las propiedades de updateProductDto
    .pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }
}


