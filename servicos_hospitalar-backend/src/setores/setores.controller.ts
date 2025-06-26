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
import { SetoresService } from './setores.service';
import { CreateSetorDto, UpdateSetorDto } from './dto';
// import { PermissionGuard } from '../auth/guards/permission.guard';
// import { RequireSistema, RequireNivel } from '../auth/decorators/require-permission.decorator';

@Controller('setores')
// @UseGuards(PermissionGuard)
export class SetoresController {
  constructor(private readonly setoresService: SetoresService) {}

  @Post()
  // @RequireSistema('Sistema GP')
  // @RequireNivel(2)
  create(@Body() createSetorDto: CreateSetorDto) {
    return this.setoresService.create(createSetorDto);
  }

  @Get()
  // @RequireSistema('Sistema GP')
  // @RequireNivel(1)
  findAll() {
    return this.setoresService.findAll();
  }

  @Get(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(1)
  findOne(@Param('id') id: string) {
    return this.setoresService.findOne(id);
  }

  @Patch(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(2)
  update(@Param('id') id: string, @Body() updateSetorDto: UpdateSetorDto) {
    return this.setoresService.update(id, updateSetorDto);
  }

  @Delete(':id')
  // @RequireSistema('Sistema GP')
  // @RequireNivel(3)
  remove(@Param('id') id: string) {
    return this.setoresService.remove(id);
  }
} 