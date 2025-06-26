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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AssignPermissionDto, LoginUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/permissions')
  getUserPermissions(@Param('id') id: string) {
    return this.usersService.getUserPermissions(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/permissions')
  assignPermission(
    @Param('id') id: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.usersService.assignPermission(id, assignPermissionDto);
  }

  @Delete(':id/permissions/:sistemaId')
  removePermission(
    @Param('id') id: string,
    @Param('sistemaId') sistemaId: string,
  ) {
    return this.usersService.removePermission(id, sistemaId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { cpf, password } = loginUserDto;
    return this.usersService.login(cpf, password);
  }
} 