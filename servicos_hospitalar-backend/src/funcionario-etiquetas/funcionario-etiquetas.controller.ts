import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FuncionarioEtiquetasService } from './funcionario-etiquetas.service';
import { CreateFuncionarioEtiquetaDto, UpdateFuncionarioEtiquetaDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { RequestWithUser } from '../logs/logs.interceptor';

@Controller('funcionario-etiquetas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FuncionarioEtiquetasController {
  constructor(private readonly funcionarioEtiquetasService: FuncionarioEtiquetasService) {}

  @Post()
  @RequirePermission('GP', 2)
  create(@Body() createFuncionarioEtiquetaDto: CreateFuncionarioEtiquetaDto, @Request() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionarioEtiquetasService.create(createFuncionarioEtiquetaDto, usuarioId, ip, userAgent);
  }

  @Get()
  @RequirePermission('GP', 1)
  findAll() {
    return this.funcionarioEtiquetasService.findAll();
  }

  @Get('funcionario/:funcionarioId')
  @RequirePermission('GP', 1)
  findByFuncionario(@Param('funcionarioId') funcionarioId: string) {
    return this.funcionarioEtiquetasService.findByFuncionario(funcionarioId);
  }

  @Get(':id')
  @RequirePermission('GP', 1)
  findOne(@Param('id') id: string) {
    return this.funcionarioEtiquetasService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('GP', 2)
  update(@Param('id') id: string, @Body() updateFuncionarioEtiquetaDto: UpdateFuncionarioEtiquetaDto, @Request() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionarioEtiquetasService.update(id, updateFuncionarioEtiquetaDto, usuarioId, ip, userAgent);
  }

  @Delete(':id')
  @RequirePermission('GP', 2)
  remove(@Param('id') id: string, @Request() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionarioEtiquetasService.remove(id, usuarioId, ip, userAgent);
  }

  @Get('debug/all')
  @RequirePermission('GP', 1)
  async debugAll() {
    return this.funcionarioEtiquetasService.findAll();
  }
} 