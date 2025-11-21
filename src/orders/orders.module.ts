import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { envs, ORDER_SERVICE } from 'src/config';
import { Transport } from '@nestjs/microservices/enums/transport.enum';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.orderMicroserviceHost,
          port: envs.orderMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
