import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  cpf: string;

  @IsString()
  password: string;
} 