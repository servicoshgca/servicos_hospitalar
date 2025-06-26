import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePedidoEntregueDto {
  @IsString()
  funcionarioId: string;

  @IsOptional()
  @IsString()
  pedidoRefeicaoId?: string;

  @IsString()
  tipoRefeicao: string;

  @IsDateString()
  dataRefeicao: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
} 