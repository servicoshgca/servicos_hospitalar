import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoEntregueDto } from './create-pedido-entregue.dto';

export class UpdatePedidoEntregueDto extends PartialType(CreatePedidoEntregueDto) {} 