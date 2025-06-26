import { IsString, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateFuncionarioEtiquetaDto {
  @IsString()
  @IsNotEmpty()
  funcionarioId: string;

  @IsString()
  @IsNotEmpty()
  tipoEtiquetaId: string;

  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @IsDateString()
  @IsOptional()
  dataFim?: string;

  @IsString()
  @IsOptional()
  arquivoPdf?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
} 