import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { RequireSistema, RequireNivel } from '../../auth/decorators/require-permission.decorator';

@Controller('gp')
@UseGuards(PermissionGuard)
export class GpController {
  
  // Endpoint que requer acesso ao Sistema GP com nível mínimo 1 (usuário comum)
  @Get('funcionarios')
  @RequireSistema('Sistema GP')
  @RequireNivel(1)
  getFuncionarios() {
    return {
      message: 'Lista de funcionários',
      data: [
        { id: 1, nome: 'João Silva', cargo: 'Enfermeiro' },
        { id: 2, nome: 'Maria Santos', cargo: 'Médico' },
      ]
    };
  }

  // Endpoint que requer acesso ao Sistema GP com nível mínimo 2 (gestor)
  @Post('funcionarios')
  @RequireSistema('Sistema GP')
  @RequireNivel(2)
  createFuncionario(@Body() funcionario: any) {
    return {
      message: 'Funcionário criado com sucesso',
      data: funcionario
    };
  }

  // Endpoint que requer acesso ao Sistema GP com nível mínimo 3 (admin)
  @Get('relatorios')
  @RequireSistema('Sistema GP')
  @RequireNivel(3)
  getRelatorios() {
    return {
      message: 'Relatórios administrativos',
      data: [
        { id: 1, nome: 'Relatório de Férias', tipo: 'administrativo' },
        { id: 2, nome: 'Relatório de Salários', tipo: 'financeiro' },
      ]
    };
  }
} 