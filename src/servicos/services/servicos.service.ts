import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Servico } from '../entities/servicos.entity';
import { Repository } from 'typeorm';
import { CreateServicoDto } from '../dto/create-servico.dto';
import { Profissional } from '../../profissionais/entities/profissionais.entity';


@Injectable()
export class ServicosService {

  constructor(
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,

    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,
  ) {}

  // ➕ CREATE
  async create(data: CreateServicoDto): Promise<Servico> {

    const profissional = await this.profissionalRepository.findOneBy({
      id: data.profissionalId
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    const servico = this.servicoRepository.create({
      nome: data.nome,
      valor: data.valor, // ✅ agora alinhado com DTO e Entity
      duracao: data.duracao,
      profissional: profissional, // ✅ relação correta
    });

    return await this.servicoRepository.save(servico);
  }

  // 📋 LISTAR TODOS
  async findAll(): Promise<Servico[]> {
    return this.servicoRepository.find({
      relations: ['profissional'],
    });
  }

  // 🔍 BUSCAR POR ID
  async findOne(id: number): Promise<Servico> {
    const servico = await this.servicoRepository.findOne({
      where: { id },
      relations: ['profissional'],
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return servico;
  }

  // ✏️ UPDATE
  async update(id: number, data: Partial<CreateServicoDto>): Promise<Servico> {

    const servico = await this.findOne(id);

    // 🔁 atualizar profissional (se enviado)
    if (data.profissionalId) {
      const profissional = await this.profissionalRepository.findOneBy({
        id: data.profissionalId
      });

      if (!profissional) {
        throw new NotFoundException('Profissional não encontrado');
      }

      servico.profissional = profissional;
    }

    // 🔁 atualizar campos
    servico.nome = data.nome ?? servico.nome;
    servico.valor = data.valor ?? servico.valor;
    servico.duracao = data.duracao ?? servico.duracao;

    return await this.servicoRepository.save(servico);
  }

  // ❌ DELETE
  async remove(id: number): Promise<void> {
    const servico = await this.findOne(id);
    await this.servicoRepository.remove(servico);
  }

  // 🔎 LISTAR POR PROFISSIONAL
  async findByProfissional(profissionalId: number): Promise<Servico[]> {
    return this.servicoRepository.find({
      where: { profissional: { id: profissionalId } },
      relations: ['profissional'],
    });
  }
}