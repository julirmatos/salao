import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profissional } from '../../profissionais/entities/profissionais.entity';

@Entity('servicos')
export class Servico {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column('decimal')
  valor!: number;

  @Column()
  duracao!: number; // minutos

  @ManyToOne(() => Profissional, (profissional) => profissional.servicos)
  profissional!: Profissional;
}