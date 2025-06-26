import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class AssignPermissionDto {
  @IsString()
  userId: string;

  @IsString()
  sistemaId: string;

  @IsString()
  perfilId: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
} 