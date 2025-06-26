import { PartialType } from '@nestjs/mapped-types';
import { CreateVinculoDto } from './create-vinculo.dto';

export class UpdateVinculoDto extends PartialType(CreateVinculoDto) {} 