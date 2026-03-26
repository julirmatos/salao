import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';

import { ProfissionaisService } from '../services/profissionais.service';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';

import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/decorators/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../usuarios/enums/role.enum';

@Controller('profissionais')
export class ProfissionaisController {

  constructor(private readonly service: ProfissionaisService) {}

  // 🔒 SOMENTE ADMIN pode criar profissional
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: CreateProfissionalDto) {
    return this.service.create(data);
  }

  // 🔓 PÚBLICO (cliente pode ver profissionais)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔓 PÚBLICO
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // 🔒 SOMENTE PROFISSIONAL acessa seu painel
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROFISSIONAL)
  @Get('painel')
  getPainel() {
    return 'Painel do profissional';
  }
}