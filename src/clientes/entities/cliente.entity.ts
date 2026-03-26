import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuarios.entity';

@Entity('clientes')
export class Cliente {

  @PrimaryGeneratedColumn()
  id!: number;

  // 🔗 relacionamento com usuario (dono da relação)
  @OneToOne(() => Usuario, usuario => usuario.cliente, { cascade: true })
  @JoinColumn()
  usuario!: Usuario;

  @Column({ length: 100 })
  nome!: string;

  @Column({ length: 20 })
  telefone!: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento?: Date;

  @Column({ length: 11, unique: true })
  cpf!: string;

  @Column({ length: 9, nullable: true })
  cep?: string;

  @Column({ length: 150, nullable: true })
  logradouro?: string;

  @Column({ length: 10, nullable: true })
  numero?: string;

  @Column({ length: 50, nullable: true })
  complemento?: string;

  @Column({ length: 100, nullable: true })
  bairro?: string;

  @Column({ length: 100, nullable: true })
  cidade?: string;

  @Column({ length: 2, nullable: true })
  estado?: string;

  @Column({ nullable: true })
  observacoes?: string;

  // 📸 caminho da foto
  @Column({ nullable: true })
  foto?: string;
}