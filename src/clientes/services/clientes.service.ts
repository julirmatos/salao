import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  // CREATE
  async create(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }

  // READ ALL
  async findAll() {
    return this.clienteRepository.find();
  }

  // READ ONE
  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
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