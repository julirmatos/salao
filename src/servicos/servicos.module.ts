import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Servico } from './entities/servicos.entity';
import { Profissional } from '../profissionais/entities/profissionais.entity';

import { ServicosService } from './services/servicos.service';
import { ServicosController } from './controller/servicos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servico, Profissional])
  ],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}