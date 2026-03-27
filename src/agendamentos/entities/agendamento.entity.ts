import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Servico } from '../../servicos/entities/servicos.entity';
import { Profissional } from '../../profissionais/entities/profissionais.entity';

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
}

@Entity()
export class Agendamento {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  clienteNome!: string;

  @Column()
  dataHoraInicio!: Date;

  @Column()
  dataHoraFim!: Date;

  @Column({
    type: 'enum',
    enum: StatusAgendamento,
    default: StatusAgendamento.AGENDADO
  })
  status!: StatusAgendamento;

  @ManyToOne(() => Servico)
  servico!: Servico;

  @ManyToOne(() => Profissional)
  profissional!: Profissional;
}