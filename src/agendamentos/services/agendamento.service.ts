import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Agendamento, StatusAgendamento } from '../entities/agendamento.entity';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { Servico } from '../../servicos/entities/servicos.entity';
import { Profissional } from '../../profissionais/entities/profissionais.entity';

@Injectable()
export class AgendamentosService {

  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,

    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,

    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async create(data: CreateAgendamentoDto): Promise<Agendamento> {

    const servico = await this.servicoRepository.findOneBy({
      id: data.servicoId
    });

    if (!servico) throw new NotFoundException('Serviço não encontrado');

    const profissional = await this.profissionalRepository.findOneBy({
      id: data.profissionalId
    });

    if (!profissional) throw new NotFoundException('Profissional não encontrado');

    // ⏱️ calcular horário fim baseado na duração do serviço
    const inicio = new Date(data.dataHora);
    const fim = new Date(inicio.getTime() + servico.duracao * 60000);

    // 🚫 VERIFICAR CONFLITO DE HORÁRIO (PROFISSIONAL)
    const conflito = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .where('agendamento.profissionalId = :profissionalId', {
        profissionalId: data.profissionalId
      })
      .andWhere('agendamento.status = :status', {
        status: StatusAgendamento.AGENDADO
      })
      .andWhere(
        `(agendamento.dataHoraInicio < :fim AND agendamento.dataHoraFim > :inicio)`,
        { inicio, fim }
      )
      .getOne();

    if (conflito) {
      throw new BadRequestException('Horário indisponível para este profissional');
    }

    const agendamento = this.agendamentoRepository.create({
      clienteNome: data.clienteNome,
      dataHoraInicio: inicio,
      dataHoraFim: fim,
      status: StatusAgendamento.AGENDADO,
      servico,
      profissional,
    });

    return this.agendamentoRepository.save(agendamento);
  }

  async findAll(): Promise<Agendamento[]> {
    return this.agendamentoRepository.find({
      relations: ['servico', 'profissional']
    });
  }

  async findByProfissional(profissionalId: number) {
    return this.agendamentoRepository.find({
      where: { profissional: { id: profissionalId } },
      relations: ['servico']
    });
  }

  async cancelar(id: number) {
    const agendamento = await this.agendamentoRepository.findOneBy({ id });

    if (!agendamento) throw new NotFoundException('Agendamento não encontrado');

    agendamento.status = StatusAgendamento.CANCELADO;

    return this.agendamentoRepository.save(agendamento);
  }
}