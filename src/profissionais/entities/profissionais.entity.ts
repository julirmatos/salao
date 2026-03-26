import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
import { Especialidade } from '../enums/especialidade.enum';

@Entity('profissionais')
export class Profissional {

  @PrimaryGeneratedColumn()
  id!: number;

  // 🔗 relação com usuário
  @OneToOne(() => Usuario, usuario => usuario.profissional, { cascade: true })
  @JoinColumn()
  usuario!: Usuario;

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