import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  UseGuards, 
  Req, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';

import { ClientesService } from '../services/clientes.service';
import { Cliente } from '../entities/cliente.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {

  constructor(private readonly clientesService: ClientesService) {}

  // 🔐 Perfil do cliente logado
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getMe(@Req() req: any) {

    return this.clientesService.findByUsuarioId(req.user.sub);
  }

  // ➕ Criar cliente (cria usuario + cliente)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateClienteDto) {
  return this.clientesService.create(data);
}
  // 📋 Listar todos
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.clientesService.findAll();
  }

  // 🔍 Buscar por ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  // ✏️ Atualizar
  @Put('perfil')
@UseGuards(JwtAuthGuard)
updatePerfil(@Req() req, @Body() data: UpdateClienteDto) {
  return this.clientesService.update(req.user.sub, data);
}

  // ❌ Remover
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}