import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ParseIntPipe
} from '@nestjs/common';

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

  @Get('data/:data')
  findByDate(@Param('data') data: string) {
    return this.service.findByDate(data);
  }

  @Put(':id/remarcar')
  remarcar(
    @Param('id', ParseIntPipe) id: number,
    @Body('dataHora') dataHora: Date
  ) {
    return this.service.remarcar(id, dataHora);
  }

  @Put(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancelar(id);
  }
}