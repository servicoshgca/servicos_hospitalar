import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSistemaDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 