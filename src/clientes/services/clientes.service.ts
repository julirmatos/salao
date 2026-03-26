import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateClienteDto } from '../dto/create-cliente.dto';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // ➕ CREATE (Cliente + Usuario)
  async create(data: CreateClienteDto): Promise<Cliente> {

    // 🔍 verifica se email já existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email: data.email }
    });

    if (usuarioExistente) {
      throw new BadRequestException('Email já cadastrado');
    }

    // 🔐 cria usuário (somente autenticação)
    const usuario = this.usuarioRepository.create({
      email: data.email,
      senha: await bcrypt.hash(data.senha, 10),
      role: 'cliente'
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // 👤 cria cliente (perfil)
    const cliente = this.clienteRepository.create({
      nome: data.nome,
      telefone: data.telefone,
      cpf: data.cpf,
      dataNascimento: data.dataNascimento,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      observacoes: data.observacoes,
      foto: data.foto,
      usuario: usuarioSalvo
    });

    return await this.clienteRepository.save(cliente);
  }

  // 🔍 Buscar cliente pelo usuário logado
  async findByUsuarioId(usuarioId: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario']
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  // 🔍 Buscar por ID
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  // 📋 Listar todos
  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      relations: ['usuario']
    });
  }

  // ✏️ UPDATE
  async update(id: number, dados: Partial<Cliente>): Promise<Cliente> {
    const cliente = await this.findOne(id);

    Object.assign(cliente, dados);

    return await this.clienteRepository.save(cliente);
  }

  // ❌ DELETE
  async remove(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    return await this.clienteRepository.remove(cliente);
  }
}