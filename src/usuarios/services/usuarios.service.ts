import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // ➕ CREATE
  async create(usuario: Usuario): Promise<Usuario> {

    // criptografa senha
    usuario.senha = await bcrypt.hash(usuario.senha, 10);

    return await this.usuarioRepository.save(usuario);
  }

  // 🔍 Buscar por email (usado no Auth)
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOneBy({ email });
  }

  // 🔍 Buscar por ID
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  // 📋 Listar todos
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  // ✏️ UPDATE
  async update(id: number, dados: Partial<Usuario>): Promise<Usuario> {

    const usuario = await this.findOne(id);

    // se estiver atualizando senha → criptografa
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    Object.assign(usuario, dados);

    return await this.usuarioRepository.save(usuario);
  }

  // ❌ DELETE
  async remove(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    return await this.usuarioRepository.remove(usuario);
  }
}