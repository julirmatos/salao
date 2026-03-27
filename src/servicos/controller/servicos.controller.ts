import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Put, Delete } from '@nestjs/common';
import { ServicosService } from '../services/servicos.service';
import { CreateServicoDto } from '../dto/create-servico.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/decorators/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../usuarios/enums/role.enum';

@Controller('servicos')
export class ServicosController {

  constructor(private readonly service: ServicosService) {}

  // 🔐 ADMIN cria
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: CreateServicoDto) {
    return this.service.create(data);
  }

  // 🔓 público
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔓 público
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // 🔐 ADMIN atualiza
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateServicoDto>
  ) {
    return this.service.update(id, data);
  }

  // 🔐 ADMIN deleta
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // 🔎 EXTRA: serviços por profissional
  @Get('profissional/:id')
  findByProfissional(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByProfissional(id);
  }
}