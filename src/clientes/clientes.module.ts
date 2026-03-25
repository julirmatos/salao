import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClientesService } from '../clientes/services/clientes.service';
import { ClientesController } from '../clientes/controller/cliente.controller';
import { Bcrypt } from '../auth/bcrypt/bcrypt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService, Bcrypt, JwtModule],
  exports: [ClientesService],
})
export class ClientesModule {}