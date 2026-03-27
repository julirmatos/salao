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

  // ➕ CREATE
  async create(data: CreateAgendamentoDto): Promise<Agendamento> {

    const servico = await this.servicoRepository.findOneBy({
      id: data.servicoId
    });

    if (!servico) throw new NotFoundException('Serviço não encontrado');

    const profissional = await this.profissionalRepository.findOneBy({
      id: data.profissionalId
    });

    if (!profissional) throw new NotFoundException('Profissional não encontrado');

    const inicio = new Date(data.dataHora);
    const fim = new Date(inicio.getTime() + servico.duracao * 60000);

    // 🚫 data passada
    if (inicio < new Date()) {
      throw new BadRequestException('Não é possível agendar no passado');
    }

    // 🚫 fora do horário (09h às 18h)
    const hora = inicio.getHours();
    if (hora < 9 || hora >= 18) {
      throw new BadRequestException('Fora do horário de funcionamento');
    }

    // 🚫 conflito de horário
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
      throw new BadRequestException('Horário indisponível');
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

  // 📋 LISTAR TODOS
  async findAll(): Promise<Agendamento[]> {
    return this.agendamentoRepository.find({
      relations: ['servico', 'profissional'],
      order: { dataHoraInicio: 'ASC' }
    });
  }

  // 📆 AGENDA DO DIA
  async findByDate(data: string): Promise<Agendamento[]> {

    const inicioDia = new Date(`${data}T00:00:00`);
    const fimDia = new Date(`${data}T23:59:59`);

    return this.agendamentoRepository.find({
      where: {
        dataHoraInicio: Between(inicioDia, fimDia)
      },
      relations: ['servico', 'profissional'],
      order: { dataHoraInicio: 'ASC' }
    });
  }

  // 🔄 REMARCAR
  async remarcar(id: number, novaData: Date): Promise<Agendamento> {

    const agendamento = await this.agendamentoRepository.findOne({
      where: { id },
      relations: ['servico', 'profissional']
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    const inicio = new Date(novaData);
    const fim = new Date(inicio.getTime() + agendamento.servico.duracao * 60000);

    // mesmas validações
    if (inicio < new Date()) {
      throw new BadRequestException('Data inválida');
    }

    const hora = inicio.getHours();
    if (hora < 9 || hora >= 18) {
      throw new BadRequestException('Fora do horário');
    }

    const conflito = await this.agendamentoRepository
      .createQueryBuilder('agendamento')
      .where('agendamento.profissionalId = :profissionalId', {
        profissionalId: agendamento.profissional.id
      })
      .andWhere('agendamento.id != :id', { id })
      .andWhere(
        `(agendamento.dataHoraInicio < :fim AND agendamento.dataHoraFim > :inicio)`,
        { inicio, fim }
      )
      .getOne();

    if (conflito) {
      throw new BadRequestException('Horário indisponível');
    }

    agendamento.dataHoraInicio = inicio;
    agendamento.dataHoraFim = fim;

    return this.agendamentoRepository.save(agendamento);
  }

  // ❌ CANCELAR
  async cancelar(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.findOneBy({ id });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    agendamento.status = StatusAgendamento.CANCELADO;

    return this.agendamentoRepository.save(agendamento);
  }
}