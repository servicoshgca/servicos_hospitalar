import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoRefeicaoDto } from './create-pedido-refeicao.dto';

export class UpdatePedidoRefeicaoDto extends PartialType(CreatePedidoRefeicaoDto) {} 