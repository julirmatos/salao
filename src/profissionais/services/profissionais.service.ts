import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profissional } from '../entities/profissionais.entity';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateProfissionalDto } from '../dto/create-profissional.dto';

@Injectable()
export class ProfissionaisService {

  constructor(
    @InjectRepository(Profissional)
    private profissionalRepository: Repository<Profissional>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateProfissionalDto): Promise<Profissional> {

    // verifica email
    const existe = await this.usuarioRepository.findOne({
      where: { email: data.email }
    });

    if (existe) {
      throw new BadRequestException('Email já cadastrado');
    }

    // cria usuário
    const usuario = this.usuarioRepository.create({
      email: data.email,
      senha: await bcrypt.hash(data.senha, 10),
      role: 'profissional'
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // cria profissional
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
}