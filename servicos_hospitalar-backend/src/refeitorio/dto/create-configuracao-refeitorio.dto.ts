import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConfiguracaoRefeitorioDto {
  @IsOptional()
  @IsNumber()
  valorCafe?: number;

  @IsOptional()
  @IsNumber()
  valorAlmoco?: number;

  @IsOptional()
  @IsNumber()
  valorJantar?: number;

  @IsOptional()
  @IsNumber()
  valorCeia?: number;

  // Horários do refeitório por tipo de refeição
  @IsOptional()
  @IsString()
  horarioInicioCafe?: string;

  @IsOptional()
  @IsString()
  horarioFimCafe?: string;

  @IsOptional()
  @IsString()
  horarioInicioAlmoco?: string;

  @IsOptional()
  @IsString()
  horarioFimAlmoco?: string;

  @IsOptional()
  @IsString()
  horarioInicioJantar?: string;

  @IsOptional()
  @IsString()
  horarioFimJantar?: string;

  @IsOptional()
  @IsString()
  horarioInicioCeia?: string;

  @IsOptional()
  @IsString()
  horarioFimCeia?: string;

  // Horários para pedidos por tipo de refeição
  @IsOptional()
  @IsString()
  horarioInicioPedidosCafe?: string;

  @IsOptional()
  @IsString()
  horarioFimPedidosCafe?: string;

  @IsOptional()
  @IsString()
  horarioInicioPedidosAlmoco?: string;

  @IsOptional()
  @IsString()
  horarioFimPedidosAlmoco?: string;

  @IsOptional()
  @IsString()
  horarioInicioPedidosJantar?: string;

  @IsOptional()
  @IsString()
  horarioFimPedidosJantar?: string;

  @IsOptional()
  @IsString()
  horarioInicioPedidosCeia?: string;

  @IsOptional()
  @IsString()
  horarioFimPedidosCeia?: string;

  // Horários para dietas
  @IsOptional()
  @IsString()
  horarioInicioDietas?: string;

  @IsOptional()
  @IsString()
  horarioFimDietas?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 