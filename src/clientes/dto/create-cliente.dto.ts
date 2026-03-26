import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  senha!: string;

  @ApiProperty()
  telefone!: string;

  @ApiProperty({ required: false })
  cpf?: string;

  @ApiProperty({ required: false })
  dataNascimento?: Date;

  @ApiProperty({ required: false })
  cep?: string;

  @ApiProperty({ required: false })
  logradouro?: string;

  @ApiProperty({ required: false })
  numero?: string;

  @ApiProperty({ required: false })
  complemento?: string;

  @ApiProperty({ required: false })
  bairro?: string;

  @ApiProperty({ required: false })
  cidade?: string;

  @ApiProperty({ required: false })
  estado?: string;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty({ required: false })
  foto?: string;
}