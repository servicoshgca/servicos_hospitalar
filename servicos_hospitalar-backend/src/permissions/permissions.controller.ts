import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AssignPermissionDto, UpdatePermissionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  assignPermission(@Body() assignPermissionDto: AssignPermissionDto, @Request() req) {
    return this.permissionsService.assignPermission(assignPermissionDto, req.user.id);
  }

  @Get()
  findAllPermissions(@Request() req) {
    return this.permissionsService.findAllPermissions(req.user.id);
  }

  @Get('available-data')
  getAvailableData(@Request() req) {
    return this.permissionsService.getAvailableData(req.user.id);
  }

  @Get('user/:userId')
  findUserPermissions(@Param('userId') userId: string, @Request() req) {
    return this.permissionsService.findUserPermissions(userId, req.user.id);
  }

  @Patch(':id')
  updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @Request() req) {
    return this.permissionsService.updatePermission(id, updatePermissionDto, req.user.id);
  }

  @Delete(':id')
  removePermission(@Param('id') id: string, @Request() req) {
    return this.permissionsService.removePermission(id, req.user.id);
  }
} 