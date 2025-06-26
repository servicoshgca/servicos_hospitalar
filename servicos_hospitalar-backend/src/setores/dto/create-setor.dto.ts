import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateSetorDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  coordenador?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 