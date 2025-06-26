import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredSistema = this.reflector.get<string>('sistema', context.getHandler());
    const requiredNivel = this.reflector.get<number>('nivel', context.getHandler());

    if (!requiredSistema) {
      return true; // Se não especificar sistema, permite acesso
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id; // Assumindo que o usuário está no request após autenticação

    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const hasPermission = await this.usersService.hasPermission(
      userId,
      requiredSistema,
      requiredNivel || 1,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Acesso negado. Permissão insuficiente.');
    }

    return true;
  }
} 