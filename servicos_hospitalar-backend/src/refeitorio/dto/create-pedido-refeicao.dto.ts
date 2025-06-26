import { IsString, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreatePedidoRefeicaoDto {
  @IsString()
  tipoRefeicao: string; // CAFE, ALMOCO, JANTAR, CEIA

  @IsDateString()
  dataRefeicao: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsObject()
  opcoes?: {
    // Almoço
    almoco?: boolean;
    almocoDieta?: boolean;
    almocoDietaTropical?: boolean;
    salada?: boolean;
    guarnicao?: boolean;
    acompanhamento1?: boolean;
    acompanhamento2?: boolean;
    pratoPrincipal?: boolean;
    opcao?: boolean;
    sobremesa?: boolean;
    suco?: boolean;
    // Jantar
    jantar?: boolean;
    jantarTropical?: boolean;
  };

  @IsOptional()
  @IsString()
  setorPedidoId?: string;
} 