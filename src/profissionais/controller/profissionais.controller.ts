import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProfissionaisService } from '../services/profissionais.service';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';

@Controller('profissionais')
export class ProfissionaisController {

  constructor(private readonly service: ProfissionaisService) {}

  @Post()
  create(@Body() data: CreateProfissionalDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}