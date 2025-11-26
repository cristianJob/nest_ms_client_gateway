import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', { id }).pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':status')
  findAllStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status }).pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    return this.client.send('changeOrderStatus', { id, status: statusDto.status }).pipe(
      catchError((error: Error) => {
        throw new RpcException(error);
      }),
    );
  }
}
