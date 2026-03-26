import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Profissional } from '../../profissionais/entities/profissionais.entity';
@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({ default: 'cliente' })
  role!: string;

  // 🔗 relacionamento com cliente
  @OneToOne(() => Cliente, cliente => cliente.usuario)
  cliente!: Cliente;
  @OneToOne(() => Profissional, profissional => profissional.usuario)
profissional!: Profissional;
}