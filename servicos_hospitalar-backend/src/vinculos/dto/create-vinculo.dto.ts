import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateVinculoDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 