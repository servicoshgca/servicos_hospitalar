import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoNaoEntregueDto } from './create-pedido-nao-entregue.dto';

export class UpdatePedidoNaoEntregueDto extends PartialType(CreatePedidoNaoEntregueDto) {} 