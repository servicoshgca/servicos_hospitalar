import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AscomService } from './ascom.service';
import { CreateNoticiaDto, UpdateNoticiaDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('ascom')
export class AscomController {
  constructor(private readonly ascomService: AscomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNoticiaDto: CreateNoticiaDto, @Request() req) {
    return this.ascomService.create(createNoticiaDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.ascomService.findAll(req.user.id);
  }

  @Get('public')
  findPublic() {
    return this.ascomService.findPublic();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.ascomService.findOne(id, req.user.id);
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.ascomService.findOnePublic(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto, @Request() req) {
    return this.ascomService.update(id, updateNoticiaDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.ascomService.remove(id, req.user.id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  publish(@Param('id') id: string, @Request() req) {
    return this.ascomService.publish(id, req.user.id);
  }
} 