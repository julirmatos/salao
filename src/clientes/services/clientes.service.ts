import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private bcrypt: Bcrypt // Injetado para proteger a senha no cadastro
  ) {}

  async create(cliente: Cliente): Promise<Cliente> {
    // Verifique no seu arquivo bcrypt.ts se o nome é 'criptografarSenha'
    cliente.senha = await this.bcrypt.criptografarSenha(cliente.senha); 
    return await this.clienteRepository.save(cliente);
}

  // Método essencial para o funcionamento do AuthService.validateUser
  async findByEmail(email: string): Promise<Cliente | null> { 
    return await this.clienteRepository.findOneBy({ email });
}

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find();
  }

  // UPDATE
  async update(id: number, dados: Partial<Cliente>) {
    const cliente = await this.findOne(id);

    Object.assign(cliente, dados);

    return this.clienteRepository.save(cliente);
  }

  // DELETE
  async remove(id: number) {
    const cliente = await this.findOne(id);

    return this.clienteRepository.remove(cliente);
  }
}