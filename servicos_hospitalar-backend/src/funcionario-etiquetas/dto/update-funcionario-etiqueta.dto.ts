import { PartialType } from '@nestjs/mapped-types';
import { CreateFuncionarioEtiquetaDto } from './create-funcionario-etiqueta.dto';

export class UpdateFuncionarioEtiquetaDto extends PartialType(CreateFuncionarioEtiquetaDto) {} 