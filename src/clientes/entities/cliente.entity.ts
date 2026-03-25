import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('clientes')
export class Cliente {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;
 
  @Column({ type: 'date', nullable: true })
  dataNascimento?: Date;

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
  
  @Column({ length: 20 })
  telefone!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 11, unique: true })
  cpf!: string;

  @Column()
  senha!: string;

  @Column({ nullable: true })
  observacoes?: string;

  // 📸 caminho da foto (upload local)
  @Column({ nullable: true })
  foto?: string;

  // 🔐 criptografia da senha
  @BeforeInsert()
  async hashSenha() {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
}