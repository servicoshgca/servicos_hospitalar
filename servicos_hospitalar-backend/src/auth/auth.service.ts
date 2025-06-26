import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(cpf: string, password: string) {
    // Usar o serviço de usuários para validar credenciais
    const user = await this.usersService.login(cpf, password);
    
    // Gerar token JWT
    const payload = { 
      sub: user.id, 
      funcionarioId: user.funcionario.id,
      cpf: user.funcionario.cpf,
      nome: user.funcionario.nome,
      permissoes: user.permissoes.map(p => ({
        sistemaId: p.sistema.id,
        perfilId: p.perfil.id,
        nivel: p.perfil.nivel
      }))
    };
    
    const token = await this.jwtService.signAsync(payload);
    
    return {
      access_token: token,
      user: user,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
} 