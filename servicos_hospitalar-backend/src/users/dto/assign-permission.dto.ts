import { IsString } from 'class-validator';

export class AssignPermissionDto {
  @IsString()
  sistemaId: string;

  @IsString()
  perfilId: string;
} 