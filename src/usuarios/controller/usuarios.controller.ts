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

import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../entities/usuarios.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {

  constructor(private readonly usuariosService: UsuariosService) {}

  // 🔐 Perfil do usuário logado
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getMe(@Req() req: any) {

    const usuario = await this.usuariosService.findOne(req.user.sub);

    const { senha, ...resultado } = usuario;

    return resultado;
  }

  // ➕ Criar usuário
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() usuario: Usuario) {
    return this.usuariosService.create(usuario);
  }

  // 📋 Listar todos
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usuariosService.findAll();
  }

  // 🔍 Buscar por ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  // ✏️ Atualizar
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dados: Partial<Usuario>
  ) {
    return this.usuariosService.update(id, dados);
  }

  // ❌ Remover
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}