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

@ApiTags('Clientes') // Organiza os endpoints no Swagger
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getMe(@Req() req: any) {
    // O userId vem do payload do Token validado no JwtStrategy
    const cliente = await this.clientesService.findOne(req.user.userId);
    // Remove a senha do retorno por segurança
    const { senha, ...resultado } = cliente;
    return resultado;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() cliente: Cliente) {
    return this.clientesService.create(cliente);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // Usamos ParseIntPipe para converter o ID da URL de string para number automaticamente
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() dados: Partial<Cliente>) {
    return this.clientesService.update(id, dados);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}