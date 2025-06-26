import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (sistema: string, nivel: number = 1) =>
  SetMetadata('permission', { sistema, nivel });

export const RequireSistema = (sistema: string) =>
  SetMetadata('sistema', sistema);

export const RequireNivel = (nivel: number) =>
  SetMetadata('nivel', nivel); 