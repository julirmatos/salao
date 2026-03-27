import { Controller, Post, Body, Get } from '@nestjs/common';
import { AgendamentosService } from '../services/agendamento.service';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';

@Controller('agendamentos')
export class AgendamentosController {

  constructor(private readonly service: AgendamentosService) {}

  @Post()
  create(@Body() data: CreateAgendamentoDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}