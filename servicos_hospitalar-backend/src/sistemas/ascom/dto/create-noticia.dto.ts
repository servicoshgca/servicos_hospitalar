import { IsString, IsOptional, IsBoolean, IsDate, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoticiaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  subtitulo?: string;

  @IsString()
  conteudo: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsString()
  autorId: string;

  @IsOptional()
  @IsBoolean()
  publicada?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataPublicacao?: Date;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 