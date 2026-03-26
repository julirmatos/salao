import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';
import { ClientesService } from './services/clientes.service';
import { ClientesController } from './controller/cliente.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, Usuario])
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}