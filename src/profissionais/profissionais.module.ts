import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './entities/profissionais.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';
import { ProfissionaisService } from './services/profissionais.service';
import { ProfissionaisController } from './controller/profissionais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profissional, Usuario])],
  providers: [ProfissionaisService],
  controllers: [ProfissionaisController],
})
export class ProfissionaisModule {}