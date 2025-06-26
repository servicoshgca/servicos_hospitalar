import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoEtiquetaDto } from './create-tipo-etiqueta.dto';

export class UpdateTipoEtiquetaDto extends PartialType(CreateTipoEtiquetaDto) {} 