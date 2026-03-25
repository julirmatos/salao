import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClientesService } from '../services/clientes.service';
import { Cliente } from '../entities/cliente.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  // 🔐 CLIENTE LOGADO
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('eu')
  async getMe(@GetCliente() user: any) {
   const cliente = await this.clientesService.findOne(user.id);

   delete user.senha; // 🔐 remove a senha

    return cliente;
  }

  // CREATE
  @Post()
  create(@Body() cliente: Cliente) {
    return this.clientesService.create(cliente);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(Number(id));
  }

  // UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() dados: Partial<Cliente>) {
    return this.clientesService.update(Number(id), dados);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(Number(id));
  }
}