import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VinculosService } from './vinculos.service';
import { CreateVinculoDto, UpdateVinculoDto } from './dto';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequireSistema, RequireNivel } from '../auth/decorators/require-permission.decorator';

@Controller('vinculos')
// @UseGuards(PermissionGuard)
export class VinculosController {
  constructor(private readonly vinculosService: VinculosService) {}

  @Post()
  // @RequireSistema('Sistema GP')
  // @RequireNivel(2)
  create(@Body() createVinculoDto: CreateVinculoDto) {
    return this.vinculosService.create(createVinculoDto);
  }

  @Get()
  // @RequireSistema('Sistema GP')
  // @RequireNivel(1)
  findAll() {
    return this.vinculosService.findAll();
  }

  @Get(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(1)
  findOne(@Param('id') id: string) {
    return this.vinculosService.findOne(id);
  }

  @Patch(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(2)
  update(@Param('id') id: string, @Body() updateVinculoDto: UpdateVinculoDto) {
    return this.vinculosService.update(id, updateVinculoDto);
  }

  @Delete(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(3)
  remove(@Param('id') id: string) {
    return this.vinculosService.remove(id);
  }
} 