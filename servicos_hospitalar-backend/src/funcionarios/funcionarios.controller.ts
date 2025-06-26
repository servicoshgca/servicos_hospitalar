import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequestWithUser } from '../logs/logs.interceptor';

@Controller('funcionarios')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post()
  @RequirePermission('GP', 2)
  create(@Body() createFuncionarioDto: CreateFuncionarioDto, @Req() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionariosService.create(createFuncionarioDto, usuarioId, ip, userAgent);
  }

  @Get()
  @RequirePermission('GP', 1)
  findAll() {
    return this.funcionariosService.findAll();
  }

  @Get(':id')
  @RequirePermission('GP', 1)
  findOne(@Param('id') id: string) {
    return this.funcionariosService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('GP', 2)
  update(@Param('id') id: string, @Body() updateFuncionarioDto: UpdateFuncionarioDto, @Req() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionariosService.update(id, updateFuncionarioDto, usuarioId, ip, userAgent);
  }

  @Delete(':id')
  @RequirePermission('GP', 3)
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.funcionariosService.remove(id, usuarioId, ip, userAgent);
  }
} 