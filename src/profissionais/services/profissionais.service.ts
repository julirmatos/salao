import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profissional } from '../entities/profissionais.entity';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';
import { Role } from '../../usuarios/enums/role.enum';

@Injectable()
export class ProfissionaisService {

  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateProfissionalDto): Promise<Profissional> {

    // 🔒 validação básica
    if (!data.email || !data.senha || !data.nome) {
      throw new BadRequestException('Dados obrigatórios não informados');
    }

    // 🔍 verifica se email já existe
    const existe = await this.usuarioRepository.findOne({
      where: { email: data.email }
    });

    if (existe) {
      throw new BadRequestException('Email já cadastrado');
    }

    // 🔐 cria usuário (ROLE FORÇADO)
    const usuario = this.usuarioRepository.create({
      email: data.email,
      senha: await bcrypt.hash(data.senha, 10),

      // 🔥 SEGURANÇA TOTAL
      role: Role.PROFISSIONAL
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // 👨‍🔧 cria profissional
    const profissional = this.profissionalRepository.create({
      nome: data.nome,
      telefone: data.telefone,
      especialidade: data.especialidade,
      foto: data.foto,
      usuario: usuarioSalvo
    });

    return await this.profissionalRepository.save(profissional);
  }

  async findAll(): Promise<Profissional[]> {
    return this.profissionalRepository.find({
      relations: ['usuario']
    });
  }

  async findOne(id: number): Promise<Profissional> {
    const profissional = await this.profissionalRepository.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return profissional;
  }

  // 🔒 buscar profissional pelo usuário logado (para painel)
  async findByUsuarioId(usuarioId: number): Promise<Profissional> {
    const profissional = await this.profissionalRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario']
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return profissional;
  }
}