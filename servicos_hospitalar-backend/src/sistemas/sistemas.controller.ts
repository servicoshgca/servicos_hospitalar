import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { CreateSistemaDto, UpdateSistemaDto } from './dto';

@Controller('sistemas')
export class SistemasController {
  constructor(private readonly sistemasService: SistemasService) {}

  @Post()
  create(@Body() createSistemaDto: CreateSistemaDto) {
    return this.sistemasService.create(createSistemaDto);
  }

  @Get()
  findAll() {
    return this.sistemasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sistemasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSistemaDto: UpdateSistemaDto) {
    return this.sistemasService.update(id, updateSistemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sistemasService.remove(id);
  }
} 