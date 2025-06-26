import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoEtiquetaDto {
  @IsString()
  nome: string;

  @IsString()
  icone: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 