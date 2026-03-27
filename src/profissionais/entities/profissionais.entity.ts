import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Especialidade } from '../enums/especialidade.enum';
import { Servico } from '../../servicos/entities/servicos.entity';

@Entity('profissionais')
export class Profissional {

  @PrimaryGeneratedColumn()
  id!: number;

  // 🔗 relação com usuário (lado dono)
  @OneToOne(() => Usuario, { cascade: true })
  @JoinColumn()
  usuario!: Usuario;

  // 🔗 serviços do profissional
  @OneToMany(() => Servico, (servico) => servico.profissional)
  servicos!: Servico[];

  @Column({ length: 100 })
  nome!: string;

  @Column({ length: 20 })
  telefone!: string;

  @Column({
    type: 'enum',
    enum: Especialidade
  })
  especialidade!: Especialidade;

  @Column({ nullable: true })
  foto?: string;
}