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
import { TiposEtiquetasService } from './tipos-etiquetas.service';
import { CreateTipoEtiquetaDto, UpdateTipoEtiquetaDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequestWithUser } from '../logs/logs.interceptor';

@Controller('tipos-etiquetas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TiposEtiquetasController {
  constructor(private readonly tiposEtiquetasService: TiposEtiquetasService) {}

  @Post()
  @RequirePermission('GP', 3)
  create(@Body() createTipoEtiquetaDto: CreateTipoEtiquetaDto, @Req() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.tiposEtiquetasService.create(createTipoEtiquetaDto, usuarioId, ip, userAgent);
  }

  @Get()
  @RequirePermission('GP', 1)
  findAll() {
    return this.tiposEtiquetasService.findAll();
  }

  @Get('icones')
  @RequirePermission('GP', 1)
  getIconesDisponiveis() {
    return this.tiposEtiquetasService.getIconesDisponiveis();
  }

  @Get(':id')
  @RequirePermission('GP', 1)
  findOne(@Param('id') id: string) {
    return this.tiposEtiquetasService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('GP', 3)
  update(
    @Param('id') id: string,
    @Body() updateTipoEtiquetaDto: UpdateTipoEtiquetaDto,
    @Req() request: RequestWithUser,
  ) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.tiposEtiquetasService.update(id, updateTipoEtiquetaDto, usuarioId, ip, userAgent);
  }

  @Delete(':id')
  @RequirePermission('GP', 3)
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    const usuarioId = request.user?.id;
    const ip = request['clientIp'];
    const userAgent = request['userAgent'];
    
    return this.tiposEtiquetasService.remove(id, usuarioId, ip, userAgent);
  }
} 