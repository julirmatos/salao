import { ApiProperty } from '@nestjs/swagger';
import { Especialidade } from '../enums/especialidade.enum';

export class CreateProfissionalDto {

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  senha!: string;

  @ApiProperty()
  telefone!: string;

  @ApiProperty({ enum: Especialidade })
especialidade!: Especialidade;

  @ApiProperty({ required: false })
  foto?: string;
}