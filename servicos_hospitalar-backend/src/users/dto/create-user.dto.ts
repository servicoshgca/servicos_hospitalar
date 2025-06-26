import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  funcionarioId: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
} 