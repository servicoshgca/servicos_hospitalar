import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracaoRefeitorioDto } from './create-configuracao-refeitorio.dto';

export class UpdateConfiguracaoRefeitorioDto extends PartialType(CreateConfiguracaoRefeitorioDto) {} 